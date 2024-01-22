// package.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PackageService } from './package.service';
import { Package } from './entities/package.entity';
import { CreatePackageDTO } from './dto/create-package.dto';
import { UpdatePackageDTO } from './dto/update-package.dto';

@Resolver(() => Package)
export class PackageResolver {
  constructor(private readonly packageService: PackageService) {}

  @Query(() => [Package],{name : 'findAllPackages'})
  async findPackages(): Promise<Package[]> {
    return this.packageService.findAll();
  }

  @Query(() => Package,{name : 'findPackageById'})
  async findPackage(@Args('id') id: string): Promise<Package> {
    return this.packageService.findOne({id:id});
  }

  @Mutation(() => Package,{name : 'createPackage'})
  async createPackage(@Args('packageData') packageData: CreatePackageDTO): Promise<Package> {
    return this.packageService.create(packageData);
  }

  @Mutation(() => Package,{name:"updatePackage"})
  async updatePackage(
    @Args('id') id: string,
    @Args('packageData') packageData: UpdatePackageDTO,
  ): Promise<Package> {
    return this.packageService.update(id, packageData);
  }

  @Mutation(() => Package,{name:"removePackage"})
  async removePackage(@Args('id') id: string): Promise<void> {
    return this.packageService.remove(id);
  }
}
