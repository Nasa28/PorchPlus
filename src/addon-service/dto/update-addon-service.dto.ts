import { PartialType } from '@nestjs/mapped-types';
import { CreateAddOnServiceDto } from './create-addon-service.dto';

export class UpdateAddonServiceDto extends PartialType(CreateAddOnServiceDto) {}
