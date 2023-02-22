import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LoginResult } from '@modules/nsi-dictionary/domain/login-result.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NsiDictionaryHttpTransport {
  private transport!: AxiosInstance;
  private _baseConfig: AxiosRequestConfig = {};
  private authCookie: string;
  private readonly nsiUrl = this.configService.get('NSI_DICTIONARY_URL');
  private readonly authLogin = process.env.NSI_DICTIONARY_LOGIN;
  private readonly authPassword = process.env.NSI_DICTIONARY_PASSWORD;
  private authExpirationTimestamp: number;

  get Cookie() {
    return this.authCookie;
  }

  constructor(private configService: ConfigService) {
    this.transport = axios.create({ baseURL: this.nsiUrl });
    this.transport.interceptors.response.use((value) => value, this.onRequestReject.bind(this));
  }

  get baseConfig(): AxiosRequestConfig {
    return { ...this._baseConfig };
  }

  set baseConfig(config: AxiosRequestConfig) {
    this._baseConfig = config;
  }

  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T, any>> {
    return await this.transport.request<T>(config);
  }

  private onRequestReject(error: AxiosError): void {
    Logger.error(
      `${error.response.statusText} ${error.message} ${JSON.stringify({
        request: error.request,
        response: error.response,
      })}`,
      'NsiDictionaryHttpTransport',
    );
    throw `${error.response.statusText} ${error.message} ${JSON.stringify(error.response.data)}`;
  }

  private async auth(login: string, password: string): Promise<{ headers: Record<string, any>; data: LoginResult }> {
    const result = await this.transport.request<LoginResult>({
      method: 'POST',
      url: 'api/v1/gateway/login',
      data: { login, password },
    });
    return {
      data: result.data,
      headers: result.headers,
    };
  }

  public async updateAuthCookie(): Promise<void> {
    const { authLogin, authPassword, authExpirationTimestamp } = this;
    if (authExpirationTimestamp && Date.now() < authExpirationTimestamp) return;
    const { headers, data } = await this.auth(authLogin, authPassword);
    const Cookie = headers['set-cookie']?.map((cookie) => cookie.split('; ')[0]).join('; ');
    if (!Cookie) Logger.error('No set-content header from NsiDictionaryRequestService::auth');
    this.authCookie = Cookie;
    this.authExpirationTimestamp = new Date(data.data.lifeTime).getTime();
  }
}
