import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSource } from './infrastructure/database/data-source';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './infrastructure/repository/user.repo';
import { AuthenticateMiddleware } from './infrastructure/middleware/authenticate.middleware';
import { ConfigModule } from '@nestjs/config';
import { BcryptService } from './infrastructure/services/bcrypt.service';
import { AuthModule } from './features/Auth/auth.module';
import { AuthHelperService } from './infrastructure/services/auth.service';
import { SellerModule } from './features/seller/seller.module';
import { GlobalModule } from './features/global/global.module';
import { CustomerModule } from './features/customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      ...dataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_REGISTER_SECRET,
      // signOptions: { expiresIn: '60m' },
    }),

    //Modules
    AuthModule,
    SellerModule,
    GlobalModule,
    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService, BcryptService, UserRepository, AuthHelperService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: 'auth/*path', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}
