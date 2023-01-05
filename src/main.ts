import { GooglePubSubTransport } from '@flosportsinc/nestjs-google-pubsub-connector';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const envFilePath = __dirname + '/../.env';
  Logger.log(`Reading .env override from ${envFilePath}`);
  dotenv.config({ path: envFilePath });
  Logger.log(`env ${JSON.stringify(process.env)}`);

  const hybrid_app = process.env.HYBRID_APP == 'true';

  if (!hybrid_app) {
    // Starting as a 'Microservices' app only:
    const app = await NestFactory.createMicroservice(AppModule, {
      strategy: new GooglePubSubTransport({
        createSubscriptions: false,
        // The microservice will configure its own PubSub instance, but you're free to
        // supply your own
        // client: new PubSub
      }),
    });
    await app.listen();
  } else {
    // Starting as a hybrid ('HTTP' + 'Microservices') app:
    const ssl = process.env.SSL === 'true' ? true : false;
    let httpsOptions = null;
    if (ssl) {
      const keyPath = process.env.SSL_KEY_PATH || '';
      const certPath = process.env.SSL_CERT_PATH || '';
      httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
    }
    const app = await NestFactory.create(AppModule, { httpsOptions });

    const microservice = app.connectMicroservice({
      strategy: new GooglePubSubTransport({
        createSubscriptions: false,
        // The microservice will configure its own PubSub instance, but you're free to
        // supply your own
        // client: new PubSub
      }),
    });
    await app.startAllMicroservices();

    const port = Number(process.env.PORT) || 3010;
    const hostname = process.env.HOSTNAME || 'localhost';
    const address =
      'http' + (ssl ? 's' : '') + '://' + hostname + ':' + port + '/';
    await app.listen(port, hostname, () => {
      Logger.log('Listening at ' + address);
    });
  }
}

bootstrap();
