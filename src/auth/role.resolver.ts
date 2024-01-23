import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role } from './entities/role.entity';
import { PermissionsService } from './permission.service';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Mutation(() => Role)
  async createRole(
    @Args('name') name: string, 
    @Args('permissionNames', { type: () => [String] }) permissionNames: string[]
  ): Promise<Role> {
    return this.permissionsService.createRole(name, permissionNames);
  }

  @Mutation(() => Role)
  async addPermissionToRole(
    @Args('roleName') roleName: string, 
    @Args('permissionName') permissionName: string
  ): Promise<Role> {
    return this.permissionsService.addPermissionToRole(roleName, permissionName);
  }

  // Add other queries and mutations as necessary
}
