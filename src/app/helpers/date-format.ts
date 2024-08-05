import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export class DateFormat {
  static getMonthLabel(year: number, month: number): string {
    return format(new Date(year, month), 'MMMM y', { locale: es });
  }
}
