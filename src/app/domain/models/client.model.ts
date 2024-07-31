import { clientResponse } from '../../infrastructure/interfaces';

interface clientProps {
  id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  status: CustomerStatus;
  type: typeCustomer;
  meterNumber: string;
}
interface typeCustomer {
  id: number;
  name: string;
}

export enum CustomerStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export class Client {
  id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  status: CustomerStatus;
  type: typeCustomer;
  meterNumber: string;

  static fromResponse(form: clientResponse) {
    return new Client({
      id: form.id,
      firstname: form['firstname'] ?? '',
      middlename: form['middlename'] ?? '',
      lastname: form['lastname'] ?? '',
      dni: form['dni'] ?? '',
      phone: form['phone'] ?? '',
      status: form.status,
      type: { id: form.type.id, name: form.type.name },
      meterNumber: form.meterNumber,
    });
  }

  constructor({
    id,
    firstname,
    middlename,
    lastname,
    dni,
    phone,
    status,
    type,
    meterNumber,
  }: clientProps) {
    this.id = id;
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.dni = dni;
    this.phone = phone;
    this.status = status;
    this.type = type;
    this.meterNumber = meterNumber;
  }

  get fullname() {
    return `${this.firstname??''} ${this.middlename??''} ${this.lastname??''}`;
  }

  statusLabel() {
    switch (this.status) {
      case CustomerStatus.DISABLED:
        return { text: 'CORTE', severity: 'danger' };

      case CustomerStatus.ENABLED:
        return { text: 'EN CURSO', severity: 'success' };

      default:
        return { text: 'DESCONOCIDO', severity: 'secondary' };
    }
  }
}
