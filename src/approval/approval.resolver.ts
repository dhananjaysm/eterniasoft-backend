// approval.resolver.ts
import { Resolver, Mutation, Args, ID, Query } from '@nestjs/graphql';
import { ApprovalService } from './approval.service';
import { Approval } from './entities/approval.entity';

@Resolver('Approval')
export class ApprovalResolver {
  constructor(private readonly approvalService: ApprovalService) {}

  @Mutation(returns => Approval)
  async approveRequest(
    @Args('approvalId') approvalId: string,
    @Args('approverId') approverId: string,
    @Args('comments') comments: string
  ): Promise<Approval> {
    return this.approvalService.approveRequest(approvalId, approverId, comments);
  }

  @Query(returns => [Approval])
  async approvals(): Promise<Approval[]> {
    return this.approvalService.getAllApprovals();
  }

  @Query(returns => Approval)
  async approval(@Args('id') id: string): Promise<Approval | undefined> {
    return this.approvalService.getApprovalById(id);
  }
}
