export interface APIResponse {
    statusCode: number; 
    isSuccess: boolean;
    errorMessages: string[];
    result: any; 
  }
  