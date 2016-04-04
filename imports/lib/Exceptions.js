/**
 * Created by jonh on 28.3.2016.
 */
export default class UserException extends Error {
  constructor(type, value) {
    "use strict";
    super(value, type);
    this.type = type;
    this.value = value;
  }
  toString() {
    "use strict";
    return "Error:\n\tType:\t" + this.type + "\n\tValue:\t" + this.value;
  }
}
