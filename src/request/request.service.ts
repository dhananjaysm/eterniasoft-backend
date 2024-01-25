// request.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request, Status } from "./entities/request.entity";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { CreateRequestDto } from "./dto/create-request.dto";
import { UserService } from "src/user/user.service";
import { SubscriptionService } from "src/subscription/subscription.service";
import { SubscriptionType } from "src/subscription/entities/subscription.entity";
import { ProductService } from "src/product/product.service";
import { PlanService } from "src/plan/plan.service";

@Injectable()
export class RequestService implements OnModuleInit {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    private readonly subscriptionService: SubscriptionService,
    private readonly planService: PlanService,
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2
  ) {}

  onModuleInit() {
    this.eventEmitter.on("request.approved", (data) =>
      this.handleRequestApproval(data)
    );
  }
  // async createRequest(user: User, product: Package): Promise<Request> {
  //   const request = new Request();
  //   request.user = user;
  //   request.package = product;

  //   return this.requestRepository.save(request);
  // }
  async createRequest(createRequestDto: CreateRequestDto): Promise<Request> {
    const user = await this.userService.findOne({
      id: createRequestDto.userId,
    });
    const plan = await this.planService.findOne(createRequestDto.planId);

    if (!user || !plan) {
      // Handle the error, e.g., throw an exception or return null
      throw new NotFoundException("User or Product not found");
    }

    const existingRequest = await this.requestRepository.findOne({
      where: [
        {
          user: { id: user.id },
          plan: { id: plan.id },
          status: Status.PENDING,
        },
        {
          user: { id: user.id },
          plan: { id: plan.id },
          status: Status.APPROVED,
        },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === Status.PENDING) {
        throw new ConflictException(
          "Request is already pending for this product and user"
        );
      } else if (existingRequest.status === Status.APPROVED) {
        throw new ConflictException(
          "Request has been approved for this product and user"
        );
      }
    }
    const newRequest = this.requestRepository.create({
      user: user,
      plan: plan,
      status: Status.PENDING,
    });

    //If(type=="Zoho Request"){
    //  approvers = ["Super"]
    //}

    await this.requestRepository.save(newRequest);
    this.eventEmitter.emit("request.created", {
      requestId: newRequest.id,
      userId: newRequest.user.id,
    });
    console.log(`Event emitted for request creation: ${newRequest.id}`);

    return newRequest;
  }

  // @OnEvent('request.approved',{ async: true })
  async handleRequestApproval(data: any) {
    const { requestId, approverId, comments } = data;
    console.log(`Event received for approval done: ${requestId}`);

    const request = await this.requestRepository.findOne({
      where: { id: requestId },
    });
    if (!request) {
      throw new Error("Request not found");
    }

    // Update the status of the request
    request.status = Status.APPROVED;
    await this.requestRepository.save(request);

    // Retrieve the associated user and product using the relationships
    const user = request.user; // Assuming you have a "user" relationship in your Request entity
    const plan = request.plan; // Assuming you have a "product" relationship in your Request entity

    if (!user || !plan) {
      throw new Error("User or Package not found in the approved request");
    }

    // Create a subscription for the user and product
    const userId = user.id; // Assuming your User entity has an "id" attribute
    const planId = plan.id; // Assuming your Package entity has an "id" attribute

    const subscriptionType = SubscriptionType.Monthly; // Set the subscription type based on your logic
    // You can adjust the subscription type based on your requirements

    const createSubscriptionDto = {
      userId,
      planId,
      subscriptionType,
    };

    console.log(`Subscription Created`);

    // Call the subscription service to create the subscription
    await this.subscriptionService.createPlanSubscription(createSubscriptionDto);
  }

  async getAllRequests(): Promise<Request[]> {
    return this.requestRepository.find();
  }

  async getRequestById(requestId: string): Promise<Request | undefined> {
    return this.requestRepository.findOne({ where: { id: requestId } });
  }

  async count(): Promise<number> {
    return this.requestRepository.count();
  }
}
