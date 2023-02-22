export interface NsiDepartment {
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
      ORD: number;
      CODE: string;
      NAME: string;
      /** string as date */
      INDATE: string;
      /** string as date */
      OUTDATE: string;
      VERSION: number;
      PARENT_ID: null;
    };
  };
  /** string {entry} */
  type: string;
}
