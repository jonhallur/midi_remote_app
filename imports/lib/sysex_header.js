/**
 * Created by jonh on 5.4.2016.
 */
import {throw_if_out_of_range, throw_if_not_array } from './helpers.js'



class SysExHeader {
  constructor (manufacturer_id, before_channel, after_channel, channel_mod=0) {
    "use strict";
    let item = null;
    throw_if_out_of_range(manufacturer_id);
    this.manufacturer_id = manufacturer_id;

    throw_if_not_array(before_channel, "before_channel_chunk");
    throw_if_not_array(after_channel, "after_channel_chunk");
    for (item of before_channel) {
      throw_if_out_of_range(item);
    }
    for (item of after_channel) {
      throw_if_out_of_range(item);
    }
    this.before_channel_chunk = before_channel;
    this.after_channel_chunk = after_channel;
    this.channel_mod = channel_mod;
  }
  create_header(hex_channel) {
    "use strict";
    let status = 0b11110000;
    let item = null;
    let message = [status];
    message.push(this.manufacturer_id);
    for (item of this.before_channel_chunk) {
      message.push(item)
    }
    message.push(hex_channel+this.channel_mod);
    for (item of this.after_channel_chunk) {
      message.push(item)
    }
    return message;
  }
}

export {SysExHeader as SysExHeader};