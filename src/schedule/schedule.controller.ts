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
import { ScheduleService } from './schedule.service';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@ApiTags('Schedule')
@Controller({
  path: 'schedule',
  version: '1',
})
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) { }

  @Post('scheduleByPsychologistDate')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  scheduleByPsychologistDate(@Body() scheduleDTO) {
    return this.scheduleService.scheduleByPsychologistDate(scheduleDTO);
  }

  @Post('scheduleByPsychologistDateUser')
  //@UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  scheduleByPsychologistDateUser(@Body() scheduleDTO) {
    return this.scheduleService.scheduleByPsychologistDateUser(scheduleDTO);
  }

  @Post('addSchedule')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  addSchedule(@Body() scheduleDTO) {
    return this.scheduleService.addSchedule(scheduleDTO);
  }

  @Post('deleteSchedule')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  deleteSchedule(@Body() createPsicologistDTO) {
    return this.scheduleService.deleteSchedule(createPsicologistDTO);
  }

  /*@Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlumnoDTO) {
    return this.scheduleService.create(createAlumnoDTO);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() updateNivelDTO) {
    return this.scheduleService.update(id, updateNivelDTO);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.scheduleService.find();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne({ id: +id });
  }*/
}
