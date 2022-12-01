import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';

@Entity()
export class TherapyMethodology extends EntityHelper {
  @PrimaryGeneratedColumn('identity', {
    name: 'id',
    generatedIdentity: 'BY DEFAULT',
  })
  id: number;

  @Allow()
  @Column()
  name?: string;
}
