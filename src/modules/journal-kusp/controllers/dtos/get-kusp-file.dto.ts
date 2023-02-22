import { GetKuspFile } from '@modules/journal-kusp/services/get-kusp-file.service';
import { IsString } from 'class-validator';

export class GetKuspFileDto implements GetKuspFile {
  @IsString()
  fileName: string;

  @IsString()
  downloadUrl: string;
}
