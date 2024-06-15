import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AddOnServiceService } from './addon-service.service';
import { CreateAddOnServiceDto } from './dto/create-addon-service.dto';
import { UpdateAddonServiceDto } from './dto/update-addon-service.dto';

@Controller('addon-service')
export class AddonServiceController {
  constructor(private readonly addonServiceService: AddOnServiceService) {}

  @Post()
  create(@Body() createAddonServiceDto: CreateAddOnServiceDto) {
    return this.addonServiceService.create(createAddonServiceDto);
  }

  @Get()
  findAll() {
    return this.addonServiceService.findAll();
  }

  @Get(':addOnID')
  findOne(@Param('addOnID') addOnID: string) {
    return this.addonServiceService.findOne(+addOnID);
  }

  @Patch(':addOnID')
  update(
    @Param('addOnID') addOnID: string,
    @Body() updateAddonServiceDto: UpdateAddonServiceDto,
  ) {
    return this.addonServiceService.update(+addOnID, updateAddonServiceDto);
  }

  @Delete(':addOnID')
  remove(@Param('addOnID') addOnID: string) {
    return this.addonServiceService.remove(+addOnID);
  }
}
