/**
 * Created by jonh on 5.4.2016.
 */

import { Mongo } from 'meteor/mongo'

export const Synths = new Mongo.Collection('synths');
export const Manufactures = new Mongo.Collection('manufacturers');

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