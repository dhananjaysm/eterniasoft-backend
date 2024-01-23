// request.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Package } from "src/package/entities/package.entity";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { Request, Status } from "./entities/request.entity";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { CreateRequestDto } from "./dto/create-request.dto";
import { PackageService } from "src/package/package.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class RequestService implements OnModuleInit {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    private readonly packageService: PackageService,
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2

  ) {}

  onModuleInit() {
    this.eventEmitter.on('request.approved', (data) => this.handleRequestApproval(data));
  }
  // async createRequest(user: User, pkg: Package): Promise<Request> {
  //   const request = new Request();
  //   request.user = user;
  //   request.package = pkg;

  //   return this.requestRepository.save(request);
  // }
  async createRequest(createRequestDto: CreateRequestDto): Promise<Request> {
    const user = await this.userService.findOne({id:createRequestDto.userId});
    const packageEntity = await this.packageService.findOne({id:createRequestDto.packageId});

    if (!user || !packageEntity) {
        // Handle the error, e.g., throw an exception or return null
    }

    const existingRequest = await this.requestRepository.findOne({
      where: {
        user: { id: user.id }, // Compare IDs instead of entire objects
        package: { id: packageEntity.id }
      }
    });
  
    if (existingRequest) {
      throw new Error('Request already exists for this package and user');
    }
    const newRequest = this.requestRepository.create({
        user: user,
        package: packageEntity,
    });

    await this.requestRepository.save(newRequest);
    this.eventEmitter.emit('request.created', { requestId: newRequest.id, userId: newRequest.user.id });
    console.log(`Event emitted for request creation: ${newRequest.id}`);

    return newRequest;
}

@OnEvent('request.approved',{ async: true })
async handleRequestApproval(data: any) {
  const { requestId, approverId, comments } = data;

  const request = await this.requestRepository.findOne({where:{ id: requestId }});
  if (!request) {
    throw new Error('Request not found');
  }

  // Update the status of the request
  request.status = Status.APPROVED;
  await this.requestRepository.save(request);

}




  async getAllRequests(): Promise<Request[]> {
    return this.requestRepository.find();
  }

  async getRequestById(requestId: string): Promise<Request | undefined> {
    return this.requestRepository.findOne({where:{id:requestId}});
  }

  async count(): Promise<number> {
    return this.requestRepository.count();
  }
}
