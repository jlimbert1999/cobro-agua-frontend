export interface readingResponse {
  client: string;
  reading_date: Date;
  previous_reading: number;
  current_reading: number;
  consumption: number;
}
