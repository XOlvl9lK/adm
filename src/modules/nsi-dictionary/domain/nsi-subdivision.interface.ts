export interface NsiSubdivision {
  /** string as uuid */
  id: string;
  created: null;
  updated: null;
  createdBy: null;
  updatedBy: null;
  /** string as uuid */
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
      FK: null;
      ID: number;
      ORD: number;
      VRN: {
        pointer: {
          /** string as uuid */
          id: string;
          key: string;
          service: string;
          register: string;
          /** string as uuid */
          catalogue: string;
        };
      };
      NAME: string;
      UNIQ: string;
      SHIFR: null;
      /** string as date */
      INDATE: string;
      KOD_SD: null;
      STATUS: null;
      VED_ID: {
        pointer: {
          /** string as uuid */
          id: string;
          key: string;
          service: string;
          register: string;
          catalogue: string;
        };
      };
      /** string as date */
      OUTDATE: string;
      VERSION: number;
      OKATO_ID?: {
        pointer?: {
          /** string as uuid */
          id: string;
          key: string;
          service: string;
          register: string;
          /** string as uuid */
          catalogue: string;
        };
      };
      PARENT_ID: null;
      OKTMO_LOC_ID: null;
    };
  };
  type: 'entry';
}
