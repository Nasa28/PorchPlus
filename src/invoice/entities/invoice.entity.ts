import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Membership } from 'src/membership/entities/membership.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  invoiceID: number;

  
  @ManyToOne(() => Membership, (membership) => membership.membershipID)
  @Column()
  membershipID: number;

  @Column({ nullable: true })
  invoiceDateTime: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column()
  invoiceUID: string;
}
