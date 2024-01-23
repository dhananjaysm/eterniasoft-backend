import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { In, Repository } from "typeorm";
import { Role } from "./entities/role.entity";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async checkPermissions(
    roleNames: string[],
    requiredPermissions: string[]
  ): Promise<boolean> {
    // Fetch roles with permissions from the database
    const roles = await this.roleRepository.find({
      where: { name: In(roleNames) },
      relations: ["permissions"],
    });

    // Flatten permissions from all roles
    const permissions = roles.flatMap((role) =>
      role.permissions.map((p) => p.name)
    );

    // Check if the required permissions are in the user's permissions
    return requiredPermissions.every((requiredPermission) =>
      permissions.includes(requiredPermission)
    );
  }

  async createPermission(name: string): Promise<Permission> {
    const permission = this.permissionRepository.create({ name });
    return this.permissionRepository.save(permission);
  }

  async createRole(name: string, permissionNames: string[]): Promise<Role> {
    const permissions = await this.permissionRepository.find({
      where: { name: In(permissionNames) },
    });

    const role = this.roleRepository.create({ name, permissions });
    return this.roleRepository.save(role);
  }

  async addPermissionToRole(roleName: string, permissionName: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ 
      where: { name: roleName },
      relations: ["permissions"]
    });

    if (!role) {
      throw new Error('Role not found');
    }

    const permission = await this.permissionRepository.findOne({
      where: { name: permissionName }
    });

    if (!permission) {
      throw new Error('Permission not found');
    }

    role.permissions.push(permission);
    return this.roleRepository.save(role);
  }

}
