import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Feature } from "./entities/feature.entity";
import { CreateFeatureInput } from "./dto/create-feature.input";

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private featureRepository: Repository<Feature>,
  ) {}

  async findAll(): Promise<Feature[]> {
    return this.featureRepository.find();
  }

  async findOne(id: string): Promise<Feature> {
    return this.featureRepository.findOne({where:{id:id}});
  }

  async create(createFeatureInput: CreateFeatureInput): Promise<Feature> {
    const feature = this.featureRepository.create(createFeatureInput);
    return this.featureRepository.save(feature);
  }

}