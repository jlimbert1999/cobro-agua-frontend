export class CreateReadingDto {
  static fromForm(form: any) {
    return new CreateReadingDto(
      form['client'],
      form['consume'],
      form['consumptionDate']
    );
  }
  constructor(
    public client: string,
    public consume: number,
    public consumptionDate: string
  ) {}
}
