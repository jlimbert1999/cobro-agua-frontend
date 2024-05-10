import { clientResponse } from '../../infrastructure/interfaces';

interface clientProps {
  id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
  status: ClientStatus;
}

export enum ClientStatus {
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
  address: string;
  status: ClientStatus;

  static fromResponse(form: clientResponse) {
    return new Client({
      id: form._id,
      firstname: form['firstname'],
      middlename: form['middlename'],
      lastname: form['lastname'],
      dni: form['dni'],
      phone: form['phone'],
      address: form['address'],
      status: form.status,
    });
  }

  constructor({
    id,
    firstname,
    middlename,
    lastname,
    dni,
    phone,
    address,
    status,
  }: clientProps) {
    this.id = id;
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.dni = dni;
    this.phone = phone;
    this.address = address;
    this.status = status;
  }

  get fullname() {
    return `${this.firstname} ${this.middlename} ${this.lastname}`;
  }

  statusLabel() {
    switch (this.status) {
      case ClientStatus.DISABLED:
        return { text: 'CORTE', severity: 'danger' };

      case ClientStatus.ENABLED:
        return { text: 'EN CURSO', severity: 'success' };

      default:
        return { text: 'DESCONOCIDO', severity: 'secondary' };
    }
  }
}
