import { customAlphabet } from 'nanoid';

const library = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const createId = customAlphabet(library, 19);
