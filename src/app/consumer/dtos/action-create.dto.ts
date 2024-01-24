export class CreateActionDto {
  static fromFormGroup(form: any) {
    return new CreateActionDto(
      form['address'],
      parseInt(form['cost']),
      form['code']
    );
  }
  constructor(
    public address: string,
    public cost: number,
    public code: string
  ) {}
}
