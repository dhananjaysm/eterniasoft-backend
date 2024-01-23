import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionsService } from "../permission.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hasAccess = await this.permissionsService.checkPermissions(user.roles, requiredPermissions);

    if (!hasAccess) {
      throw new ForbiddenException('Insufficient permissions to access this resource.');
    }

    return true;
  }
}
