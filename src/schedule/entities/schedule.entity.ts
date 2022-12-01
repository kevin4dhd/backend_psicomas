import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Psychologist } from 'src/psychologist/entities/psychologist.entity';

@Entity()
export class Schedule extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Psychologist, {
    eager: true,
  })
  psychologist?: Psychologist;

  @Column()
  dateSchedule: Date;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  week: number;

  @Column()
  hourDay: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
