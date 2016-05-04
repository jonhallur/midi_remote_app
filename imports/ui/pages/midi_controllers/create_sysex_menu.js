/**
 * Created by jonh on 17.4.2016.
 */
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Alerts } from 'meteor/mrt:bootstrap-alerts';
import './create_sysex_menu.html'

import { SysExMenus, SYSEX_MENU, SynthPanels, MidiParameters, } from './../../../api/collections.js';

Template.create_sysex_menu.events({
  'click #create_new_sysex_menu_btn'(event) {
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
    var name_node = $('#sysex_menu_name');
    var param_num_node = $('#sysex_menu_parameter_number');
    var default_val_node = $('#sysex_menu_default_value');
    var item_names_node = $('#sysex_menu_menu_item_names');
    var item_values_node = $('#sysex_menu_menu_item_values');
    let name = name_node.val();
    let parameter_num = param_num_node.val();
    let default_value = default_val_node.val();
    let item_names = item_names_node.val();
    let item_values = item_values_node.val();
    if (name === '' || parameter_num === '' || item_names === '' || item_values === '' || default_value === '') {
      Alerts.add('Some info in form missing');
      return null;
    }
    item_names = item_names.split(',');
    item_values = item_values.split(',');
    console.log(item_names, item_values);
    let name_value_store = [];
    if(item_names.length === item_values.length) {
      for(var i = 0; i < item_names.length; i++) {
        let selected = "";
        if (item_values[i] == default_value) {
          selected = 'selected';
        }
        name_value_store.push({value: item_values[i], name: item_names[i], selected: selected});
      }
      console.log(name_value_store);
    }
    else {
      Alerts.add('Values and Names are not the same length', 'error');
      return;
    }
    let new_control = {
      owner_id: panel_id,
      name: name,
      parameter_number: Number(parameter_num),
      default_value: Number(default_value),
      current_value: Number(default_value),
      name_value_store: name_value_store
    };
    let menu_id = SysExMenus.insert(new_control);
    let midi_parameter_id = MidiParameters.insert({
      controller_type: SYSEX_MENU,
      parameter_id: menu_id
    });
    panel.items.push(midi_parameter_id);
    SynthPanels.update({_id: panel_id}, panel);
    name_node.val('');
    param_num_node.val('');
    item_names_node.val('');
    item_values_node.val('');
    default_val_node.val('');
    Alerts.add('Parameter successfully added', 'info')
  }
});