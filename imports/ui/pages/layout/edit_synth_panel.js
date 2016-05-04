/**
 * Created by jonh on 17.4.2016.
 */

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Alerts } from 'meteor/mrt:bootstrap-alerts'
import './edit_synth_panel.html';
import {
  ControllerTypes,
  SynthPanels,
  SynthPrototypes,
  MidiParameters,
  SysExContinuous,
  SysExMenus,
  SysExToggles,
  SYSEX_CONTINUOUS,
  SYSEX_MENU,
  SYSEX_TOGGLE
} from './../../../api/collections.js'
import {swap_by_index} from './layout_helpers.js'
Session.setDefault('selected_controller_type', 'create_sysex_continuous');

Template.edit_synth_panel.helpers({
  controllerTypes() {
    "use strict";
    return ControllerTypes.find({});
  },
  selectedControllerType() {
    "use strict";
    return Session.get('selected_controller_type');
  },
  panel_items() {
    "use strict";
    let panel_id = FlowRouter.getParam('panel_id');
    let panel = SynthPanels.findOne({_id: panel_id});
    if ((panel !== undefined) && (panel.hasOwnProperty('items'))) {
      return panel.items;
    }
    else {
      return [];
    }
  },
  panel_name() {
    "use strict";
    let panel_id = FlowRouter.getParam('panel_id');
    let panel = SynthPanels.findOne({_id: panel_id});
    if ((panel !== undefined) && (panel.hasOwnProperty('name'))) {
      return panel.name;
    }
    else {
      return 'panel not found';
    }
  },
  proto() {
    "use strict";
    let proto_id = FlowRouter.getParam('proto_id');
    return SynthPrototypes.findOne({_id: proto_id});
  }
});

Template.edit_synth_panel.events({
  'change #controller_type_selector'(event) {
    "use strict";
    event.preventDefault();
    let value = event.target.value;
    if(value !== undefined || value !== "") {
      var settings_string = "create_" + value;
      Session.set('selected_controller_type', settings_string);
    }
  }
});

Template.panel_item.helpers({
  actual_item() {
    "use strict";
    let midi_parameter_id = this;
    if (midi_parameter_id === undefined) {
      return null;
    }
    let midi_parameter = MidiParameters.findOne({_id: midi_parameter_id});
    if (midi_parameter === undefined) {
      return null;
    }
    var target_item = {_id: midi_parameter.parameter_id};
    if(midi_parameter.controller_type === SYSEX_CONTINUOUS) {
      return SysExContinuous.findOne(target_item);
    }
    else if (midi_parameter.controller_type === SYSEX_MENU) {
      return SysExMenus.findOne(target_item);
    }
    else if (midi_parameter.controller_type === SYSEX_TOGGLE) {
      return SysExToggles.findOne(target_item);
    }

  }
});

Template.panel_item.events({
  'click .edit_parameter'(event) {
    "use strict";
    event.preventDefault();
    let param_id = event.target.parentNode.parentNode.id;
    let panel_id = FlowRouter.getParam('panel_id');
    let proto_id = FlowRouter.getParam('proto_id');
    let url_list = [
      '/edit/proto', proto_id, 'panel', panel_id, 'parameter', param_id
    ];
    FlowRouter.go(url_list.join('/'));
  },
  'click .delete_parameter'(event) {
    "use strict";
    event.preventDefault();

    let parameter_id = event.target.parentNode.parentNode.id;
    let panel_id = FlowRouter.getParam('panel_id');
    let synth_panel = SynthPanels.findOne({_id: panel_id});
    let item_index = synth_panel.items.indexOf(parameter_id);
    if (item_index === -1) {
      Alert.add('Item to delete not found');
      return null;
    }
    synth_panel.items.splice(item_index, 1);
    SynthPanels.update({_id: panel_id}, synth_panel);
    let actual_parameter = MidiParameters.findOne({_id: parameter_id});
    let parameter_type = actual_parameter.controller_type;
    MidiParameters.remove({_id: parameter_id});
    var object_to_removed = {_id: actual_parameter.parameter_id};
    if (parameter_type === SYSEX_CONTINUOUS) {
      SysExContinuous.remove(object_to_removed);
    }
    else if (parameter_type === SYSEX_MENU) {
      SysExMenus.remove(object_to_removed);
    }
    else if (parameter_type === SYSEX_TOGGLE) {
      SysExToggles.remove(object_to_removed);
    }
    else {
      Alerts.add("Could not remove parameter, type not found");
      return null;
    }
    Alerts.add('Parameter successfully removed', 'info');
  },
  'click .move_parameter_up'(event) {
    "use strict";
    event.preventDefault();
    let parameter_id = event.target.parentNode.parentNode.id;
    let panel_id = FlowRouter.getParam('panel_id');
    let synth_panel = SynthPanels.findOne({_id: panel_id});
    var index_modifier = -1;
    var cannot_move = 0;
    var item_index = synth_panel.items.indexOf(parameter_id);
    if (item_index === -1 || item_index === cannot_move) {
      return null;  //not found or already at top
    }
    let new_index = item_index + index_modifier;
    swap_by_index(synth_panel, new_index, item_index);
    SynthPanels.update({_id: panel_id}, synth_panel);
  },
  'click .move_parameter_down'(event) {
    "use strict";
    event.preventDefault();
    let parameter_id = event.target.parentNode.parentNode.id;
    let panel_id = FlowRouter.getParam('panel_id');
    let synth_panel = SynthPanels.findOne({_id: panel_id});
    var index_modifier = 1;
    var cannot_move = synth_panel.items.length - 1;
    var item_index = synth_panel.items.indexOf(parameter_id);
    if (item_index === -1 || item_index === cannot_move) {
      return null;  //not found or already at top
    }
    let new_index = item_index + index_modifier;
    swap_by_index(synth_panel, new_index, item_index);
    SynthPanels.update({_id: panel_id}, synth_panel);

  }
});