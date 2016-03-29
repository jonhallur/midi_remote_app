/**
 * Created by jonh on 28.3.2016.
 */
class UserException {
  constructor(type, value) {
    "use strict";
    this.type = type;
    this.value = value;
  }
  toString() {
    "use strict";
    return "Error:\n\tType:\t" + this.type + "\n\tValue:\t" + this.value;
  }
}

class MidiParameter {
  constructor (name, min_value, max_value, default_value) {
    "use strict";
    this.name = name;
    this.min_value = min_value;
    this.max_value = max_value;
    this.default_value = default_value
  }
}
class SysExHeader {
  constructor (id, before, after) {
    "use strict";
    this.id = id;
    if ( !(before instanceof Array) || !(after instanceof Array)) {
      throw new UserException("Constructor error", "before or after sysex is not a list")
    }
    this.before = before;
    this.after = after;
  }
  create_header(channel) {
    "use strict";
    let status = 0b11110000;
    let item = null;
    let message = [status];
    message.push(this.id);
    for (item of this.before) {
      message.push(item)
    }
    message.push(channel);
    for (item of this.after) {
      message.push(item)
    }
    return message;
  }
}

class SysExParameter extends MidiParameter {
  constructor (name, min_value, max_value, default_value, sysex, parameter_num) {
    "use strict";
    super(name, min_value, max_value, default_value);
    if (! (sysex instanceof SysExHeader))
    {
      throw new UserException("Constructor error", "sysex is not of type SysExHeader");
    }
    this.sysex = sysex;
    this.parameter_num = parameter_num;
  }
  create_message(channel, value) {
    "use strict";
    if ((channel < 1) || (channel > 16)) {
      throw new UserException("Number out of range", "channel is out of range");
    }
    if ((value < this.min_value) || (value > this.max_value)) {
      throw new UserException("Number out of range", "input value out of parameter range");
    }
    let eox = 0b11110111;
    let message = this.sysex.create_header(channel);
    message.push(this.parameter_num);
    message.push(value);
    message.push(eox);
    return message;
  }
}

Juno2SysEx = new SysExHeader(
  0b01000001,
  [0b00110101],
  [0b00100011, 0b00100000, 0b00000001]
);

DX21SysEx = new SysExHeader(
  0b01000011,
  [],
  [0b00010010]
);

Juno2VCFCutoff = new SysExParameter("VCF Cutoff", 0, 127, 100, Juno2SysEx, 16);
DX21Feedback = new SysExParameter("Feedback Level", 0, 7, 0, DX21SysEx, 53);
console.log();
console.log(Juno2VCFCutoff.create_message(1, 69));
console.log(DX21Feedback.create_message(2, 7));