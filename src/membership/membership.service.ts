import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
  ) {}

  create(createMembershipDto: CreateMembershipDto) {
    const membership = this.membershipRepository.create(createMembershipDto);
    return this.membershipRepository.save(membership);
  }

  findAll() {
    return this.membershipRepository.find();
  }

  findOne(membershipID: any) {
    return this.membershipRepository.findOne({
      where: { membershipID: membershipID },
    });
  }

  update(membershipID: number, updateMembershipDto: UpdateMembershipDto) {
    return this.membershipRepository.update(membershipID, updateMembershipDto);
  }

  remove(membershipID: number) {
    return this.membershipRepository.delete(membershipID);
  }
}
