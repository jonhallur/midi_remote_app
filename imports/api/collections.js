/**
 * Created by jonh on 5.4.2016.
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const SYSEX_CONTINUOUS = 'sysex_continuous';
export const SYSEX_TOGGLE = 'sysex_toggle';
export const SYSEX_MENU = 'sysex_menu';
export const SynthPrototypes = new Mongo.Collection('synth_prototypes');
export const SynthPanels = new Mongo.Collection('synth_panels');
export const Manufacturers = new Mongo.Collection('manufacturers');
export const SysExHeaderInfo = new Mongo.Collection('sysex_headers');
export const MidiParameters = new Mongo.Collection('midi_parameter');
export const ControllerTypes = new Mongo.Collection('controller_types');
export const SysExContinuous = new Mongo.Collection('sysex_continuous');
export const SysExToggles = new Mongo.Collection('sysex_toggle');
export const SysExMenus = new Mongo.Collection('sysex_menu');

Manufacturers.schema = new SimpleSchema({
  name: {type: String},
  manufacturer_sys_ex_id: {type: [Number], min: 0, max: 255}
});

SynthPanels.schema = new SimpleSchema({
  owner_id: {type: String, regEx: SimpleSchema.RegEx.Id},
  name: {type: String},
  items: {type: [String]}
});

SynthPrototypes.schema = new SimpleSchema({
  name: {type: String},
  items: {type: [String]},
  sys_ex_header_id: {type: String, regEx: SimpleSchema.RegEx.Id}
});

SysExHeaderInfo.schema = new SimpleSchema({
  manufacturer_id: {type: String, regEx: SimpleSchema.RegEx.Id},
  type_name: {type: String},
  before_channel_chunk: {type: [Number], min: 0, max: 255},
  channel_mod: {type: Number, min: 0, max: 255},
  after_channel_chunk: {type: [Number], min: 0, max: 255}
});

ControllerTypes.schema = new SimpleSchema({
  name: {type: String},
  identifier: {type: String}
});

MidiParameters.schema = new SimpleSchema({
  controller_type: {type: String},
  parameter_id: {type: String, regEx: SimpleSchema.RegEx.Id}
});

SysExContinuous.schema = new SimpleSchema({
  owner_id: {type: String, regEx: SimpleSchema.RegEx.Id},
  name: {type: String},
  parameter_number: {type: Number, min: 0, max: 255},
  min_value: {type: Number, min: 0, max: 255},
  max_value: {type: Number, min: 0, max: 255},
  default_value: {type: Number, min: 0, max: 255},
  current_value: {type: Number, min: 0, max: 255}
});

SysExToggles.schema = new SimpleSchema({
  owner_id: {type: String, regEx: SimpleSchema.RegEx.Id},
  name: {type: String},
  parameter_number: {type: Number, min: 0, max: 255},
  true_value: {type: Number, min: 0, max: 255},
  false_value: {type: Number, min: 0, max: 255},
  default_value: {type: Boolean},
  current_value: {type: Boolean}
});

SysExMenus.schema = new SimpleSchema({
  owner_id: {type: String, regEx: SimpleSchema.RegEx.Id},
  name: {type: String},
  parameter_number: {type: Number, min: 0, max: 255},
  default_value: {type: Boolean},
  current_value: {type: Boolean},
  name_value_store: {type: [Object]}
});



if (Meteor.isServer) {
  if (Manufacturers.find({}).count() === 0) {
    console.log("manufacturers is empty");
    Manufacturers.insert({ name: "Sequential Circuits", manufacturer_sys_ex_id: [ 0x01 ] });
    Manufacturers.insert({ name: "Big Briar", manufacturer_sys_ex_id: [ 0x02 ] });
    Manufacturers.insert({ name: "Octave / Plateau", manufacturer_sys_ex_id: [ 0x03 ] });
    Manufacturers.insert({ name: "Moog", manufacturer_sys_ex_id: [ 0x04 ] });
    Manufacturers.insert({ name: "Passport Designs", manufacturer_sys_ex_id: [ 0x05 ] });
    Manufacturers.insert({ name: "Lexicon", manufacturer_sys_ex_id: [ 0x06 ] });
    Manufacturers.insert({ name: "Kurzweil", manufacturer_sys_ex_id: [ 0x07 ] });
    Manufacturers.insert({ name: "Fender", manufacturer_sys_ex_id: [ 0x08 ] });
    Manufacturers.insert({ name: "Gulbransen", manufacturer_sys_ex_id: [ 0x09 ] });
    Manufacturers.insert({ name: "Delta Labs", manufacturer_sys_ex_id: [ 0x0A ] });
    Manufacturers.insert({ name: "Sound Comp.", manufacturer_sys_ex_id: [ 0x0B ] });
    Manufacturers.insert({ name: "General Electro", manufacturer_sys_ex_id: [ 0x0C ] });
    Manufacturers.insert({ name: "Techmar", manufacturer_sys_ex_id: [ 0x0D ] });
    Manufacturers.insert({ name: "Matthews Research", manufacturer_sys_ex_id: [ 0x0E ] });
    Manufacturers.insert({ name: "Oberheim", manufacturer_sys_ex_id: [ 0x10 ] });
    Manufacturers.insert({ name: "PAIA", manufacturer_sys_ex_id: [ 0x11 ] });
    Manufacturers.insert({ name: "Simmons", manufacturer_sys_ex_id: [ 0x12 ] });
    Manufacturers.insert({ name: "DigiDesign", manufacturer_sys_ex_id: [ 0x13 ] });
    Manufacturers.insert({ name: "Fairlight", manufacturer_sys_ex_id: [ 0x14 ] });
    Manufacturers.insert({ name: "Peavey", manufacturer_sys_ex_id: [ 0x1B ] });
    Manufacturers.insert({ name: "JL Cooper", manufacturer_sys_ex_id: [ 0x15 ] });
    Manufacturers.insert({ name: "Lowery", manufacturer_sys_ex_id: [ 0x16 ] });
    Manufacturers.insert({ name: "Lin", manufacturer_sys_ex_id: [ 0x17 ] });
    Manufacturers.insert({ name: "Emu", manufacturer_sys_ex_id: [ 0x18 ] });
    Manufacturers.insert({ name: "Bon Tempi", manufacturer_sys_ex_id: [ 0x20 ] });
    Manufacturers.insert({ name: "S.I.E.L.", manufacturer_sys_ex_id: [ 0x21 ] });
    Manufacturers.insert({ name: "SyntheAxe", manufacturer_sys_ex_id: [ 0x23 ] });
    Manufacturers.insert({ name: "Hohner", manufacturer_sys_ex_id: [ 0x24 ] });
    Manufacturers.insert({ name: "Crumar", manufacturer_sys_ex_id: [ 0x25 ] });
    Manufacturers.insert({ name: "Solton", manufacturer_sys_ex_id: [ 0x26 ] });
    Manufacturers.insert({ name: "Jellinghaus Ms", manufacturer_sys_ex_id: [ 0x27 ] });
    Manufacturers.insert({ name: "CTS", manufacturer_sys_ex_id: [ 0x28 ] });
    Manufacturers.insert({ name: "PPG", manufacturer_sys_ex_id: [ 0x29 ] });
    Manufacturers.insert({ name: "Elka", manufacturer_sys_ex_id: [ 0x2F ] });
    Manufacturers.insert({ name: "Cheetah", manufacturer_sys_ex_id: [ 0x36 ] });
    Manufacturers.insert({ name: "Waldorf", manufacturer_sys_ex_id: [ 0x3E ] });
    Manufacturers.insert({ name: "Kawai", manufacturer_sys_ex_id: [ 0x40 ] });
    Manufacturers.insert({ name: "Roland", manufacturer_sys_ex_id: [ 0x41 ] });
    Manufacturers.insert({ name: "Korg", manufacturer_sys_ex_id: [ 0x42 ] });
    Manufacturers.insert({ name: "Yamaha", manufacturer_sys_ex_id: [ 0x43 ] });
    Manufacturers.insert({ name: "Casio", manufacturer_sys_ex_id: [ 0x44 ] });
    Manufacturers.insert({ name: "Akai", manufacturer_sys_ex_id: [ 0x45 ] });
  }
  if (SysExHeaderInfo.find({}).count() === 0) {
    console.log("sysex headers empty");
    let roland = Manufacturers.findOne({name: "Roland"});
    let roland_id = roland._id;
    SysExHeaderInfo.insert({
      manufacturer_id: roland_id,
      model: "Alpha Juno 2",
      before_channel_chunk: [54],
      channel_mod: 0,
      after_channel_chunk: [35,32,1]
    });
    let yamaha = Manufacturers.findOne({name: "Yamaha"});
    let yamaha_id = yamaha._id;
    SysExHeaderInfo.insert({
      manufacturer_id: yamaha_id,
      model: "DX21",
      before_channel_chunk: [],
      channel_mod: 16,
      after_channel_chunk: [18]
    });
  }
  if (ControllerTypes.find({}).count()===0) {
    ControllerTypes.insert({identifier: SYSEX_CONTINUOUS, name: 'SysEx Continuous'});
    ControllerTypes.insert({identifier: SYSEX_TOGGLE, name: 'SysEx Toggle'});
    ControllerTypes.insert({identifier: SYSEX_MENU, name: 'SysEx Menu'});
  }
}
/*
 import * as SysEx from '../imports/lib/midi_parameter.js'


Juno2SysEx = new SysEx.SysExHeader(
  0b01000001,
  [0b00110101],
  [0b00100011, 0b00100000, 0b00000001]
);

DX21SysEx = new SysEx.SysExHeader(
  0b01000011,
  [],
  [0b00010010]
);

Juno2VCFCutoff = new SysEx.SysExParameter("VCF Cutoff", 0, 127, 100, Juno2SysEx, 16);
DX21Feedback = new SysEx.SysExParameter("Feedback Level", 0, 7, 0, DX21SysEx, 53);
console.log();
console.log(Juno2VCFCutoff.create_message(1, 69));
console.log(DX21Feedback.create_message(2, 7));
*/