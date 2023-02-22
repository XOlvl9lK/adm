import { BaseEntity } from '@common/base/entity.base';
import { ConditionTypeEnum } from '@common/enum/condition-type.enum';
import { IntegrationTypeEnum } from '@common/enum/integration-type.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { IntegrationDivisionEntity } from '../integration-division/integration-division.entity';
import { SchedulerEntity } from '../scheduler/scheduler.entity';
import { FileFilter, initialFileFilter } from './file-filter.interface';
import { initialSpvSmevFilter, SpvSmevFilter } from './spv-smev-filter.interface';

@Entity('integration')
export class IntegrationEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: IntegrationTypeEnum,
    nullable: false,
    comment: 'Тип внешнего взаимодействия',
  })
  type!: IntegrationTypeEnum;

  @Column({
    type: 'enum',
    enum: ConditionTypeEnum,
    nullable: false,
    comment: 'Состояние внешнего взаимодействия',
  })
  condition!: ConditionTypeEnum;

  @Column({
    type: 'int',
    name: 'department_id',
    nullable: false,
    comment: 'Идентификатор ведомства',
  })
  departmentId!: number;

  @Column({
    name: 'department_name',
    nullable: false,
    comment: 'Наименование ведомства',
  })
  departmentName!: string;

  @Column({
    name: 'division_id',
    nullable: true,
    comment: 'Идентификатор подразделения',
  })
  divisionId?: number;

  @Column({
    name: 'division_name',
    nullable: true,
    comment: 'Наименование подразделения',
  })
  divisionName?: string;

  @Column({
    type: 'simple-json',
    name: 'spv_filter',
    default: initialSpvSmevFilter,
    comment: 'Фильтр СПВ взаимодействия',
  })
  spvFilter?: SpvSmevFilter;

  @Column({
    name: 'spv_external_system_id',
    nullable: true,
    comment: 'Уникальный идентификатор внешней системы, зарегистрированный в ГАС ПС',
  })
  spvExternalSystemId?: string;

  @Column({
    name: 'login',
    nullable: true,
    comment: 'Уникальный ключ безопасности запроса СПВ/СМЭВ',
  })
  login?: string;

  @Column({
    type: 'simple-json',
    name: 'smev_filter',
    default: initialSpvSmevFilter,
    comment: 'Фильтр СМЭВ взаимодействия',
  })
  smevFilter?: SpvSmevFilter;

  @Column({
    name: 'smev_mnemonic',
    nullable: true,
    comment: 'Код информационной системы по унифицированному справочнику мнемоник',
  })
  smevMnemonic?: string;

  @Column({
    name: 'smev_authority_certificate',
    nullable: true,
    comment: 'Сертификат электронной подписи органа власти',
  })
  smevAuthorityCertificate?: string;

  @Column({
    type: 'simple-json',
    name: 'file_filter',
    default: initialFileFilter,
    comment: 'Фильтр Файлового взаимодействия',
  })
  fileFilter?: FileFilter;

  @Column({ name: 'file_path', nullable: true, comment: 'Каталог выгрузки' })
  filePath?: string;

  @Column({
    type: 'simple-json',
    name: 'file_scheduler_dpu_kusp',
    nullable: true,
    comment: 'Периодичность выгрузки для ДПУ КУСП (в виде объекта)',
  })
  fileSchedulerDpuKusp?: SchedulerEntity;

  @Column({
    name: 'file_cron_dpu_kusp',
    nullable: true,
    comment: 'Периодичность выгрузки для ДПУ КУСП (в виде крон строки)',
  })
  fileCronDpuKusp?: string;

  @Column({
    type: 'simple-json',
    name: 'file_scheduler_statistical_report',
    nullable: true,
    comment: 'Периодичность выгрузки для Стат. отчётов (в виде объекта)',
  })
  fileSchedulerStatisticalReport?: SchedulerEntity;

  @Column({
    name: 'file_cron_statistical_report',
    nullable: true,
    comment: 'Периодичность выгрузки для Стат. отчётов (в виде крон строки)',
  })
  fileCronStatisticalReport?: string;

  @Column({
    type: 'simple-json',
    name: 'manual_export_filter',
    default: initialFileFilter,
    comment: 'Фильтр взаимодействия для ручной выгрузки',
  })
  manualExportFilter: FileFilter;

  @OneToMany(() => IntegrationDivisionEntity, (catalogue) => catalogue.integration, { eager: true, cascade: true })
  divisions: IntegrationDivisionEntity[];

  @Column({
    type: 'text',
    name: 'last_used_date',
    nullable: true,
    comment: 'Дата последней выгрузки',
  })
  lastUsedDate?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'spv_cert',
    comment: 'Оттиск сертификата СПВ взаимодействия',
  })
  spvCert?: string;
}
