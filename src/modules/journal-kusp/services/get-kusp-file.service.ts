import { Injectable, NotFoundException } from '@nestjs/common';
import { ArchiverService } from '@modules/archiver/services/archiver.service';
import axios from 'axios';

export interface GetKuspFile {
  fileName: string;
  downloadUrl: string;
}

@Injectable()
export class GetKuspFileService {
  constructor(private archiverService: ArchiverService) {}

  async handle({ fileName, downloadUrl }: GetKuspFile) {
    try {
      const { data: source, headers } = await axios.get<string>(downloadUrl);
      const originalName = decodeURIComponent(headers['content-disposition']?.split('filename=')[1] || fileName);
      const archive = await this.archiverService.zip({ fileName: originalName, source });
      return { archive, name: `${originalName}.zip` };
    } catch (err) {
      if (err.response?.status === 404) {
        throw new NotFoundException('Файл не найден');
      }
      throw err;
    }
  }
}
