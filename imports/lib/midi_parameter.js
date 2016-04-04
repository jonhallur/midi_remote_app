/**
 * Created by jonh on 28.3.2016.
 */
import UserException from './Exceptions.js'

function throw_if_not_instance_of(parameter, instance_type) {
  if (!(parameter instanceof instance_type)) {
    throw TypeError("Parameter not of type " + instance_type);
  }
}

function throw_if_outside_range(value, minValue, maxValue) {
  if ((value < minValue) || (value > maxValue)) {
    throw new RangeError("Value out of range");
  }
}

function is_not_eight_bit_number(item) {
  return (item < 0 ) || (item > 255);
}

function throw_if_out_of_range(item) {
  if (is_not_eight_bit_number(item)) {
    throw new RangeError("SysEx message out of range");
  }
}

function throw_if_invalid_midi_channel(channel) {
  if ((channel < 1) || (channel > 16)) {
    throw new RangeError("Midi Channel out of range", channel);
  }
}

class ControlsCollection {
  constructor (name, collection_type) {
    "use strict";
    this.name = name;
    this.type = collection_type;
    this.items = [];
  }

  push(item) {
    "use strict";
    throw_if_not_instance_of(item, this.type);
    this.items.push(item)
  }

  remove(item) {
    "use strict";
    throw_if_not_instance_of(item, this.type);
    let index = this.items.indexOf(item);
    if (index === -1) {
      return null;
    }
    return this.items.splice(index, 1);
  }
  swap(item1, item2) {
    "use strict";
    throw_if_not_instance_of(item1, this.type);
    throw_if_not_instance_of(item2, this.type);
    let index1 = this.items.indexOf(item1);
    let index2 = this.items.indexOf(item2);
    if ((index1 === -1 ) || (index2 === -1)) {
      return null;
    }
    let temp = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = temp;
  }

  length() {
    "use strict";
    return this.items.length;
  }

  get_item_by_index(index) {
    "use strict";
    if ((index < 0) || (index > this.length())) {
      throw RangeError("parameter index out of range");
    }
    return this.items[index];
  }
}

class MidiPanelLayout extends ControlsCollection {
  constructor(name) {
    "use strict";
    super(name, MidiParameter)
  }
}

class MidiRemoteLayout extends ControlsCollection {
  constructor(name, sys_ex_header) {
    "use strict";
    super(name, MidiPanelLayout);
    throw_if_not_instance_of(sys_ex_header, SysExHeader);
    this.sys_ex_header = sys_ex_header
  }
}


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



class SysExHeader {
  constructor (manufacturer_id, before_channel, after_channel) {
    "use strict";
    let item = null;
    throw_if_out_of_range(manufacturer_id);
    this.manufacturer_id = manufacturer_id;
    if ( !(before_channel instanceof Array )) {
      throw new TypeError("before_channel_chunk is not Array");
    }
    if (!(after_channel instanceof  Array)) {
      throw new TypeError("after_channel_chunk is not Array");
    }
    for (item of before_channel) {
      throw_if_out_of_range(item);
    }
    for (item of after_channel) {
      throw_if_out_of_range(item);
    }
    this.before_channel_chunk = before_channel;
    this.after_channel_chunk = after_channel;
  }
  create_header(channel) {
    "use strict";
    let status = 0b11110000;
    let item = null;
    let message = [status];
    message.push(this.manufacturer_id);
    for (item of this.before_channel_chunk) {
      message.push(item)
    }
    message.push(channel);
    for (item of this.after_channel_chunk) {
      message.push(item)
    }
    return message;
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
export {SysExHeader as SysExHeader};
export {ControlsCollection as ControlsCollection};
export {MidiPanelLayout as MidiPanelLayout};
export {MidiRemoteLayout as MidiRemoteLayout};

