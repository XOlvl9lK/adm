import { BaseEntity } from '@common/base/entity.base';
import { IntegrationEntity } from '@modules/integration/domain/integration/integration.entity';
import { SchedulerTypeEnum } from '@modules/integration/domain/scheduler/scheduler.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ExportTypeEnum } from './export-type.enum';
import { FileHistoryStatusEnum } from './file-history-status.enum';

@Entity('scheduler_task')
export class FileHistoryEntity extends BaseEntity {
  @ManyToOne(() => IntegrationEntity, (integration) => integration.id)
  @JoinColumn({ name: 'integration_id' })
  integration?: IntegrationEntity;

  @Column({
    name: 'integration_id',
    nullable: true,
    comment: 'ID внешнего взаимодействия',
  })
  integrationId?: string;

  @Column({
    type: 'text',
    name: 'planned_start_date',
    comment: 'Запланированная дата начала',
  })
  plannedStartDate: string;

  @Column({
    type: 'text',
    name: 'start_date',
    comment: 'Дата начала',
    nullable: true,
  })
  startDate: string;

  @Column({ comment: 'Статус' })
  status?: FileHistoryStatusEnum;

  @Column({
    name: 'error_description',
    nullable: true,
    comment: 'Описание ошибки (если есть)',
  })
  errorDescription?: string;

  @Column({
    type: 'enum',
    enum: ExportTypeEnum,
    name: 'export_type',
    comment: 'Тип выгрузки',
  })
  exportType: ExportTypeEnum;

  @Column({
    type: 'enum',
    enum: SchedulerTypeEnum,
    comment: 'Периодичность',
    nullable: true,
  })
  periodicity: SchedulerTypeEnum;

  @Column({ name: 'file_url', nullable: true, comment: 'URL файла' })
  fileUrl?: string;
}
