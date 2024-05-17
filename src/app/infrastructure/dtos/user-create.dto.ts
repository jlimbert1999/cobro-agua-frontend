interface userProps {
  fullname: string;
  login: string;
  password: string;
  roles: string[];
}
export class CreateUserDto {
  fullname: string;
  login: string;
  password: string;
  roles: string[];
  static fromForm(form: any, roles: string[]) {
    return new CreateUserDto({
      fullname: form['fullname'],
      login: form['login'],
      password: form['password'],
      roles: roles,
    });
  }
  constructor({ fullname, login, password, roles }: userProps) {
    this.fullname = fullname;
    this.login = login;
    this.password = password;
    this.roles = roles;
  }
}
