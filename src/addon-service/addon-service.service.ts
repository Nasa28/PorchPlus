import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddOnService } from './entities/addon-service.entity';
import { CreateAddOnServiceDto } from './dto/create-addon-service.dto';
import { UpdateAddonServiceDto } from './dto/update-addon-service.dto';

@Injectable()
export class AddOnServiceService {
  constructor(
    @InjectRepository(AddOnService)
    private addOnServiceRepository: Repository<AddOnService>,
  ) {}

  create(CreateAddOnServiceDto: CreateAddOnServiceDto) {
    const addOnService = this.addOnServiceRepository.create(
      CreateAddOnServiceDto,
    );
    return this.addOnServiceRepository.save(addOnService);
  }

  findAll() {
    return this.addOnServiceRepository.find();
  }

  findOne(addOnID: any) {
    return this.addOnServiceRepository.findOne({ where: { addOnID: addOnID } });
  }

  update(addOnID: number, updateAddOnServiceDto: UpdateAddonServiceDto) {
    return this.addOnServiceRepository.update(addOnID, updateAddOnServiceDto);
  }

  remove(addOnID: number) {
    return this.addOnServiceRepository.delete(addOnID);
  }
}
