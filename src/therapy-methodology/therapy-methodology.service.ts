import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { Not, Repository } from 'typeorm';
import { TherapyMethodology } from './entities/therapy-methodology.entity';

@Injectable()
export class TherapyMethodologyService {
  constructor(
    @InjectRepository(TherapyMethodology)
    private therapyMethodologyRepository: Repository<TherapyMethodology>,
  ) {}

  async create(therapyMethodology) {
    const therapyMethodologyDB =
      await this.therapyMethodologyRepository.findOne({
        where: {
          name: therapyMethodology.name,
        },
      });
    if (therapyMethodologyDB) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            usuario: 'La metodologia ya existe',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.therapyMethodologyRepository.save(
      this.therapyMethodologyRepository.create(therapyMethodology),
    );
  }

  async update(id, therapyMethodology) {
    const therapyMethodologyDB =
      await this.therapyMethodologyRepository.findOne({
        where: {
          id: Not(id),
          name: therapyMethodology.name,
        },
      });
    if (therapyMethodologyDB) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            usuario: 'La metodologia ya existe',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.therapyMethodologyRepository.save(
      this.therapyMethodologyRepository.create({
        id: id,
        ...therapyMethodology,
      }),
    );
  }

  find(fields: EntityCondition<TherapyMethodology>) {
    return this.therapyMethodologyRepository.find({
      where: fields,
    });
  }

  findOne(fields: EntityCondition<TherapyMethodology>) {
    return this.therapyMethodologyRepository.findOne({
      where: fields,
    });
  }
}
