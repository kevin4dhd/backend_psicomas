import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TherapyMethodology } from './entities/therapy-methodology.entity';
import { TherapyMethodologyController } from './therapy-methodology.controller';
import { TherapyMethodologyService } from './therapy-methodology.service';

@Module({
  imports: [TypeOrmModule.forFeature([TherapyMethodology])],
  controllers: [TherapyMethodologyController],
  providers: [TherapyMethodologyService],
  exports: [TherapyMethodologyService],
})
export class TherapyMethodologyModule {}
