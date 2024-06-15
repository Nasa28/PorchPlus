import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { Membership } from 'src/membership/entities/membership.entity';
import { AddOnService } from 'src/addon-service/entities/addon-service.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { CronService } from './cron.service';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forFeature([Membership, AddOnService, Invoice]),
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('SMTP_USER')}>`,
        },
        template: {
          dir: __dirname + '../../templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [CronService],
})
export class CronModule {}
