export interface invoiceResponse {
  id: string;
  amount: number;
  createdAt: string;
  service: service;
}

interface service {
  consumption: number;
}
