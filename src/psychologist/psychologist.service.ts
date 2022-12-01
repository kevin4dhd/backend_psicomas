import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { Psychologist } from './entities/psychologist.entity';
import { isBase64 } from 'is-base64';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { Specialty } from 'src/specialty/entities/specialty.entity';

@Injectable()
export class PsychologistService {
  constructor(
    @InjectRepository(Psychologist)
    private psychologistRepository: Repository<Psychologist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Specialty)
    private specialtyRepository: Repository<Specialty>,
    private fileService: FilesService,
  ) {}

  async create(psychologist) {
    const where: unknown[] = [
      {
        email: psychologist.email,
      },
    ];
    if (psychologist.dni && psychologist.dni !== '') {
      where.push({
        dni: psychologist.dni,
      });
    }
    const userDB = await this.userRepository.findOne({
      where,
    });
    if (userDB) {
      if (userDB.dni == psychologist.dni) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              usuario: 'El DNI ya existe',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            usuario: 'El correo ya existe',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let photo = undefined;
    if (
      psychologist.photo &&
      isBase64(psychologist.photo, { allowMime: true })
    ) {
      photo = await this.fileService.saveFile(psychologist.photo);
      delete psychologist.photo;
    }
    const userSave = await this.userRepository.save(
      this.userRepository.create({
        ...psychologist,
        role: {
          id: RoleEnum.psychologist,
        },
        status: {
          id: StatusEnum.active,
        },
        photo: photo,
        country: 'Peru',
      }) as unknown as User,
    );
    const psychologistDB = await this.psychologistRepository.save(
      this.psychologistRepository.create({
        user: {
          id: userSave.id,
        },
        status: {
          id: StatusEnum.active,
        },
        therapyMethodology: {
          id: psychologist.therapyMethodology.id,
        },
      }),
    );
    return psychologistDB;
  }

  async update(id, psychologist) {
    const where: unknown[] = [
      {
        user: {
          email: psychologist.email,
        },
        id: Not(id),
      },
    ];
    if (psychologist.dni && psychologist.dni !== '') {
      where.push({
        user: {
          dni: psychologist.dni,
        },
        id: Not(id),
      });
    }
    console.log(where);
    const usuarioDB = await this.psychologistRepository.findOne({
      where,
      relations: {
        user: true,
      },
    });
    if (usuarioDB) {
      if (usuarioDB.user.dni == psychologist.dni) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              usuario: 'El correo ya existe',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            usuario: 'El usuario ya existe',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    let photo = undefined;
    if (
      psychologist.photo &&
      isBase64(psychologist.photo, { allowMime: true })
    ) {
      photo = await this.fileService.saveFile(psychologist.photo);
    }
    delete psychologist.photo;
    const dataUserSave = {
      ...psychologist,
    };
    delete dataUserSave.tarjeta;
    if (photo) {
      dataUserSave.photo = photo;
    }
    const psychologistDB = await this.psychologistRepository.findOne({
      where: { id: id },
      relations: {
        user: true,
      },
    });
    await this.userRepository.save(
      Object.assign(psychologistDB.user, dataUserSave),
    );
    console.log(psychologist);
    await this.psychologistRepository.update(psychologistDB.id, {
      therapyMethodology: psychologist.therapyMethodology,
      costPerHour: psychologist.costPerHour,
      about: psychologist.about,
    });
    return psychologistDB;
  }

  async addSpecialist(data) {
    const psychologist = await this.psychologistRepository.findOne({
      where: {
        id: data.psychologist,
      },
      relations: ['specialty'],
    });
    psychologist.specialty.push(
      await this.specialtyRepository.findOne({ where: { id: data.specialty } }),
    );
    await psychologist.save();
    return { ok: true };
  }

  async deleteSpecialist(data) {
    const psychologist = await this.psychologistRepository.findOne({
      where: {
        id: data.psychologist,
      },
      relations: ['specialty'],
    });
    psychologist.specialty = psychologist.specialty.filter(
      (s) => s.id != data.specialty,
    );
    console.log(psychologist.specialty);
    await psychologist.save();
    return { ok: true };
  }

  async find(limit: number) {
    if (limit > 0) {
      return await this.psychologistRepository.find({
        where: {},
        relations: ['user', 'specialty'],
        take: limit,
      });
    } else {
      return await this.psychologistRepository.find({
        where: {},
        relations: ['user', 'specialty'],
        //take: 3,
      });
    }
  }

  findOne(fields: EntityCondition<Psychologist>) {
    return this.psychologistRepository.findOne({
      where: fields,
      relations: ['user', 'specialty', 'therapyMethodology'],
    });
  }
}
