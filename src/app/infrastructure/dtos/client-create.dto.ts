interface clientProps {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
  meterNumber: string;
}
export class CreateClientDto {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
  meterNumber: string;

  static fromForm(form: any) {
    return new CreateClientDto({
      firstname: form['firstname'],
      middlename: form['middlename'],
      lastname: form['lastname'],
      dni: form['dni'],
      phone: form['phone'],
      address: form['address'],
      meterNumber: form['meterNumber'],
    });
  }

  constructor({
    firstname,
    middlename,
    lastname,
    dni,
    phone,
    address,
    meterNumber,
  }: clientProps) {
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.dni = dni;
    this.phone = phone;
    this.address = address;
    this.meterNumber = meterNumber;
  }
}
