import { NsiChangeObjectEnum } from '@modules/journal-nsi-change/domain/nsi-change-object.enum';
import { NsiChangeActionEnum } from '@modules/journal-nsi-change/domain/nsi-change-action.enum';

export class NsiChangeEntity {
  eventDate: string;
  userName: string;
  ipAddress: string;
  sessionId: string;
  objectTitle: NsiChangeObjectEnum;
  eventTitle: NsiChangeActionEnum;
}
