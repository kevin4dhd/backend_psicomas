import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { User } from 'src/users/entities/user.entity';
import { Psychologist } from './entities/psychologist.entity';
import { PsychologistController } from './psychologist.controller';
import { PsychologistService } from './psychologist.service';

@Module({
  imports: [
    FilesModule,
    TypeOrmModule.forFeature([Psychologist, User, Specialty]),
  ],
  controllers: [PsychologistController],
  providers: [PsychologistService],
  exports: [PsychologistService],
})
export class PsychologistModule {}
