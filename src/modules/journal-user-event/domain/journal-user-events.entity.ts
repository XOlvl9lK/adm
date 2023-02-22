import { UserEventResultTypeEnum } from '@modules/journal-user-event/domain/user-event-result-type.enum';

export class JournalUserEventsEntity {
  userLogin: string;
  eventDate: string;
  url: string;
  browserVersion: string;
  ipAddress: string;
  resultTitle: UserEventResultTypeEnum;
  queryParam: string;
  divisionTitle: string;
  divisionId: string;
  departmentTitle: string;
  departmentId: string;
  regionTitle: string;
  regionId: string;
}
