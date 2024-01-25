// usageLimit.entity.ts
import { Plan } from 'src/plan/entities/plan.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class UsageLimit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Plan, plan => plan.usageLimits)
  plan: Plan;

  @Column()
  metric: string; // e.g., 'api_calls', 'storage_space'

  @Column('int')
  limitValue: number; // e.g., 10000 for API calls, 50 (GB) for storage
}
