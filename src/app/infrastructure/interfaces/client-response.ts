import { ClientStatus } from '../../domain/models/client.model';

export interface clientResponse {
  _id: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  dni: string;
  phone: string;
  address: string;
  status: ClientStatus;
  type: customerType;
  meterNumber: string;
}
interface customerType {
  name: string;
}
