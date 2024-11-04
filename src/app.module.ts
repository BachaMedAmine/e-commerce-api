import { Module ,MiddlewareConsumer ,RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { AdminModule } from './admin/admin.module';
import { LoggingMiddleware } from './middleware/logging.middleware';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally in the application

    }),
    MongooseModule.forRoot('mongodb://localhost:27017/td-revision'), // MongoDB connection
    AdminModule,
    UserModule,
    ProductModule,
    OrderModule,
    AuthModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Register RolesGuard globally
    },
  ]

})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}