import { BaseHttpTransport } from '@common/base/http.transport.base';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetInformationalPermissionsResponse } from './get-information-permissions.response.interface';
import { GetUserResponse } from './get-user.response.interface';

@Injectable()
export class AuthHttpTransport extends BaseHttpTransport {
  constructor(configService: ConfigService) {
    super({ baseURL: configService.get('DIB_URL') });
  }

  async getUser(token: string) {
    const { data } = await this.request<GetUserResponse>({
      method: 'GET',
      url: `auth/api/v1/admin/common/token/user`,
      headers: { authorization: token },
    });
    return data;
  }

  async getInformationalPermissions(token: string) {
    const { data } = await this.request<GetInformationalPermissionsResponse>({
      method: 'GET',
      url: `auth/api/v1/admin/common/token/informationalPermissions`,
      headers: { authorization: token },
    });
    return data;
  }
}
