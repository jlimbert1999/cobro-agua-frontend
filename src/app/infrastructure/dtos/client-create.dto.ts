interface clientProps {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
}
export class CreateClientDto {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;

  static fromForm(form: any) {
    return new CreateClientDto({
      firstname: form['firstname'],
      middlename: form['middlename'],
      lastname: form['lastname'],
      dni: form['dni'],
      phone: form['phone'],
      address: form['address'],
    });
  }

  constructor({
    firstname,
    middlename,
    lastname,
    dni,
    phone,
    address,
  }: clientProps) {
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.dni = dni;
    this.phone = phone;
    this.address = address;
  }
}
