/**
 * Created by jonh on 29.3.2016.
 */

import { SysExParameter } from './midi_parameter.js'
import { SysExHeader } from './sysex_header.js'


describe('MidiParameter', () => {
  it('Can make instance of SysExParameter', () => {
    let header = new SysExHeader(127, [1], [2]);
    let sys = new SysExParameter('name', 0, 127, 64, header, 9);
    assert.instanceOf(sys, SysExParameter);
  });

  it('Throws TypeError SysExHeader parameter', () => {
    assert.throws(() => {
      "use strict";
      new SysExParameter('name', 0,127,64,0,9)
    }, TypeError);
  });

  it('Throws RangeError on a negative midi channel', () => {
    "use strict";
    let parameter = new SysExParameter('name', 0, 127, 64, new SysExHeader(1, [2], [3]), 69);
    assert.throws( () => {
      parameter.set_midi_channel(-1);
    }, RangeError);
  });

  it('Throws RangeError on a midi channel above 16', () => {
    "use strict";
    let parameter = new SysExParameter('name', 0, 127, 64, new SysExHeader(1, [2], [3]), 69);
    assert.throws( () => {
      parameter.set_midi_channel(17);
    }, RangeError);
  });

  it('Throws RangeError on Value lower then min_value', () => {
    "use strict";
    let parameter = new SysExParameter('name', 1, 10, 64, new SysExHeader(1, [2], [3]), 69);
    assert.throws( () => {
      parameter.set_value(0);
    }, RangeError);
  });

  it('Throws RangeError on value higher then max_value', () => {
    "use strict";
    let parameter = new SysExParameter('name', 1, 10, 64, new SysExHeader(1, [2], [3]), 69);
    assert.throws( () => {
      parameter.set_value(11);
    }, RangeError);
  });

  it('Spits out an expected, valid sysex header', () => {
    "use strict";
    let channel = 1;
    let par_value = 42;
    let par_num = 48;
    let parameter = new SysExParameter(
      'name',
      1,
      127,
      64,
      new SysExHeader(
        0b01000001,
        [0b00110101],
        [0b00100011, 0b00100000, 0b00000001]),
      par_num);
    let expected = [
      0b11110000,
      0b01000001,
      0b00110101,
      0b00000000,
      0b00100011,
      0b00100000,
      0b00000001,
      par_num,
      par_value,
      0b11110111];
    var actual = parameter.create_message(channel, par_value);
    assert.strictEqual(actual.length, expected.length);
    for (var i=0; i < expected.length; i++) {
      assert.strictEqual(expected[i], actual[i]);
    }
  });
});

