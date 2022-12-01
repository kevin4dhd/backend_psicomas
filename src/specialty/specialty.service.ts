import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { Not, Repository } from 'typeorm';
import { Specialty } from './entities/specialty.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,
    private fileService: FilesService,
  ) {}

  async create(specialty) {
    const specialtyDB = await this.specialtyRepository.findOne({
      where: {
        name: specialty.name,
      },
    });
    if (specialtyDB) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            specialty: 'La especialidad ya existe',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.specialtyRepository.save(
      this.specialtyRepository.create(specialty),
    );
  }

  async update(id, specialty) {
    const therapyMethodologyDB = await this.specialtyRepository.findOne({
      where: {
        id: Not(id),
        name: specialty.name,
      },
    });
    if (therapyMethodologyDB) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            usuario: 'La especialidad ya existe',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.specialtyRepository.save(
      this.specialtyRepository.create({
        id: id,
        ...specialty,
      }),
    );
  }

  async find() {
    return await this.specialtyRepository.find({
      where: {},
    });
  }

  findOne(fields: EntityCondition<Specialty>) {
    return this.specialtyRepository.findOne({
      where: fields,
    });
  }
}
