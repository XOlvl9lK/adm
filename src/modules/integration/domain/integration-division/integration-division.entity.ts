import { BaseEntity } from '@common/base/entity.base';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IntegrationEntity } from '../integration/integration.entity';
import { SchedulerEntity } from '../scheduler/scheduler.entity';

@Entity('integration_division')
export class IntegrationDivisionEntity extends BaseEntity {
  @ManyToOne(() => IntegrationEntity, (integration) => integration.divisions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'integration_id' })
  integration: IntegrationEntity;

  @Column({ type: 'int', nullable: false, comment: 'ID подразделения' })
  divisionId!: number;

  @Column({ nullable: false, comment: 'Наименование подразделения' })
  divisionName!: string;

  @Column({ nullable: false, comment: 'Каталог выгрузки' })
  path!: string;

  @Column({
    type: 'simple-json',
    name: 'scheduler_dpu_kusp',
    nullable: true,
    comment: 'Периодичность выгрузки для ДПУ КУСП (в виде объекта)',
  })
  schedulerDpuKusp?: SchedulerEntity;

  @Column({
    name: 'cron_dpu_kusp',
    nullable: true,
    comment: 'Периодичность выгрузки для ДПУ КУСП (в виде крон строки)',
  })
  cronDpuKusp?: string;

  @Column({
    type: 'simple-json',
    name: 'scheduler_statistical_report',
    nullable: true,
    comment: 'Периодичность выгрузки для Стат. отчетов (в виде объекта)',
  })
  schedulerStatisticalReport?: SchedulerEntity;

  @Column({
    name: 'cron_statistical_report',
    nullable: true,
    comment: 'Периодичность выгрузки для Стат. отчетов (в виде крон строки)',
  })
  cronStatisticalReport?: string;
}
