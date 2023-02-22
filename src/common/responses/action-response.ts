export type ActionResponse<T = unknown> = {
  success: boolean;
  code?: string;
  message?: string;
  data?: T;
};
