import { client } from '../interfaces';

interface ClientProps {
  _id: string;
  firstname: string;
  lastname: string;
  middlename: string;
  phone: number;
  dni: number;
  actions: action[];
}

interface action {
  _id: string;
  address: string;
  code: string;
}

export class Client {
  static responseToModel(client: client) {
    return new Client(client);
  }
  _id: string;
  firstname: string;
  lastname: string;
  middlename: string;
  phone: number;
  dni: number;
  actions: action[];
  constructor({
    _id,
    firstname,
    lastname,
    middlename,
    phone,
    dni,
    actions,
  }: ClientProps) {
    this._id = _id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.middlename = middlename;
    this.phone = phone;
    this.dni = dni;
    this.actions = actions;
  }

  fullname() {
    return `${this.firstname} ${this.middlename} ${this.lastname}`;
  }
}
