import { KafkaService } from '@modules/kafka/services/kafka.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { format } from 'date-fns';
import { ErrorTypeEnum } from '../domain/error-type.enum';
import { ErrorCapturedEvent } from '../domain/events/error-captured.event';
import { JournalErrorsElasticRepo } from '../infrastructure/journal-errors.elastic-repo';

@Injectable()
export class ErrorCapturedService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly journalErrorsElasticRepo: JournalErrorsElasticRepo,
  ) {}

  @OnEvent(ErrorCapturedEvent.eventName)
  async handle({ props: { user, error, siteSectionTitle, requestUrl }, eventDate }: ErrorCapturedEvent) {
    return await this.kafkaService.send(this.journalErrorsElasticRepo.index, {
      messages: [
        {
          value: {
            userLogin: user.username,
            eventDate: format(eventDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            ipAddress: user.ip,
            errorTypeTitle: ErrorTypeEnum.SYSTEM,
            errorDescription: `Текст ошибки: ${error.message}\nЗапрос: ${requestUrl}\nОписание: ${error.stack}`,
            divisionId: user.subdivision.id,
            divisionTitle: user.subdivision.name,
            departmentId: user.department.id,
            departmentTitle: user.department.name,
            regionId: user.okato.id,
            regionTitle: user.okato.name,
            siteSectionTitle,
          },
        },
      ],
    });
  }
}
