import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/base/entity.base';
import { IntegrationEntity } from '@modules/integration/domain/integration/integration.entity';
import { SmevHistoryStateEnum } from '@modules/smev-history/domain/smev-history-state.enum';
import { SmevMethodNameEnum } from './smev-method-name.enum';

@Entity('smev_task')
export class SmevHistoryEntity extends BaseEntity {
  @ManyToOne(() => IntegrationEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'integration_id' })
  integration: IntegrationEntity;

  @Column({ type: 'text', nullable: false, comment: 'Статус запроса' })
  state: SmevHistoryStateEnum;

  @Column({
    name: 'lawstat_request_id',
    nullable: true,
    comment: 'идентификатор запроса Суды',
  })
  lawstatRequestId?: string;

  @Column({
    name: 'task_uuid',
    nullable: true,
    comment: 'Идентификатор задачи',
  })
  taskUuid?: string;

  @Column({ name: 'method_name', nullable: true, comment: 'Тип запроса' })
  methodName?: SmevMethodNameEnum;

  @Column({ name: 'reply_to', nullable: true, comment: 'Адресат' })
  replyTo?: string;

  @Column({
    name: 'get_task_request',
    nullable: true,
    comment: 'Получение задачи. XML запроса',
  })
  getTaskRequest?: string;

  @Column({
    name: 'get_task_response',
    nullable: true,
    comment: 'Получение задачи. XML ответа',
  })
  getTaskResponse?: string;

  @Column({
    name: 'ack_request',
    nullable: true,
    comment: 'Подтверждение получения задачи. XML запроса',
  })
  ackRequest?: string;

  @Column({
    name: 'ack_response',
    nullable: true,
    comment: 'Подтверждение получения задачи. XML ответа',
  })
  ackResponse?: string;

  @Column({
    name: 'send_task_request_with_signature',
    nullable: true,
    comment: 'Решение задачи. XML запроса с подписью',
  })
  sendTaskRequestWithSignature?: string;

  @Column({
    name: 'send_task_request_without_signature',
    nullable: true,
    comment: 'Решение задачи. XML ответа без подписи',
  })
  sendTaskRequestWithoutSignature?: string;

  @Column({
    name: 'send_task_response',
    nullable: true,
    comment: 'Решение задачи. XML ответа',
  })
  sendTaskResponse?: string;

  @Column({
    name: 'error_description',
    nullable: true,
    comment: 'Описание ошибки',
  })
  errorDescription?: string;

  @Column({ name: 'error', nullable: true, comment: 'Код ошибки' })
  error?: string;
}
