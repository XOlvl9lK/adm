export interface NsiRegion {
  /** string as uuid */
  id: string;
  created: null;
  updated: null;
  createdBy: null;
  updatedBy: null;
  elementId: string;
  version: {
    /** string as uuid */
    id: string;
    /** string as date */
    created: string;
    /** string as date */
    updated: string;
    createdBy: null;
    updatedBy: null;
    /** string as uuid */
    entryId: string;
    period: {
      /** string as date */
      lower: string;
      /** string as date */
      upper: string;
    };
    data: {
      ID: number;
      KC: null;
      ORD: number;
      TER: null;
      CODE: string;
      KOD1: null;
      KOD2: null;
      KOD3: null;
      KODR: number;
      NAME: string;
      NAME1: string;
      OKTMO: null;
      /** string as date */
      INDATE: string;
      RAZDEL: null;
      CENTRUM: null;
      DATEUTV: null;
      /** string as date */
      OUTDATE: string;
      VERSION: number;
      DATEVVED: null;
      PARENT_ID?: {
        pointer?: {
          /** string as uuid */
          id: string;
          key: string;
          service: 'mdm';
          register: 'element';
          /** string as uuid */
          catalogue: string;
        };
      };
      TIMEZONE_OKTMO: null;
    };
  };
  /** string {entry} */
  type: string;
}
