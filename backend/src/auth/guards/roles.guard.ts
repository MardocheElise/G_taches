/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// import { Reflector } from '@nestjs/core';

// import { ROLES_KEY } from '../decorators/roles.decorator';
// import { RoleUtilisateur } from 'src/generated/prisma/client';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<RoleUtilisateur[]>(
//       ROLES_KEY,
//       [context.getHandler(), context.getClass()],
//     );

//     // Si aucun rôle n'est demandé
//     if (!requiredRoles) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();

//     const user = request.user;

//     return requiredRoles.includes(user.role);
//   }
// }

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleUtilisateur } from 'src/generated/prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleUtilisateur[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Aucun rôle spécifiquement demandé
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Utilisateur non authentifié');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        'Vous n’avez pas les permissions nécessaires',
      );
    }

    return true;
  }
}
