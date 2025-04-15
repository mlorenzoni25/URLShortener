import { BaseResponse, DataResponse } from "../models/response.model.js";

/**
 * Gets the object to send as responde to the client
 * @returns {BaseResponse} object to send to the client
 */
export const createBaseResponse = (): BaseResponse => ({ status: true });

/**
 * Gets the object to send as responde to the client with a custom payload
 * @param {T} data custom payload to insert into the object
 * @returns {DataResponse<T>} complete object to send to the client
 */
export const createDataResponse = <T>(data: T): DataResponse<T> => ({ status: true, data });
