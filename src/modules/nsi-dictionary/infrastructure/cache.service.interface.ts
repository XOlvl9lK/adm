import { NsiRegion } from '@modules/nsi-dictionary/domain/nsi-region.interface';
import { NsiDepartment } from '@modules/nsi-dictionary/domain/nsi-department.interface';
import { NsiSubdivision } from '@modules/nsi-dictionary/domain/nsi-subdivision.interface';
import { NsiResponseMeasure } from '@modules/nsi-dictionary/domain/nsi-response-measure.interface';
import { NsiProsecutorOffice } from '@modules/nsi-dictionary/domain/nsi-prosecutor-office.interface';

export type NsiCacheKey = 'region' | 'department' | 'subdivision' | 'responseMeasure' | 'prosecutorOffice';
export type NsiCacheValue = NsiRegion | NsiDepartment | NsiSubdivision | NsiResponseMeasure | NsiProsecutorOffice;

export type NsiCache =
  | {
      key: 'region';
      value: NsiRegion[];
    }
  | {
      key: 'department';
      value: NsiDepartment[];
    }
  | {
      key: 'subdivision';
      value: NsiSubdivision[];
    }
  | {
      key: 'responseMeasure';
      value: NsiResponseMeasure[];
    }
  | {
      key: 'prosecutorOffice';
      value: NsiProsecutorOffice[];
    };

export interface ICacheService {
  setCacheValue: ({ key, value }: NsiCache) => void;
  getCacheValue: <T extends NsiCacheValue>(key: NsiCacheKey) => T[];
  get lastCleanDate(): number;
}
