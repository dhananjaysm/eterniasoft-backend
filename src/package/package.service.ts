// package.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Package } from "./entities/package.entity";
import { CreatePackageDTO } from "./dto/create-package.dto";
import { UpdatePackageDTO } from "./dto/update-package.dto";
type Where = FindOptionsWhere<Package>;

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>
  ) {}

  async findAll(): Promise<Package[]> {
    return this.packageRepository.find();
  }

  async findOne(where: Where): Promise<Package> {
    return this.packageRepository.findOne({where});
  }

  async create(packageData:CreatePackageDTO): Promise<Package> {
    const newPackage = this.packageRepository.create(packageData);
    return this.packageRepository.save(newPackage);
  }

  async update(id: string, packageData: UpdatePackageDTO): Promise<Package> {
    await this.packageRepository.update(id, packageData);
    return this.findOne({id:id});
  }

  async remove(id: string): Promise<void> {
    await this.packageRepository.delete(id);
  }
}
