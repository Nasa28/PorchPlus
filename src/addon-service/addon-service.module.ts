import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddOnServiceService } from './addon-service.service';
import { AddonServiceController } from './addon-service.controller';
import { AddOnService } from './entities/addon-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddOnService])],
  controllers: [AddonServiceController],
  providers: [AddOnServiceService],
})
export class AddonServiceModule {}
