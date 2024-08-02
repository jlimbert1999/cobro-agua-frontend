import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export class DateFormat {
  static getMonthLabel(date: Date): string {
    return format(date, 'MMMM', { locale: es });
  }
}
