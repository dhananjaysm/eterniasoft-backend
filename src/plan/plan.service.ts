// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { UpdatePlanInput } from './dto/update-plan.input';
import { CreatePlanInput } from './dto/create-plan.input';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepo: Repository<Plan>,
    private readonly productService: ProductService, // Inject ProductService

  ) {}

  async findAll(): Promise<Plan[]> {
    return this.planRepo.find();
  }

  async findOne(id: string): Promise<Plan> {
    return this.planRepo.findOne({where:{id:id}});
  }

  async create(planData: CreatePlanInput): Promise<Plan> {
    const { productIds, ...rest } = planData;
  
    // Create a new plan instance with the provided data
    const newPlan = this.planRepo.create(rest);
  
    if (productIds && productIds.length > 0) {
      // Use ProductService to find products by their IDs
      const products = await this.productService.findProductsByIds(productIds);
      
      // Associate these products with the new plan
      newPlan.products = products; // Assuming your Plan entity has a 'products' relationship field
    }
  
    // Save the new plan along with its associated products
    return this.planRepo.save(newPlan);
  }

  async update(planId: string, planData: UpdatePlanInput): Promise<Plan> {
    const { productIds, ...rest } = planData;
  
    // Find the existing plan instance
    const existingPlan = await this.planRepo.findOne({ where: { id: planId } });
    if (!existingPlan) {
      throw new Error('Plan not found');
    }
  
    // Update the plan properties with the new data
    Object.assign(existingPlan, rest);
  
    if (productIds) {
      // Use ProductService to find products by their IDs
      const products = await this.productService.findProductsByIds(productIds);
  
      // Associate these products with the plan
      existingPlan.products = products;
    }
  
    // Save the updated plan along with its associated products
    return this.planRepo.save(existingPlan);
  }

  async remove(id: string): Promise<void> {
    await this.planRepo.delete(id);
  }
}
