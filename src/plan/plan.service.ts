// product.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Plan } from "./entities/plan.entity";
import { UpdatePlanInput } from "./dto/update-plan.input";
import { CreatePlanInput } from "./dto/create-plan.input";
import { ProductService } from "src/product/product.service";

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepo: Repository<Plan>,
    private readonly productService: ProductService // Inject ProductService
  ) {}

  async findAll(): Promise<Plan[]> {
    console.log("get all------");
    const plan = await this.planRepo.find();
    console.log("plan--", plan);
    return plan;
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.planRepo.findOne({ where: { id: id } });
    if (!plan) {
      throw new Error(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async create(planData: CreatePlanInput): Promise<Plan> {
    const { productIds, ...rest } = planData;
    console.log("Plan repo...", productIds);
    // Create a new plan instance with the provided data
    const newPlan = this.planRepo.create(rest);
    console.log("new repo....", newPlan);
    if (productIds && productIds.length > 0) {
      // Use ProductService to find products by their IDs
      console.log("in the if statement");
      const products = await this.productService.findProductsByIds(productIds);
      console.log("in the if statement-2", products);

      // Associate these products with the new plan
      newPlan.products = products; // Assuming your Plan entity has a 'products' relationship field
      console.log("new Plan", newPlan);
    }

    // Save the new plan along with its associated products
    return this.planRepo.save(newPlan);
  }

  async update(planId: string, planData: UpdatePlanInput): Promise<Plan> {
    const { productIds, ...rest } = planData;

    // Find the existing plan instance
    const existingPlan = await this.planRepo.findOne({ where: { id: planId } });
    if (!existingPlan) {
      throw new Error("Plan not found");
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

  async deleteAll(): Promise<void> {
    try {
      // Delete all data from the repository
      await this.planRepo.clear();
      console.log("deleted");
    } catch (error) {
      // Handle errors if necessary
      throw error;
    }
  }
}
