/**
 * Created by jonh on 16.4.2016.
 */
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Alerts } from 'meteor/mrt:bootstrap-alerts';

import './create_sysex_continuous.html';

import { SysExContinuous, SynthPanels, MidiParameters, SYSEX_CONTINUOUS} from './../../../api/collections.js';

Template.create_sysex_continuous.events({
  'click #create_new_sysex_continuous_btn'(event) {
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
    var sysex_continuous_name = $('#sysex_continuous_name');
    var sysex_continuous_parameter_num = $('#sysex_continuous_parameter_number');
    var sysex_continuous_min_value = $('#sysex_continuous_min_value');
    var sysex_continuous_max_value = $('#sysex_continuous_max_value');
    var sysex_continuous_default_value = $('#sysex_continuous_default_value');
    let name = sysex_continuous_name.val();
    let parameter_num = sysex_continuous_parameter_num.val();
    let min_value = sysex_continuous_min_value.val();
    let max_value = sysex_continuous_max_value.val();
    let default_value = sysex_continuous_default_value.val();
    if (name === '' || parameter_num === '' || min_value === '' || max_value === '' || default_value === '') {
      Alerts.add('Some info in form missing');
      return null;
    }
    let new_control = {
      owner_id: panel_id,
      name: name,
      parameter_number: Number(parameter_num),
      min_value: Number(min_value),
      max_value: Number(max_value),
      default_value: Number(default_value),
      current_value: Number(default_value)
    };
    let continuous_id = SysExContinuous.insert(new_control);
    let midi_parameter_id = MidiParameters.insert({
      controller_type: SYSEX_CONTINUOUS,
      parameter_id: continuous_id
    });
    panel.items.push(midi_parameter_id);
    SynthPanels.update({_id: panel_id}, panel);
    sysex_continuous_name.val('');
    sysex_continuous_parameter_num.val('');
    sysex_continuous_min_value.val('');
    sysex_continuous_max_value.val('');
    sysex_continuous_default_value.val('');
    Alerts.add('Parameter successfully added', 'info')
  }
});