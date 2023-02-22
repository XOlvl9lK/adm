import { GetLastRequestDate } from '@modules/file-history/services/get-last-request-date.service';
import { IsOptional, IsString } from 'class-validator';

export class GetLastRequestDateDto implements GetLastRequestDate {
  @IsString()
  departmentTitle: string;

  @IsOptional()
  @IsString()
  divisionTitle?: string;
}
