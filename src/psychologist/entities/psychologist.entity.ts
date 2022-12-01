import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { Status } from 'src/statuses/entities/status.entity';
import { TherapyMethodology } from 'src/therapy-methodology/entities/therapy-methodology.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';

@Entity()
export class Psychologist extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true, type: 'float8' })
  costPerHour: Date;

  @Allow()
  @ManyToOne(() => User, {
    eager: false,
  })
  user: User;

  @ManyToOne(() => TherapyMethodology, {
    eager: false,
  })
  therapyMethodology?: TherapyMethodology;

  @ManyToMany(() => Specialty, {
    eager: false,
  })
  @JoinTable()
  specialty?: Specialty[];

  @OneToMany(() => Schedule, (s) => s.psychologist)
  @JoinTable()
  schedules?: Schedule[];

  @ManyToOne(() => Status, {
    eager: false,
  })
  status?: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
