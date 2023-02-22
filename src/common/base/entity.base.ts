import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn({ comment: 'ID Сущности' })
  readonly id: number;

  @CreateDateColumn({
    type: 'text',
    name: 'create_date',
    comment: 'Дата и время создания сущности',
  })
  createDate: string;

  @UpdateDateColumn({
    type: 'text',
    name: 'update_date',
    comment: 'Дата и время последнего обновления сущности',
  })
  updateDate: string;
}
