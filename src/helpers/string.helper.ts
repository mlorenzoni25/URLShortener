import { v4 as uuidV4 } from "uuid";

/**
 * Generates a UUID v4
 * @returns {string} a string in UUID v4 format
 */
export const generateUUID = (): string => uuidV4();
