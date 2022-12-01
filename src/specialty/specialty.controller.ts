/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Post,
  UseGuards,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { SpecialtyService } from './specialty.service';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@ApiTags('Specialty')
@Controller({
  path: 'specialty',
  version: '1',
})
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlumnoDTO) {
    return this.specialtyService.create(createAlumnoDTO);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateNivelDTO) {
    return this.specialtyService.update(id, updateNivelDTO);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.specialtyService.find();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.specialtyService.findOne({ id: +id });
  }
}
