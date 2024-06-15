import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Membership } from 'src/membership/entities/membership.entity';
@Entity()
export class AddOnService {
  @PrimaryGeneratedColumn()
  addOnID: number;

  @ManyToOne(() => Membership, (membership) => membership.membershipID)
  @Column()
  membershipID: number;

  @Column()
  serviceName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyAmount: number;

  @Column()
  dueDate: Date;
}
