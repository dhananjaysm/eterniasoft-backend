import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permission.service';

@Resolver(() => Permission)
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Mutation(() => Permission)
  async createPermission(@Args('name') name: string): Promise<Permission> {
    return this.permissionsService.createPermission(name);
  }

  // Add other queries and mutations as necessary
}
