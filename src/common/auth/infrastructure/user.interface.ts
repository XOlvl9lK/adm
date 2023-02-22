export interface User {
  username: string;
  fullName: string;
  post: string;
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  timeZone?: number;
  ip: string;
  permissions: string[];
  vip: boolean;
  roles: {
    id: string;
    name?: string;
  }[];
  okato: {
    id: string;
    name: string;
  };
  department: {
    id: string;
    name: string;
  };
  subdivision: {
    id: string;
    name: string;
  };
  subdivisions: {
    id: string;
    name: string;
    departmentId: string;
  }[];
}
