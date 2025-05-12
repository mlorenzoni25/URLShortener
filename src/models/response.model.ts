export interface ErrorResponse {
  code: number;
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
