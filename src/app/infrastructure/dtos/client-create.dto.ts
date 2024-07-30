interface clientProps {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
  meterNumber: string;
  type: number;
}
export class CreateClientDto {
  firstname: string;
  middlename: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
  meterNumber: string;
  type: number;

  static fromForm(form: any) {
    return new CreateClientDto({
      firstname: form['firstname'],
      middlename: form['middlename'],
      lastname: form['lastname'],
      dni: form['dni'],
      phone: form['phone'],
      address: form['address'],
      meterNumber: form['meterNumber'],
      type: +form['type'],
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
    type,
  }: clientProps) {
    this.firstname = firstname;
    this.middlename = middlename;
    this.lastname = lastname;
    this.dni = dni;
    this.phone = phone;
    this.address = address;
    this.meterNumber = meterNumber;
    this.type = type;
  }
}
