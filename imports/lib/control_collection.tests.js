/**
 * Created by jonh on 5.4.2016.
 */
import { ControlsCollection } from './control_collection.js'
import { SysExParameter } from './midi_parameter.js'
import { SysExHeader } from './sysex_header.js'

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