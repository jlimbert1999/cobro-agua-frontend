import { action } from '../interfaces';

interface clientProps {
  firstname: string;
  lastname: string;
  dni: number;
  phone: number;
  middlename: string;
  actions: string[];
}
export class CreateClientDto {
  firstname: string;
  lastname: string;
  dni: number;
  phone: number;
  middlename: string;
  actions: string[];

  static fromFormGroup(form: any) {
    return new CreateClientDto({
      firstname: form['firstname'],
      lastname: form['lastname'],
      dni: form['dni'],
      phone: form['phone'],
      middlename: form['middlename'],
      actions: form['actions'],
    });
  }

  constructor({
    firstname,
    lastname,
    dni,
    phone,
    middlename,
    actions,
  }: clientProps) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.dni = dni;
    this.phone = phone;
    this.middlename = middlename;
    this.actions = actions;
  }
}
