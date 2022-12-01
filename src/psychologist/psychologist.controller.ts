/* eslint-disable prettier/prettier */
import {
    Controller,
    Get,
    HttpStatus,
    HttpCode,
    Post,
    UseGuards,
    Body,
    Request,
    Param,
    Patch,
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { Roles } from 'src/roles/roles.decorator';
  import { RoleEnum } from 'src/roles/roles.enum';
  import { PsychologistService } from './psychologist.service';
  
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @ApiTags('Psychologist')
  @Controller({
    path: 'psychologist',
    version: '1',
  })
  export class PsychologistController {
    constructor(private readonly psychologistService: PsychologistService) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createPsicologistDTO) {
      return this.psychologistService.create(createPsicologistDTO);
    }

    @Post('addSpecialist')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    addSpecialist(@Body() createPsicologistDTO) {
      return this.psychologistService.addSpecialist(createPsicologistDTO);
    }

    @Post('deleteSpecialist')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.CREATED)
    deleteSpecialist(@Body() createPsicologistDTO) {
      return this.psychologistService.deleteSpecialist(createPsicologistDTO);
    }
  
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: number, @Body() updateNivelDTO) {
      return this.psychologistService.update(id, updateNivelDTO);
    }
  
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Request() request) {
      return await this.psychologistService.find(request.query.limit ?? -1);
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
      return this.psychologistService.findOne({ id: +id });
    }
  }
  