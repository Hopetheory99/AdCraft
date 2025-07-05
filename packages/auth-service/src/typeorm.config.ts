import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: './packages/auth-service/.env' });

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [path.join(process.cwd(), 'packages/auth-service/src/**/*.entity{.ts,.js}')],
      migrations: [path.join(process.cwd(), 'packages/auth-service/src/migrations/*{.ts,.js}')],
      migrationsTableName: 'migrations',
      synchronize: false,
    };
  }

  static getDataSourceOptions(configService: ConfigService): DataSourceOptions {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [path.join(process.cwd(), 'packages/auth-service/src/**/*.entity{.ts,.js}')],
      migrations: [path.join(process.cwd(), 'packages/auth-service/src/migrations/*{.ts,.js}')],
      migrationsTableName: 'migrations',
      synchronize: false,
    };
  }
}

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: './packages/auth-service/.env',
  })],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> =>
    TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};

const configService = new ConfigService();
export const AppDataSource = new DataSource(TypeOrmConfig.getDataSourceOptions(configService));
