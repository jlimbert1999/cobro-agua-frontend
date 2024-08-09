import { CustomerStatus } from '../../domain/models/client.model';

export interface clientResponse {
  id: number;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  dni: string;
  phone: string;
  address: string;
  status: CustomerStatus;
  type: customerType;
  meterNumber: string;
}
interface customerType {
  id: number;
  name: string;
}
