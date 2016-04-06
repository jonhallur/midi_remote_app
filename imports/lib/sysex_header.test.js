/**
 * Created by jonh on 5.4.2016.
 */
import { SysExHeader } from './sysex_header.js'
import { chai, assert } from 'meteor/practicalmeteor:chai'

describe('SysExHeader', () => {
  "use strict";
  it('Will throw TypeError in _before_ SysEx parameter', () => {
    "use strict";
    //let header = new SysExHeader(1,2,3);
    assert.throws(function () {
      new SysExHeader(127,1,[2])
    }, TypeError);
  });

  it('Will throw TypeError in _after_ SysEx parameter', () => {
    "use strict";
    assert.throws(() => {
      new SysExHeader(127,[1], 1)
    }, TypeError);
  });

  it('Will throw RangeError if manufacturer ID if not unsigned 8 bit', () => {
    assert.throws(() => {
      new SysExHeader(256, [1,2,3], [4,5,6]);
    }, RangeError);
  });

  it('Will throw RangeError if item in _before_ is not unsigned 8 bit', () => {
    assert.throws( () => {
      new SysExHeader(127, [1,2,-3], [4,5,6]);
    }, RangeError);
  });

  it('Will create a valid header using channel mod', () => {
    let dx21 = new SysExHeader(
      0b01000011,
      [],
      [0b00010010],
      0b00010000
    );
    let midi_channel = 0;
    let expected = [
      0b11110000,
      0b01000011,
      0b00010000 + midi_channel,
      0b00010010
    ];
    let actual = dx21.create_header(midi_channel);
    for(var i=0; i < expected.length; i++) {
      assert.strictEqual(expected[i], actual[i]);
    }
  });

  it('Will create a valid header using no channel mod', () => {
    let junoalpha = new SysExHeader(
      0b01000001,
      [0b00110110],
      [
        0b00100011,
        0b00100000,
        0b00000001
      ]
    );
    let midi_channel = 0;
    let expected = [
      0b11110000,
      0b01000001,
      0b00110110,
      0b00000000,
      0b00100011,
      0b00100000,
      0b00000001
    ];
    let actual = junoalpha.create_header(midi_channel);
    for(var i=0; i < expected.length; i++) {
      assert.strictEqual(expected[i], actual[i]);
    }
  })
});