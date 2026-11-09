/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { AuthorizationService } from '../authorization.service';

@Injectable()
export class ProjectAccessGuard implements CanActivate {
  constructor(private readonly authorizationService: AuthorizationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const projetId = Number(request.params.projetId ?? request.params.id);

    if (!projetId) {
      throw new ForbiddenException('Identifiant du projet manquant');
    }

    const allowed = await this.authorizationService.canAccessProject(
      user.id,
      user.role,
      projetId,
    );

    if (!allowed) {
      throw new ForbiddenException('Vous n’avez pas accès à ce projet');
    }

    return true;
  }
}
