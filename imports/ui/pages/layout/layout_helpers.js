/**
 * Created by jonh on 18.4.2016.
 */
import {
  MidiParameters,
  SysExContinuous,
  SYSEX_CONTINUOUS,
  SysExMenus,
  SYSEX_MENU,
  SysExToggles,
  SYSEX_TOGGLE
} from './../../../api/collections.js'

export function find_index_by_id(synth, id) {
  var item_index = -1;
  for (var i = 0; i < synth.items.length; i++) {
    if (synth.items[i]._id === id) {
      item_index = i;
      break;
    }
  }
  return item_index;
}

export function swap_by_index(synth, new_index, item_index) {
  let temp = synth.items[new_index];
  synth.items[new_index] = synth.items[item_index];
  synth.items[item_index] = temp;
}


export function remove_all_from_panel(panel) {
  for (var midi_param_id of panel.items) {
    var midi_param = MidiParameters.findOne({_id: midi_param_id});
    if (midi_param.controller_type === SYSEX_CONTINUOUS) {
      SysExContinuous.remove({_id: midi_param.parameter_id});
    }
    else if (midi_param.controller_type === SYSEX_MENU) {
      SysExMenus.remove({_id: midi_param.parameter_id})
    }
    else if (midi_param.controller_type === SYSEX_TOGGLE) {
      SysExToggles.remove({_id: midi_param.parameter_id})
    }
    MidiParameters.remove({_id: midi_param_id});
  }
}