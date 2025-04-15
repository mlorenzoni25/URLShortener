export interface ErrorResponse {
  code: number;
  field?: string;
  messages: string[];
}

export interface BaseResponse {
  status: boolean;
}

export interface ErrorBaseResponse extends BaseResponse {
  status: false;
  error: ErrorResponse;
}

export interface DataResponse<T> extends BaseResponse {
  status: true;
  data: T;
}
