import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CreateMerchantDto, UpdateMerchantDto } from './dto/merchant.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MerchantService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) { }

  async getMunicipalities(): Promise<string[]> {
    const cacheKey = 'municipalities';
    let municipalities = await this.cacheService.get(cacheKey);

    if (!municipalities) {
      municipalities = await this.prisma.merchant.findMany({
        select: { city: true },
        distinct: ['city'],
      });

      municipalities = municipalities.map((m) => m.city);
      await this.cacheService.set(cacheKey, municipalities, 3600);
    }

    return municipalities;
  }

  async createMerchant(dto: CreateMerchantDto, updatedBy: string) {
    return this.prisma.merchant.create({
      data: { ...dto, updatedBy },
    });
  }

  async getMerchants(page = 1, filters: any) {
    const take = 5;
    const skip = (page - 1) * take;

    const where: Prisma.MerchantWhereInput = {
      name: filters.name
        ? { contains: filters.name, mode: 'insensitive' as Prisma.QueryMode }
        : undefined,
      registrationDate: filters.registrationDate
        ? new Date(filters.registrationDate)
        : undefined,
      status: filters.status || undefined,
    };

    const merchants = await this.prisma.merchant.findMany({
      where,
      skip,
      take,
    });

    const total = await this.prisma.merchant.count({ where });

    return { data: merchants, total, page };
  }

  async getMerchantById(id: number) {
    return this.prisma.merchant.findUnique({ where: { id } });
  }

  async updateMerchant(id: number, dto: UpdateMerchantDto, updatedBy: string) {
    return this.prisma.merchant.update({
      where: { id },
      data: { ...dto, updatedBy },
    });
  }

  async deleteMerchant(id: number, role: string) {
    if (role !== 'admin') throw new ForbiddenException('Only admins can delete merchants.');
    return this.prisma.merchant.delete({ where: { id } });
  }

  async changeStatus(id: number, status: string, updatedBy: string) {
    return this.prisma.merchant.update({
      where: { id },
      data: { status, updatedBy },
    });
  }

  async getActiveMerchantsReport() {

    const merchants = await this.prisma.merchant.findMany({
      where: { status: 'active' },
      include: {
        establishments: true,
      },
    });

    return merchants.map((merchant) => {
      const establishmentsCount = merchant.establishments.length;
      const totalIncome = merchant.establishments.reduce(
        (sum, est) => sum + est.income,
        0,
      );
      const employeesCount = merchant.establishments.reduce(
        (sum, est) => sum + est.employees,
        0,
      );

      return {
        name: merchant.name,
        city: merchant.city,
        phone: merchant.phone,
        email: merchant.email,
        registrationDate: merchant.registrationDate.toISOString(),
        status: merchant.status,
        establishmentsCount,
        totalIncome,
        employeesCount,
      };
    });
  }

  async getMerchantReportById(id: number) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        establishments: true,
      },
    });

    if (!merchant) {
      return null;
    }

    const establishmentsCount = merchant.establishments.length;
    const totalIncome = merchant.establishments.reduce(
      (sum, est) => sum + est.income,
      0,
    );
    const employeesCount = merchant.establishments.reduce(
      (sum, est) => sum + est.employees,
      0,
    );

    return {
      id: merchant.id,
      name: merchant.name,
      city: merchant.city,
      phone: merchant.phone,
      email: merchant.email,
      registrationDate: merchant.registrationDate.toISOString(),
      status: merchant.status,
      establishmentsCount,
      totalIncome,
      employeesCount,
    };
  }
}