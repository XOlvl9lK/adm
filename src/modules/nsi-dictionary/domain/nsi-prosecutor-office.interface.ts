export interface NsiProsecutorOffice {
  /** string as uuid */
  id: 'f68ac9b5-fe20-4fb8-bbfa-7c39c397b39b';
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
      ID: 91835807;
      ORD: 9620;
      VRN: null;
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
          service: 'mdm';
          register: 'element';
          catalogue: string;
        };
      };
      /** string as date */
      OUTDATE: string;
      VERSION: number;
      OKATO_ID: {
        pointer: {
          /** string as uuid */
          id: string;
          key: string;
          service: 'mdm';
          register: 'element';
          /** string as uuid */
          catalogue: string;
        };
      };
      PARENT_ID: {
        pointer: {
          /** string as uuid */
          id: string;
          key: string;
          service: 'mdm';
          register: 'element';
          /** string as uuid */
          catalogue: string;
        };
      };
      OKTMO_LOC_ID: null;
    };
  };
  type: 'entry';
}
