/**
 * Created by jonh on 28.3.2016.
 */
import {SysExHeader} from './sysex_header.js'
import {
  throw_if_not_instance_of,
  throw_if_invalid_midi_channel,
  throw_if_outside_range
} from './helpers.js'


class MidiParameter {
  constructor (name, min_value, max_value, default_value) {
    "use strict";
    this.name = name;
    this.min_value = min_value;
    this.max_value = max_value;
    this.default_value = default_value;
    this.current_value = this.default_value;
  }

  reset_to_default_value() {
    "use strict";
    this.current_value = this.default_value;
  }
}




 class SysExParameter extends MidiParameter {
  constructor (name, min_value, max_value, default_value, sys_ex, parameter_num) {
    "use strict";
    super(name, min_value, max_value, default_value);
    throw_if_not_instance_of(sys_ex, SysExHeader);
    this.sysex = sys_ex;
    this.parameter_num = parameter_num;
    this.midi_channel = 0;
  }

  create_message(channel, value) {
    "use strict";
    this.set_value(value);
    this.set_midi_channel(channel);
    return this._assemble_payload();
  }

  _assemble_payload() {
    "use strict";
    let eox = 0b11110111;
    let message = this.sysex.create_header(this.midi_channel);
    message.push(this.parameter_num);
    message.push(this.current_value);
    message.push(eox);
    return message;
  }

  set_value(value) {
    "use strict";
    throw_if_outside_range(value, this.min_value, this.max_value);
    this.current_value = value;
  }

  set_midi_channel(midi_channel) {
    "use strict";
    throw_if_invalid_midi_channel(midi_channel);
    this.midi_channel = midi_channel - 1;
  }
}

export {MidiParameter as MidiParameter};
export {SysExParameter as SysExParameter};