export interface invoiceResponse {
  _id: string;
  client: string;
  amount: number;
  status: string;
  issue_date: Date;
  services: service;
}

interface service {
  consumption: number;
}
