export class Project {
  _environments;
  _name;

  constructor(name, environments = []) {
    this._name = name;
    this._environments = environments;
  }

  get name() {
    return this._name;
  }

  get environments() {
    return this._environments;
  }
}
