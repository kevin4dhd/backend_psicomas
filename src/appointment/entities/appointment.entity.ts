import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { Psychologist } from 'src/psychologist/entities/psychologist.entity';

@Entity()
export class Appointment extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  /*@Allow()
  @ManyToOne(() => User, {
    eager: true,
  })
  user: User;*/

  @Allow()
  @ManyToOne(() => Psychologist, {
    eager: true,
  })
  psychologist: Psychologist;

  @Column({ nullable: false })
  dateAppointment: Date;

  @Column({ nullable: false })
  dateHour: number;

  @Column({ default: '' })
  link: string;

  @Column({ default: '' })
  notes: string;

  @Column({ default: '' })
  opinion: string;

  @Column()
  asunto: string;

  @Column()
  DNI: string;

  @Column()
  nombres: string;

  @Column()
  telefono: string;

  @Column()
  correo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
