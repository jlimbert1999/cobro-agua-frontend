import { clientResponse } from '../../infrastructure/interfaces';

interface clientProps {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  status: CustomerStatus;
  type: typeCustomer;
  meterNumber: string;
  discount?: discountProps;
}
interface typeCustomer {
  id: number;
  name: string;
}

interface discountProps {
  id: number;
  name: string;
  percentage: number;
}

export enum CustomerStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export class Client {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  status: CustomerStatus;
  type: typeCustomer;
  meterNumber: string;
  discount?: discountProps;

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
      discount: form.discount,
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
    discount,
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
    this.discount = discount;
  }

  get fullname() {
    return `${this.firstname ?? ''} ${this.middlename ?? ''} ${
      this.lastname ?? ''
    }`;
  }

  get meterDetail() {
    return `${this.fullname} - Medidor: ${this.meterNumber}`;
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
