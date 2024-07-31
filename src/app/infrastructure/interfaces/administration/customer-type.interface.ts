export interface customerTypeResponse {
  id: number;
  name: string;
  maxDelayMonths: number;
  minimumPrice: number;
  preferences: preference[];
}

export interface preference {
  id: number;
  maxUnits: number;
  minUnits: number;
  priceByUnit: number;
}
