import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { Not, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private fileService: FilesService,
    private mailService: MailService,
  ) {}

  async create(appointment) {
    const appointmentDB = await this.appointmentRepository.save(
      this.appointmentRepository.create({
        psychologist: {
          id: appointment.reserva.specialistId,
        },
        dateAppointment: appointment.reserva.fecha,
        dateHour: appointment.reserva.hora,
        asunto: appointment.cita.asunto,
        DNI: appointment.cita.dni,
        nombres: appointment.cita.nombres,
        telefono: appointment.cita.telefono,
        correo: appointment.cita.correo,
      }),
    );
    await this.mailService.userSignUp({
      to: appointment.cita.correo,
      appointment: appointmentDB,
    });
    return {};
  }

  async update(id, appointment) {
    const therapyMethodologyDB = await this.appointmentRepository.findOne({
      where: {
        id: Not(id),
        //name: appointment.name,
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
    return await this.appointmentRepository.save(
      this.appointmentRepository.create({
        id: id,
        ...appointment,
      }),
    );
  }

  async find() {
    return await this.appointmentRepository.find({
      where: {},
    });
  }

  findOne(fields: EntityCondition<Appointment>) {
    return this.appointmentRepository.findOne({
      where: fields,
    });
  }
}
