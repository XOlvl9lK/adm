import { BaseEntity } from '@common/base/entity.base';
import { Column, Entity } from 'typeorm';
import { CommonSettingNameEnum } from './common-setting-name.enum';

@Entity('integration_common_setting')
export class IntegrationCommonSettingEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: CommonSettingNameEnum,
    nullable: false,
    comment: 'Ключ значения общих настроек компонента',
  })
  key!: CommonSettingNameEnum;

  @Column({
    default: '',
    nullable: false,
    comment: 'Значение поля общих настроек компонента',
  })
  value!: string;

  @Column({
    type: 'bytea',
    nullable: true,
    comment: 'Значение файла сертификата в виде байт-кода общих настроек взаимодействия',
  })
  file?: Buffer;

  @Column({
    type: 'text',
    nullable: true,
    name: 'file_name',
    comment: 'Наименование файла сертификата',
  })
  fileName?: string;
}
