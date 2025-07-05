import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user.entity';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({ // Use registerAsync for async configuration
      imports: [ConfigModule], // Import ConfigModule
      useFactory: async (configService: ConfigService) => ({ // Inject ConfigService
        secret: configService.get<string>('JWT_SECRET'), // Get JWT_SECRET from environment variables
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
