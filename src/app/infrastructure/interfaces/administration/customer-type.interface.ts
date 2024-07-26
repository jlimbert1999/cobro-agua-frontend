export interface customerType {
  id: number;
  name: string;
  maxDelayMonths: number;
  preferences: preference[];
}

export interface preference {
  id: number;
  maxUnits: number;
  minUnits: number;
  priceByUnit: number;
}
