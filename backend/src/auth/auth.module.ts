// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersModule } from '../users/users.module';
import { PrismaService } from '../prisma/prisma.service';

import { RolesGuard } from './guards/roles.guard';
import { ProjectAccessGuard } from './guards/project-access.guard';

import { AuthorizationService } from './authorization.service';
import { JwtStrategy } from './strategies/jwt.strategies';

@Module({
  imports: [
    UsersModule,
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    AuthorizationService,
    RolesGuard,
    ProjectAccessGuard,
  ],

  exports: [AuthService, AuthorizationService, RolesGuard, ProjectAccessGuard],
})
export class AuthModule {}
