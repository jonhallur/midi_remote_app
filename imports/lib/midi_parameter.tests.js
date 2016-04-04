/**
 * Created by jonh on 29.3.2016.
 */

import { SysExParameter, SysExHeader, ControlsCollection } from './midi_parameter.js'


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
  })
});

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

describe('Controls Collection', () => {
  "use strict";
  it('Throws error on wrong input', () => {
    let collection = new ControlsCollection("Name", SysExParameter);
    assert.throws(() => {
      collection.push(null)
    }, TypeError);
  });

  it('Can add MidiParameter to a collection', () => {
    let parameter = new SysExParameter("name", 0, 127, 64, new SysExHeader(127, [], []), 42);
    let collection = new ControlsCollection('collection', SysExParameter);
    var initial_length = 0;
    assert.strictEqual(initial_length, collection.length());
    collection.push(parameter);
    let expected_length = 1;
    assert.strictEqual(expected_length, collection.length());
    assert.deepEqual(collection.items[0], parameter);
  });

  it("Can remove parameter from a collection", () => {
    let parameter = new SysExParameter("name", 0, 127, 64, new SysExHeader(127, [], []), 42);
    let collection = new ControlsCollection('collection', SysExParameter);
    var expected_length = 0;
    collection.push(parameter);
    let removed_param = collection.remove(parameter);
    assert.strictEqual(expected_length, collection.length());
    assert.deepEqual(parameter, removed_param[0]);
  });

  it("Can remove from middle of a collection", () => {
    let expected_length = 2;
    let parameter1 = new SysExParameter("name", 0, 127, 64, new SysExHeader(127, [], []), 42);
    let parameter2 = new SysExParameter("name", 0, 127, 64, new SysExHeader(127, [], []), 43);
    let parameter3 = new SysExParameter("name", 0, 127, 64, new SysExHeader(127, [], []), 44);

    let collection = new ControlsCollection('collection', SysExParameter);
    collection.push(parameter1);
    collection.push(parameter2);
    collection.push(parameter3);
    let removed = collection.remove(parameter2);

    assert.strictEqual(expected_length, collection.length());
    assert.deepEqual(parameter2, removed[0]);
  });

  it('Can swap location of only 2 items', () => {
    let parameter1 = new SysExParameter("name", 0, 127, 64, new SysExHeader(127, [], []), 42);
    let parameter2 = new SysExParameter("name", 0, 127, 64, new SysExHeader(127, [], []), 43);
    let parameter3 = new SysExParameter("name", 0, 127, 64, new SysExHeader(127, [], []), 44);

    let collection = new ControlsCollection('collection', SysExParameter);
    collection.push(parameter1);
    collection.push(parameter2);
    collection.push(parameter3);
    collection.swap(parameter1, parameter3);
    assert.deepEqual(collection.items[0], parameter3);
    assert.deepEqual(collection.items[2], parameter1);
  })
});