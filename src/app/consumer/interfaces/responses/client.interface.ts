import { action } from './action.interface';

export interface client {
  _id: string;
  firstname: string;
  lastname: string;
  middlename: string;
  phone: number;
  dni: number;
  actions: action[];
}
