import { Controller, Get, UseGuards, Post, Put, Patch, Delete, Body, Param, Query, Request, Res } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { MerchantService } from './merchant.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateMerchantDto, UpdateMerchantDto } from './dto/merchant.dto';
import { Roles } from '../auth/roles.decorator';
import { Response } from 'express';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('merchants')
export class MerchantController {
  constructor(private merchantService: MerchantService) { }

  @Get('municipalities')
  async getMunicipalities() {
    const municipalities = await this.merchantService.getMunicipalities();
    return {
      statusCode: 200,
      message: 'Municipalities fetched successfully',
      data: municipalities,
    };
  }

  @Get(':id/report')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async getMerchantReportById(@Param('id') id: string, @Res() res: Response) {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Invalid merchant ID',
      });
    }

    const report = await this.merchantService.getMerchantReportById(parsedId);

    if (!report) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Merchant not found',
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Merchant report fetched successfully',
      data: report,
    });
  }

  @Get('report')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async generateMerchantReport(@Res() res: Response) {
    const reportData = await this.merchantService.getActiveMerchantsReport();

    const header =
      'Nombre|Municipio|Teléfono|Correo Electrónico|Fecha de Registro|Estado|Cantidad de Establecimientos|Total Ingresos|Cantidad de Empleados\n';
    const rows = reportData
      .map((merchant) =>
        [
          merchant.name,
          merchant.city,
          merchant.phone,
          merchant.email,
          merchant.registrationDate,
          merchant.status,
          merchant.establishmentsCount,
          merchant.totalIncome,
          merchant.employeesCount,
        ].join('|'),
      )
      .join('\n');

    const csvContent = header + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=merchants_report.csv');
    res.send(csvContent);
  }

  @Post()
  async createMerchant(@Body() dto: CreateMerchantDto, @Request() req: any) {
    return this.merchantService.createMerchant(dto, req.user.email);
  }

  @Get()
  async getMerchants(
    @Query('page') page: number,
    @Query('name') name: string,
    @Query('registrationDate') registrationDate: string,
    @Query('status') status: string,
  ) {
    return this.merchantService.getMerchants(page, { name, registrationDate, status });
  }

  @Get(':id')
  async getMerchantById(@Param('id') id: string) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new Error('Invalid ID');
    }
    return this.merchantService.getMerchantById(parsedId);
  }

  @Put(':id')
  async updateMerchant(
    @Param('id') id: string,
    @Body() dto: UpdateMerchantDto,
    @Request() req: any,
  ) {
    return this.merchantService.updateMerchant(parseInt(id), dto, req.user.email);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteMerchant(@Param('id') id: string, @Request() req: any) {
    return this.merchantService.deleteMerchant(parseInt(id), req.user.role);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.merchantService.changeStatus(parseInt(id), status, req.user.email);
  }

}