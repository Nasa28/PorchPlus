import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateMembershipDto } from './membership/dto/create-membership.dto';
import { CreateAddOnServiceDto } from './addon-service/dto/create-addon-service.dto';
import { CreateInvoiceDto } from './invoice/dto/create-invoice.dto';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as path from 'path';

@Injectable()
export class AppService {
  constructor(private readonly entityManager: EntityManager) {}

  async loadAndInsertData(): Promise<{ message: string }> {
    const membershipsCsvPath = path.resolve(__dirname, '../memberships.csv');
    const addOnServicesCsvPath = path.resolve(
      __dirname,
      '../addonServices.csv',
    );
    const invoicesCsvPath = path.resolve(__dirname, '../invoices.csv');

    await this.checkFileExists(membershipsCsvPath);
    await this.checkFileExists(addOnServicesCsvPath);
    await this.checkFileExists(invoicesCsvPath);
    const memberships: CreateMembershipDto[] = [];
    const addOnServices: CreateAddOnServiceDto[] = [];
    const invoices: CreateInvoiceDto[] = [];

    try {
      await this.readAndParseCsv(membershipsCsvPath, memberships, (data) => {
        memberships.push({
          firstName: data.firstName,
          lastName: data.lastName,
          membershipType: data.membershipType,
          startDate: new Date(data.startDate),
          dueDate: new Date(data.dueDate),
          totalAmount: parseFloat(data.totalAmount || '0'),
          email: data.email,
          isFirstMonth: data.isFirstMonth === 'TRUE',
        });
      });

      await this.readAndParseCsv(
        addOnServicesCsvPath,
        addOnServices,
        (data) => {
          addOnServices.push({
            membershipID: parseInt(data.membershipID),
            serviceName: data.serviceName,
            monthlyAmount: parseFloat(data.monthlyAmount || '0'),
            dueDate: new Date(data.dueDate),
          });
        },
      );

      await this.readAndParseCsv(invoicesCsvPath, invoices, (data) => {
        invoices.push({
          membershipID: parseInt(data.membershipID),
          invoiceDateTime: data.invoiceDateTime
            ? new Date(data.invoiceDateTime)
            : null,
          totalAmount: parseFloat(data.totalAmount || '0'),
          invoiceUID: data.invoiceUID,
        });
      });

      for (const membership of memberships) {
        await this.entityManager.insert('membership', membership);
      }

      for (const addOnService of addOnServices) {
        await this.entityManager.insert('add_on_service', addOnService);
      }

      for (const invoice of invoices) {
        await this.entityManager.insert('invoice', invoice);
      }

      return { message: 'Data loaded and inserted successfully.' };
    } catch (error) {
      return { message: `Failed to load and insert data: ${error.message}` };
    }
  }
  private async checkFileExists(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          reject(new Error(`File ${filePath} does not exist.`));
        } else {
          resolve();
        }
      });
    });
  }
  private async readAndParseCsv<T>(
    filePath: string,
    targetArray: T[],
    parseFunction: (data: any) => void,
  ): Promise<void> {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => parseFunction(data))
        .on('end', () => resolve(1))
        .on('error', (err) => reject(err));
    });
  }
}
