// approval.service.ts
import { Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Approval } from "./entities/approval.entity";
import { RequestService } from "src/request/request.service";
import { UserService } from "src/user/user.service";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
@Injectable()
export class ApprovalService implements OnModuleInit {
  constructor(
    @InjectRepository(Approval)
    private approvalRepository: Repository<Approval>,
    private eventEmitter: EventEmitter2,
    private userService: UserService
  ) {}

  onModuleInit() {
    this.eventEmitter.on("request.created", (data) =>
      this.handleNewRequest(data)
    );
  }

  // @OnEvent("request.created",{ async: true })
  async handleNewRequest(data: any) {
    // Extract necessary data from the event
    const { requestId, userId ,approvers} = data;
    console.log(`Event received for request creation: ${requestId}`);

    //FIXME: Same user . Need to take approver id
    // Fetch the approver based on the event data
    const approver = await this.userService.findOne({ id: userId });
    if (!approver) {
      throw new Error("Approver not found");
    }

    const approval = this.approvalRepository.create({
      request: { id: requestId }, 
      approver: approver,
      approved: false, 
      approverComments: "",
    });

    await this.approvalRepository.save(approval);

    // notifying other users

    ///
  }
  async approveRequest(
    approvalId: string,
    approverId: string,
    comments: string
  ): Promise<Approval> {
    const approval = await this.approvalRepository.findOne({
      where: { id: approvalId },
      relations: ['request'],
    });
    const approver = await this.userService.findOne({ id: approverId });
  
    if (!approval) {
      throw new NotFoundException('Approval record not found');
    }
  
    if (!approver) {
      throw new NotFoundException('Approver not found');
    }
  
    if (approval.approved) {
      throw new UnauthorizedException('Approval has already been approved');
    }
  
    approval.approved = true;
    approval.approverComments = comments;
    approval.approver = approver;
  
    await this.approvalRepository.save(approval);
  
    this.eventEmitter.emit('request.approved', {
      requestId: approval.request.id,
      approverId,
      comments,
    });
  
    console.log(`Event emitted for approval done: ${approval.id}`);
  
    return approval;
  }

  async getAllApprovals(): Promise<Approval[]> {
    return await this.approvalRepository.find({
    });
  }

  async getApprovalById(id: string): Promise<Approval | undefined> {
    return await this.approvalRepository.findOne({ where: { id: id } });
  }

}
