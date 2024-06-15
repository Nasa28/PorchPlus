import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from 'src/membership/entities/membership.entity';
import { AddOnService } from 'src/addon-service/entities/addon-service.entity';
import { MailerService } from '@nestjs-modules/mailer';

interface TransformedMembership {
  membershipID: number;
  firstName: string;
  lastName: string;
  membershipType: string;
  startDate: Date;
  dueDate: Date;
  totalAmount: string;
  email: string;
  isFirstMonth: boolean;
  addOnServices: AddOnService[];
  firstInvoiceUID?: string;
}

function transformMemberships(memberships: any[]): TransformedMembership[] {
  return memberships.map((membership) => {
    const firstInvoiceUID =
      membership.invoices.length > 0
        ? membership.invoices[0].invoiceUID
        : undefined;

    return {
      membershipID: membership.membershipID,
      firstName: membership.firstName,
      lastName: membership.lastName,
      membershipType: membership.membershipType,
      startDate: membership.startDate,
      dueDate: membership.dueDate,
      totalAmount: membership.totalAmount,
      email: membership.email,
      isFirstMonth: membership.isFirstMonth,
      addOnServices: membership.addOnServices,
      firstInvoiceUID,
    };
  });
}

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(AddOnService)
    private addOnServiceRepository: Repository<AddOnService>,
    private readonly mailerService: MailerService,
  ) {}

  // Run daily at midnight
  @Cron('0 0 * * *')
  async handleCron() {
    this.logger.log('Cron job running at:', new Date().toISOString());

    const today = new Date();

    try {
      // Get memberships where the due date is in the next 7 days
      const membershipData = await this.membershipRepository
        .createQueryBuilder('membership')
        .leftJoinAndSelect('membership.addOnServices', 'addOnService')
        .leftJoinAndSelect('membership.invoices', 'invoice')
        .where('membership.dueDate BETWEEN :today AND :sevenDaysFromToday', {
          today: today.toISOString().split('T')[0],
          sevenDaysFromToday: new Date(
            today.getTime() + 7 * 24 * 60 * 60 * 1000,
          )
            .toISOString()
            .split('T')[0],
        })
        .getMany();

      const memberships = transformMemberships(membershipData);

      for (const membership of memberships) {
        try {
          let amount = Number(membership.totalAmount);
          amount += membership.addOnServices.reduce((total, service) => {
            return Number(total) + Number(service.monthlyAmount);
          }, 0);

          if (membership.isFirstMonth) {
            let description = `Annual fee`;
            description = `${description} and first month's add-on services`;

            await this.mailerService.sendMail({
              to: membership.email,
              subject: `Fitness+ Membership Reminder - ${description}`,
              template: './reminder',
              context: {
                name: membership.firstName,
                description,
                amount,
                dueDate: membership.dueDate,
                invoiceUID: membership.firstInvoiceUID,
              },
            });
          } else {
            const service = await this.addOnServiceRepository.findOne({
              where: { membershipID: membership.membershipID },
            });
            if (service && this.isCurrentMonth(service)) {
              await this.mailerService.sendMail({
                to: membership.email,
                subject: `Fitness+ Membership Reminder - ${service.serviceName}`,
                template: './reminder-addon',
                context: {
                  name: membership.firstName,
                  description: service.serviceName,
                  amount,
                  dueDate: service.dueDate,
                  invoiceUID: membership.firstInvoiceUID,
                },
              });
            }
          }
        } catch (error) {
          this.logger.error(
            `Failed to send email to ${membership.email}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to retrieve memberships or send emails: ${error.message}`,
      );
    }
  }

  private isCurrentMonth(service: AddOnService): boolean {
    const today = new Date();
    return (
      today.getMonth() === service.dueDate.getMonth() &&
      today.getFullYear() === service.dueDate.getFullYear()
    );
  }
}
