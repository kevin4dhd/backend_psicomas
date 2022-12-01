/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  HttpCode,
  Body,
  Post,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { TherapyMethodologyService } from './therapy-methodology.service';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('TherapyMethodology')
@Controller({
  path: 'therapyMethodology',
  version: '1',
})
export class TherapyMethodologyController {
  constructor(private readonly therapyMethodologyService: TherapyMethodologyService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTherapyMethodologyDTO) {
    return this.therapyMethodologyService.create(createTherapyMethodologyDTO);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateTherapyMethodologyDTO) {
    return this.therapyMethodologyService.update(id, updateTherapyMethodologyDTO);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.therapyMethodologyService.find({});
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.therapyMethodologyService.findOne({ id: +id });
  }
}
