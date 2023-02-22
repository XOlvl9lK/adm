import { Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class BaseHttpTransport {
  private transport!: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.transport = axios.create(config);
    this.transport.interceptors.response.use((value) => value, this.onRequestReject.bind(this));
  }

  async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T, any>> {
    return await this.transport.request<T>(config);
  }

  private onRequestReject(error: AxiosError): void {
    Logger.error(error);
  }
}
