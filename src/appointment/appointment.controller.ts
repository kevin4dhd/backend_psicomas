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
  import { AppointmentService } from './appointment.service';
  
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @ApiTags('Appointment')
  @Controller({
    path: 'appointment',
    version: '1',
  })
  export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}
  
    @Post()
    //@UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createAppointmentDTO) {
      return this.appointmentService.create(createAppointmentDTO);
    }
  
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: number, @Body() updateNivelDTO) {
      return this.appointmentService.update(id, updateNivelDTO);
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
      return await this.appointmentService.find();
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
      return this.appointmentService.findOne({ id: +id });
    }
  }
  