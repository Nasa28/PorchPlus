import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  create(@Body() createMembershipDto: CreateMembershipDto) {
    return this.membershipService.create(createMembershipDto);
  }

  @Get()
  findAll() {
    return this.membershipService.findAll();
  }

  @Get(':membershipID')
  findOne(@Param('membershipID') membershipID: string) {
    console.log('membershipID', membershipID);
    return this.membershipService.findOne(+membershipID);
  }

  @Patch(':membershipID')
  update(
    @Param('membershipID') membershipID: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipService.update(+membershipID, updateMembershipDto);
  }

  @Delete(':membershipID')
  remove(@Param('membershipID') membershipID: string) {
    return this.membershipService.remove(+membershipID);
  }
}
