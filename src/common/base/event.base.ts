export class BaseEvent<T = Record<string, unknown>> {
  public static eventName: string;
  public eventDate = new Date();
  constructor(public readonly props: T) {}
}
