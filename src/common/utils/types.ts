import { BaseEntity } from '../base/entity.base';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListRequestDto {
  @ApiProperty({
    description: 'Страница',
    default: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'number' ? value : Number(value)))
  @IsNumber({ allowInfinity: false, allowNaN: false })
  page?: number;

  @ApiProperty({
    description: 'Кол-во записей на странице',
    default: 10,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'number' ? value : Number(value)))
  @IsNumber({ allowInfinity: false, allowNaN: false })
  pageSize?: number;

  @ApiProperty({
    description: 'Сортировка',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'object' ? value : JSON.parse(value)))
  @IsObject()
  sort?: SortQuery;

  @ApiProperty({
    description: 'Уникальность по полю',
    required: false,
  })
  @IsOptional()
  @IsString()
  collapse?: string;

  @IsOptional()
  offset?: string | number;
}

export type SortQuery<T extends BaseEntity = BaseEntity> = {
  [K in keyof T]: 'ASC' | 'DESC';
};

export type MgetResponse<T> = {
  docs: Array<{
    _index: string;
    _id: string;
    _version: number;
    _seq_no: number;
    _primary_term: number;
    found: boolean;
    _source: T;
  }>;
};

export class IdDto {
  @ApiProperty({
    description: 'Id',
    required: false,
  })
  @IsString()
  id: string;
}
