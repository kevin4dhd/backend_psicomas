import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import { fromBuffer } from 'file-type';
import { createWriteStream } from 'fs';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}

  async uploadFile(file): Promise<FileEntity> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            file: 'selectFile',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const path = {
      local: `/${this.configService.get('app.apiPrefix')}/v1/${file.path}`,
      s3: file.location,
    };

    return this.fileRepository.save(
      this.fileRepository.create({
        path: path[this.configService.get('file.driver')],
      }),
    );
  }

  async saveFile(photo): Promise<FileEntity> {
    const base64stringBuffer = Buffer.from(
      photo.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    const result = await fromBuffer(base64stringBuffer);
    const name = `${randomStringGenerator()}.${result.ext}`;
    const pathFile = './files/' + `${name}`;
    createWriteStream(pathFile).write(base64stringBuffer);
    return this.fileRepository.save(
      this.fileRepository.create({
        path: `/${this.configService.get('app.apiPrefix')}/v1/files/${name}`,
      }),
    );
  }
}
