import { SpvMethodNameEnum } from '@modules/spv-history/domain/spv-method-name.enum';
import { IsEnum, IsString } from 'class-validator';

export class HistoryRequestMethodDto {
  @IsEnum(SpvMethodNameEnum)
  name: SpvMethodNameEnum;

  @IsString()
  methodName: string;
}
