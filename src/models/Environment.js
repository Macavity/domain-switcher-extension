export class Environment {
  /**
   * @var string
   */
  _id;

  /**
   * @var string
   */
  _projectId;

  /**
   * @var string|null
   */
  _label = '';

  /**
   * @var string|null
   */
  _pattern;

  constructor(id, projectId, pattern = '', label = '') {
    this._id = id;
    this._projectId = projectId;
    this._pattern = pattern;
    this._label = label;
  }

  get id() {
    return this._id;
  }

  get label() {
    return this._label;
  }

  get projectId() {
    return this._projectId;
  }

  get pattern() {
    return this._pattern;
  }
}
