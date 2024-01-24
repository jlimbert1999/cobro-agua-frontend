export class CreateReadingDto {
  static fromForm(id_action: string, form: any) {
    return new CreateReadingDto(
      id_action,
      form['consume'],
      form['consumptionDate']
    );
  }
  constructor(
    public action: string,
    public consume: number,
    public consumptionDate: Date
  ) {}
}
