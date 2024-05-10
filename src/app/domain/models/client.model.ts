import { clientResponse } from '../../infrastructure/interfaces';

interface clientProps {
  id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
}
export class Client {
  id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;

  static fromResponse(form: clientResponse) {
    return new Client({
      id: form._id,
      firstname: form['firstname'],
      middlename: form['middlename'],
      lastname: form['lastname'],
      dni: form['dni'],
      phone: form['phone'],
      address: form['address'],
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
  }: clientProps) {
    this.id = id;
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.dni = dni;
    this.phone = phone;
    this.address = address;
  }

  get fullname() {
    return `${this.firstname} ${this.middlename} ${this.lastname}`;
  }
}
