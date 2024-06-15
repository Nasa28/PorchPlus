import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':invoiceID')
  findOne(@Param('invoiceID') invoiceID: string) {
    return this.invoiceService.findOne(+invoiceID);
  }

  @Patch(':invoiceID')
  update(
    @Param('invoiceID') invoiceID: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoiceService.update(+invoiceID, updateInvoiceDto);
  }

  @Delete(':invoiceID')
  remove(@Param('invoiceID') invoiceID: string) {
    return this.invoiceService.remove(+invoiceID);
  }
}
