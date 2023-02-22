import { ErrorTypeEnum } from '@modules/journal-errors/domain/error-type.enum';
import { SiteSectionEnum } from '@modules/journal-errors/domain/site-section.enum';

export class JournalErrorsEntity {
  userLogin: string;
  eventDate: string;
  ipAddress: string;
  errorTypeTitle: ErrorTypeEnum;
  errorDescription: string;
  divisionId: string;
  divisionTitle: string;
  departmentId: string;
  departmentTitle: string;
  regionId: string;
  regionTitle: string;
  siteSectionTitle: SiteSectionEnum;
}
