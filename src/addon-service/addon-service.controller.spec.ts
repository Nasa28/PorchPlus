import { Test, TestingModule } from '@nestjs/testing';
import { AddonServiceController } from './addon-service.controller';
import { AddOnServiceService } from './addon-service.service';
import { CreateAddOnServiceDto } from './dto/create-addon-service.dto';
import { UpdateAddonServiceDto } from './dto/update-addon-service.dto';

describe('AddonServiceController', () => {
  let controller: AddonServiceController;
  let service: AddOnServiceService;

  const mockAddOnServiceService = {
    create: jest.fn((dto: CreateAddOnServiceDto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    findAll: jest.fn(() => []),
    findOne: jest.fn((id: number) => {
      return {
        id,
        serviceName: 'Test AddOn',
        monthlyAmount: 10,
        dueDate: new Date(),
      };
    }),
    update: jest.fn((id: number, dto: UpdateAddonServiceDto) => {
      return {
        id,
        ...dto,
      };
    }),
    remove: jest.fn((id: number) => {
      return { id };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddonServiceController],
      providers: [
        {
          provide: AddOnServiceService,
          useValue: mockAddOnServiceService,
        },
      ],
    }).compile();

    controller = module.get<AddonServiceController>(AddonServiceController);
    service = module.get<AddOnServiceService>(AddOnServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an add-on service', async () => {
    const dto: CreateAddOnServiceDto = {
      membershipID: 1,
      serviceName: 'Test AddOn',
      monthlyAmount: 10,
      dueDate: new Date(),
    };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return an array of add-on services', async () => {
    expect(await controller.findAll()).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single add-on service', async () => {
    const addOnID = 1;
    expect(await controller.findOne(addOnID.toString())).toEqual({
      id: addOnID,
      serviceName: 'Test AddOn',
      monthlyAmount: 10,
      dueDate: expect.any(Date),
    });
    expect(service.findOne).toHaveBeenCalledWith(addOnID);
  });

  it('should update an add-on service', async () => {
    const addOnID = 1;
    const dto: UpdateAddonServiceDto = {
      serviceName: 'Updated AddOn',
      monthlyAmount: 15,
      dueDate: new Date(),
    };
    expect(await controller.update(addOnID.toString(), dto)).toEqual({
      id: addOnID,
      ...dto,
    });
    expect(service.update).toHaveBeenCalledWith(addOnID, dto);
  });

  it('should remove an add-on service', async () => {
    const addOnID = 1;
    expect(await controller.remove(addOnID.toString())).toEqual({
      id: addOnID,
    });
    expect(service.remove).toHaveBeenCalledWith(addOnID);
  });
});
