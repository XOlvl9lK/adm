import { ListRequestDto } from '@common/utils/types';
import { IsOptional, IsString } from 'class-validator';

export class FindAuthorityDto extends ListRequestDto {
  @IsOptional()
  @IsString()
  search?: string;
}
