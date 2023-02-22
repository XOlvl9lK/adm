import { ActionResponse } from '../responses/action-response';

export function TransformResponse() {
  return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {
    const method = descriptor.value;
    descriptor.value = async function (...args: any[]): Promise<ActionResponse> {
      try {
        const returnData = await method.apply(this, args);
        return {
          success: true,
          data: returnData,
        };
      } catch (err) {
        console.log(err);
        return { success: false, message: err.message };
      }
    };
  };
}
