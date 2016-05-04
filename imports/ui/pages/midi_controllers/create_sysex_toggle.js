/**
 * Created by jonh on 16.4.2016.
 */
import './create_sysex_toggle.html'

import { SysExToggles, SynthPanels, MidiParameters, SYSEX_TOGGLE} from './../../../api/collections.js';

Template.create_sysex_toggle.events({
  'click #create_new_sysex_toggle_btn'(event) {
    "use strict";
    event.preventDefault();
    let panel_id = FlowRouter.getParam('panel_id');
    if (panel_id === undefined) {
      Alerts.add("Could not find panel id");
      return null;  //return early if no id
    }
    let panel = SynthPanels.findOne({_id: panel_id});
    if (panel === undefined) {
      Alerts.add("Could not find panel from id");
      return null;  //return early if no panel is found. should
    }
    var sysex_toggle_name = $('#sysex_toggle_name');
    var sysex_toggle_parameter_num = $('#sysex_toggle_parameter_number');
    var sysex_toggle_true_value = $('#sysex_toggle_true_value');
    var sysex_toggle_false_value = $('#sysex_toggle_false_value');
    var sysex_toggle_default_value = $('#sysex_toggle_default_value');
    let name = sysex_toggle_name.val();
    let parameter_num = sysex_toggle_parameter_num.val();
    let true_value = sysex_toggle_true_value.val();
    let false_value = sysex_toggle_false_value.val();
    let default_value = sysex_toggle_default_value.is(":checked");
    if (name === '' || parameter_num === '' || true_value === '' || false_value === '') {
      Alerts.add('Some info in form missing');
      return null;
    }
    let new_control = {
      owner_id: panel_id,
      name: name,
      parameter_number: Number(parameter_num),
      true_value: Number(true_value),
      false_value: Number(false_value),
      default_value: Number(default_value),
      current_value: Number(default_value)
    };
    let toggle_id = SysExToggles.insert(new_control);
    let midi_parameter_id = MidiParameters.insert({
      controller_type: SYSEX_TOGGLE,
      parameter_id: toggle_id
    });
    panel.items.push(midi_parameter_id);
    SynthPanels.update({_id: panel_id}, panel);
    sysex_toggle_name.val('');
    sysex_toggle_parameter_num.val('');
    sysex_toggle_true_value.val('');
    sysex_toggle_false_value.val('');
    sysex_toggle_default_value.prop('checked', false);
    Alerts.add('Parameter successfully added', 'info')
  }
});