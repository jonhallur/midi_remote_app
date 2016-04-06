export function throw_if_not_instance_of(parameter, instance_type) {
  if (!(parameter instanceof instance_type)) {
    throw TypeError("Parameter not of type " + instance_type);
  }
}

export function throw_if_outside_range(value, minValue, maxValue) {
  if ((value < minValue) || (value > maxValue)) {
    throw new RangeError("Value out of range");
  }
}

export function is_not_eight_bit_number(item) {
  return (item < 0 ) || (item > 255);
}

export function throw_if_out_of_range(item) {
  if (is_not_eight_bit_number(item)) {
    throw new RangeError("SysEx message out of range");
  }
}

export function throw_if_invalid_midi_channel(channel) {
  if ((channel < 1) || (channel > 16)) {
    throw new RangeError("Midi Channel out of range", channel);
  }
}

export function throw_if_not_array(before_channel, parameter_name) {
  if (!(before_channel instanceof Array )) {
    throw new TypeError(parameter_name + " is not Array");
  }
}