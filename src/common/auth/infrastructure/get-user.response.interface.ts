export interface GetUserResponse {
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    patronymic: string;
    remoteIp: string;
    roleInfo: {
      id: string;
      name: string;
      description: string;
      types: string[];
    }[];
    post: string;
    timeZone: number;
    fullName: string;
    vip: boolean;
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
  };
  permissions: Record<string, string[]>;
}
