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
  discount?: discount;
}
interface customerType {
  id: number;
  name: string;
}

interface discount {
  id: number;
  name: string;
  percentage: number;
}
