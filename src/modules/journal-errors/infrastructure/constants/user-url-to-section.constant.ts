/* eslint-disable max-len */
import { SiteSectionEnum } from '@modules/journal-errors/domain/site-section.enum';

export const userUrlToSection: Record<string, SiteSectionEnum> = {
  '/administration/user-actions': SiteSectionEnum.ADMINISTRATION_USER_EVENTS,
  '/administration/nsi-changes': SiteSectionEnum.ADMINISTRATION_NSI_CHANGES,
  '/administration/processing-statistical-cards/statistical-cards':
    SiteSectionEnum.ADMINISTRATION_PROCESSING_STATISTICAL_CARDS,
  '/administration/processing-statistical-cards/uploads-and-downloads':
    SiteSectionEnum.ADMINISTRATION_PROCESSING_STATISTICAL_CARDS,
  '/administration/kusp-processing': SiteSectionEnum.ADMINISTRATION_KUSP_PROCESSING,
  '/administration/cancellation/statistical-cards': SiteSectionEnum.ADMINISTRATION_CANCELLATION,
  '/administration/cancellation/kusp': SiteSectionEnum.ADMINISTRATION_CANCELLATION,
  '/administration/cancellation/index-cards': SiteSectionEnum.ADMINISTRATION_CANCELLATION,
  '/administration/error-logging': SiteSectionEnum.ADMINISTRATION_ERRORS,
  '/administration/typical-violations-changes': SiteSectionEnum.ADMINISTRATION_TYPICAL_VIOLATIONS,
  '/administration/manual-export/list': SiteSectionEnum.ADMINISTRATION_MANUAL_UPLOADS,
  '/administration/manual-export/settings': SiteSectionEnum.ADMINISTRATION_MANUAL_UPLOADS,
  '/administration/history/spv': SiteSectionEnum.ADMINISTRATION_EXTERNAL_INTERACTIONS,
  '/administration/history/smev': SiteSectionEnum.ADMINISTRATION_EXTERNAL_INTERACTIONS,
  '/administration/history/file': SiteSectionEnum.ADMINISTRATION_EXTERNAL_INTERACTIONS,
  '/administration/settings/external-interactions': SiteSectionEnum.ADMINISTRATION_EXTERNAL_INTERACTIONS,
  '/administration/settings/component-common': SiteSectionEnum.ADMINISTRATION_EXTERNAL_INTERACTION_SETTINGS,
};
