import { Injectable, Logger } from '@nestjs/common';
import { AuthHttpTransport } from '../infrastructure/auth.http.transport';
import { User } from '../infrastructure/user.interface';
import { GetUserResponse } from '../infrastructure/get-user.response.interface';
import { UserCacheRepository } from '../infrastructure/user.cache.repository';

@Injectable()
export class CacheUserService {
  constructor(private authHttpTransport: AuthHttpTransport, private userCacheRepository: UserCacheRepository) {}

  async handle(token: string, ip: string) {
    try {
      const [response, { subdivisions }] = await Promise.all([
        this.authHttpTransport.getUser(token),
        this.authHttpTransport.getInformationalPermissions(token),
      ]);
      const user = this.mapResponseToUser(response);
      this.userCacheRepository.setUser(token, {
        ...user,
        ip,
        subdivisions,
      });
      return { cached: true };
    } catch (err) {
      return { cached: false, error: err };
    }
  }

  private mapResponseToUser(data: GetUserResponse): Omit<User, 'ip' | 'subdivisions'> {
    return {
      firstName: data.user.firstName ?? null,
      lastName: data.user.lastName ?? null,
      patronymic: data.user.patronymic ?? null,
      post: data.user.post ?? '',
      fullName: data.user.fullName,
      username: data.user.username,
      timeZone: data.user.timeZone ?? null,
      roles: (data.user.roleInfo ?? []).map((obj) => ({
        id: obj.id,
        name: obj.name ?? '',
      })),
      vip: data.user.vip,
      okato: data.user.okato,
      department: data.user.department,
      subdivision: data.user.subdivision,
      permissions: Object.entries(data.permissions || {}).flatMap(([permission, actions]) =>
        permission.startsWith('objects.gasps.section.administration') && actions.includes('access') ? [permission] : [],
      ),
    };
  }
}
