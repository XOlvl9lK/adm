import { BaseEntity } from '@common/base/entity.base';
import { SmevHistoryEntity } from '@modules/smev-history/domain/smev-history.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SmevAttachmentTypeEnum } from './smev-attachment-type.enum';

@Entity('smev_attachment')
export class SmevAttachmentEntity extends BaseEntity {
  @Column({ type: 'enum', enum: SmevAttachmentTypeEnum })
  type: SmevAttachmentTypeEnum;

  @ManyToOne(() => SmevHistoryEntity)
  @JoinColumn({ name: 'smev_task_id' })
  smevTask: SmevHistoryEntity;

  @Column({ name: 'smev_uuid' })
  smevUuid: string;

  @Column({ name: 'minio_path' })
  minioPath: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'mime_type' })
  mimeType: string;
}
