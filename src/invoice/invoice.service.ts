import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  create(createInvoiceDto: CreateInvoiceDto) {
    const invoice = this.invoiceRepository.create(createInvoiceDto);
    return this.invoiceRepository.save(invoice);
  }

  findAll() {
    return this.invoiceRepository.find();
  }

  findOne(invoiceID: any) {
    return this.invoiceRepository.findOne({ where: { invoiceID: invoiceID } });
  }

  update(invoiceID: number, updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceRepository.update(invoiceID, updateInvoiceDto);
  }

  remove(invoiceID: number) {
    return this.invoiceRepository.delete(invoiceID);
  }
}
