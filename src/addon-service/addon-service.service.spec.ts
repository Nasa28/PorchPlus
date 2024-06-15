import { Test, TestingModule } from '@nestjs/testing';
import { AddOnServiceService } from './addon-service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddOnService } from './entities/addon-service.entity';
import { CreateAddOnServiceDto } from './dto/create-addon-service.dto';
import { UpdateAddonServiceDto } from './dto/update-addon-service.dto';

describe('AddOnServiceService', () => {
  let service: AddOnServiceService;
  let repository: Repository<AddOnService>;

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    find: jest.fn().mockImplementation(() => []),
    findOne: jest.fn().mockImplementation((id) => {
      if (id === 1) {
        return Promise.resolve({ id, name: 'Test AddOn' });
      }
      return Promise.resolve(null);
    }),
    update: jest.fn().mockImplementation((id, dto) => {
      return Promise.resolve({ id, ...dto });
    }),
    delete: jest.fn().mockImplementation((id) => {
      return Promise.resolve({ id });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddOnServiceService,
        {
          provide: getRepositoryToken(AddOnService),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AddOnServiceService>(AddOnServiceService);
    repository = module.get<Repository<AddOnService>>(
      getRepositoryToken(AddOnService),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an add-on service', async () => {
      const dto: CreateAddOnServiceDto = {
        membershipID: 1,
        serviceName: 'Test AddOn',
        monthlyAmount: 10,
        dueDate: new Date(),
      };
      expect(await service.create(dto)).toEqual(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an empty array', async () => {
      expect(await service.findAll()).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an add-on service', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual({ id: 1, name: 'Test AddOn' });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { addOnID: 1 },
      });
    });

    it('should return null for non-existing ID', async () => {
      const result = await service.findOne(2);
      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { addOnID: 2 },
      });
    });
  });

  describe('update', () => {
    it('should update an add-on service', async () => {
      const dto: UpdateAddonServiceDto = {
        serviceName: 'Updated AddOn',
        monthlyAmount: 15,
        dueDate: new Date(),
      };
      const result = await service.update(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove an add-on service', async () => {
      const result = await service.remove(1);
      expect(result).toEqual({ id: 1 });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
