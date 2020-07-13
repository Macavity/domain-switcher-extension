export class Project {
  /**
   * @var string|null
   */
  _id;

  /**
   * @var string
   */
  _name;

  /**
   * @var Environment[]
   */
  _environments;

  constructor(id, name, environments = []) {
    this._id = id;
    this._name = name;
    this._environments = environments;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get environments() {
    return this._environments;
  }
}
