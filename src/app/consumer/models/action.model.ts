interface ActionsProps {
  _id: string;
  address: string;
  cost: number;
  code: string;

}
export class Action {
  _id: string;
  address: string;
  cost: number;
  code: string;

  constructor({ _id, address, cost, code }: ActionsProps) {
    this._id = _id;
    this.address = address;
    this.cost = cost;
    this.code = code;
  }
}
