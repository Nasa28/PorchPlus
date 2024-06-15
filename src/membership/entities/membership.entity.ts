import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AddOnService } from 'src/addon-service/entities/addon-service.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
@Entity()
export class Membership {
  @PrimaryGeneratedColumn()
  membershipID: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  membershipType: string;

  @Column()
  startDate: Date;

  @Column()
  dueDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  email: string;

  @Column()
  isFirstMonth: boolean;
  @OneToMany(() => AddOnService, (addOnService) => addOnService.membershipID)
  addOnServices: AddOnService[];
  @OneToMany(() => Invoice, (invoice) => invoice.membershipID)
  invoices: Invoice[];
}
