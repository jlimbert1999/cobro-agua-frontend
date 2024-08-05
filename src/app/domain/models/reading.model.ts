import { DateFormat } from '../../helpers';
import { readingResponse } from '../../infrastructure';

interface readingProps {
  id: number;
  reading: number;
  consumption: number;
  year: number;
  month: number;
}
export class Reading {
  id: number;
  reading: number;
  consumption: number;
  year: number;
  month: number;

  static fromResponse(response: readingResponse) {
    return new Reading({
      id: response.id,
      reading: response.reading,
      consumption: response.consumption,
      year: response.year,
      month: response.month,
    });
  }

  constructor({ id, reading, consumption, year, month }: readingProps) {
    this.id = id;
    this.reading = reading;
    this.consumption = consumption;
    this.year = year;
    this.month = month;
  }

  get datetimeLabel() {
    return DateFormat.getMonthLabel(this.year, this.month);
  }
}
