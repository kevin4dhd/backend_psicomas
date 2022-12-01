import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { Psychologist } from 'src/psychologist/entities/psychologist.entity';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Psychologist)
    private psychologistRepository: Repository<Psychologist>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async scheduleByPsychologistDate(data) {
    const fecha = data.fecha;
    return await this.scheduleRepository.find({
      where: {
        psychologist: {
          id: data.psychologist,
        },
        dateSchedule: fecha,
      },
    });
  }

  async scheduleByPsychologistDateUser(data) {
    const fecha = data.fecha;
    const appointments = await this.appointmentRepository.find({
      where: {
        psychologist: {
          id: data.psychologist,
        },
        dateAppointment: fecha,
      },
    });
    const appointmentsFilter = appointments.map((a) => a.dateHour);
    return await this.scheduleRepository.find({
      where: {
        psychologist: {
          id: data.psychologist,
        },
        dateSchedule: fecha,
        hourDay: Not(In(appointmentsFilter)),
      },
    });
  }

  async addSchedule(data) {
    const psychologist = await this.psychologistRepository.findOne({
      where: {
        id: data.psychologist,
      },
    });
    const fecha = data.fecha;
    const hora = data.hora;
    const schedule = await this.scheduleRepository.findOne({
      where: {
        psychologist: {
          id: data.psychologist,
        },
        dateSchedule: fecha,
        hourDay: hora,
      },
    });
    if (!schedule) {
      await this.scheduleRepository.save(
        this.scheduleRepository.create({
          psychologist: psychologist,
          dateSchedule: fecha,
          hourDay: hora,
        }),
      );
    }
    return { ok: true };
  }

  async deleteSchedule(data) {
    const fecha = data.fecha;
    const hora = data.hora;
    const schedule = await this.scheduleRepository.findOne({
      where: {
        psychologist: {
          id: data.psychologist,
        },
        dateSchedule: fecha,
        hourDay: hora,
      },
    });
    await schedule.remove();
    return { ok: true };
  }

  /*async create(schedule) {
    const scheduleDB = await this.scheduleRepository.findOne({
      where: {
        name: schedule.name,
      },
    });
    if (scheduleDB) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            schedule: 'La especialidad ya existe',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return await this.scheduleRepository.save(
      this.scheduleRepository.create(schedule),
    );
  }

  async update(id, schedule) {
    const therapyMethodologyDB = await this.scheduleRepository.findOne({
      where: {
        id: Not(id),
        name: schedule.name,
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
    return await this.scheduleRepository.save(
      this.scheduleRepository.create({
        id: id,
        ...schedule,
      }),
    );
  }

  async find() {
    return await this.scheduleRepository.find({
      where: {},
    });
  }

  findOne(fields: EntityCondition<Schedule>) {
    return this.scheduleRepository.findOne({
      where: fields,
    });
  }*/
}
