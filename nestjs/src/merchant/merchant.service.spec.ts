import { Test, TestingModule } from '@nestjs/testing';
import { MerchantService } from './merchant.service';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

describe('MerchantService', () => {
  let service: MerchantService;
  let cacheService: CacheService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantService,
        {
          provide: PrismaService,
          useValue: {
            merchant: {
              findMany: jest.fn().mockResolvedValue([{ city: 'Bogotá' }]),
              count: jest.fn().mockResolvedValue(10),
              create: jest.fn().mockResolvedValue({ id: 1 }),
              update: jest.fn().mockResolvedValue({ id: 1 }),
              delete: jest.fn().mockResolvedValue({ id: 1 }),
              findUnique: jest.fn().mockResolvedValue({ id: 1, name: 'Test' }),
            },
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MerchantService>(MerchantService);
    cacheService = module.get<CacheService>(CacheService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getMunicipalities', () => {
    it('should fetch municipalities and cache them', async () => {
      const result = await service.getMunicipalities();
      expect(result).toEqual(['Bogotá']);
      expect(prismaService.merchant.findMany).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  describe('CRUD operations', () => {
    it('should create a merchant', async () => {
      const createDto = {
        name: 'Test Merchant',
        city: 'Bogotá',
        phone: '1234567890',
        email: 'test@test.com',
        registrationDate: new Date(),
        status: 'active',
      };

      const result = await service.createMerchant(createDto, 'adminUser');
      expect(result).toEqual({ id: 1 });
      expect(prismaService.merchant.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          lastUpdatedBy: 'adminUser',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should fetch paginated merchants', async () => {
      const filters = { name: 'Test', registrationDate: undefined, status: 'active' };
      const result = await service.getMerchants(1, 5, filters);
      expect(result.data).toEqual([{ city: 'Bogotá' }]);
      expect(result.total).toEqual(10);
    });

    it('should fetch a merchant by ID', async () => {
      const result = await service.getMerchantById(1);
      expect(result).toEqual({ id: 1, name: 'Test' });
      expect(prismaService.merchant.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should update a merchant', async () => {
      const updateDto = {
        name: 'Updated Merchant',
        municipality: 'Bogotá',
        phone: '1234567890',
        email: 'updated@test.com',
        status: 'inactive',
      };

      const result = await service.updateMerchant(1, updateDto, 'adminUser');
      expect(result).toEqual({ id: 1 });
      expect(prismaService.merchant.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateDto,
          lastUpdatedBy: 'adminUser',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should delete a merchant', async () => {
      const result = await service.deleteMerchant(1);
      expect(result).toEqual({ id: 1 });
      expect(prismaService.merchant.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});