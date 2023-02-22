import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { GetNsiSubdivision } from '../../services/get-nsi-subdivision.service';
import { FindAuthorityDto } from '@modules/nsi-dictionary/controllers/dtos/find-authority.dto';

export class FindAllNsiSubdivisionDto extends FindAuthorityDto implements GetNsiSubdivision {
  @IsString()
  departmentTitle!: string;

  @IsOptional()
  @IsString()
  regionTitle?: string;

  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  showHidden?: boolean;
}
