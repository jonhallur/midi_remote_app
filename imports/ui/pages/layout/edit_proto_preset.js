/**
 * Created by jonh on 28.4.2016.
 */
import './edit_proto_preset.html';
import './edit_proto_preset.css';
import './midi_setup.js'
import { send_midi } from './midi_setup.js'
import { jquery } from 'meteor/jquery';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {
  SynthPrototypes,
  SynthPanels,
  MidiParameters,
  SYSEX_CONTINUOUS,
  SYSEX_MENU,
  SYSEX_TOGGLE,
  SysExContinuous,
  SysExMenus,
  SysExToggles,
  SysExHeaderInfo,
  Manufacturers} from './../../../api/collections.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

Session.setDefault("midi_channel", 0);

Template.edit_proto_preset.helpers({
  synth() {
    "use strict";
    let proto_id = FlowRouter.getParam('id');
    var synth = SynthPrototypes.findOne({_id: proto_id});
    Session.set("current_prototype_id", proto_id);
    Session.set("current_sysex_header_id", synth.sys_ex_header_id);
    return synth;
  },
  view_panels() {
    "use strict";
    let proto_id = FlowRouter.getParam('id');
    let synth = SynthPrototypes.findOne({_id: proto_id});
    if ((synth != undefined) && (synth.hasOwnProperty('items'))) {
      let items = synth.items;
      return items.map((x) => {return SynthPanels.findOne({_id: x})});
    }
    else
    {
      return [];
    }
  }
});

Template.view_panel.helpers({
  view_controls() {
    "use strict";
    if (this._id === undefined) {
      return [];
    }
    let panel = SynthPanels.findOne({_id: this._id});
    if ((panel != undefined) && panel.hasOwnProperty('items')) {
      let items = panel.items;
      if (items === []) {
        return [];
      }
      let midi_controls = items.map((item_id) => {return MidiParameters.findOne({_id: item_id})});
      if (midi_controls == undefined) {
        return [];
      }
      let actual_controls = [];
      for(var control_index in midi_controls) {
        let control = midi_controls[control_index];
        if (control === undefined) {
          return [];
        }
        if (control.controller_type === SYSEX_CONTINUOUS) {
          var continuous = SysExContinuous.findOne({_id: control.parameter_id});
          continuous[SYSEX_CONTINUOUS] = true;
          actual_controls.push(continuous);
        }
        else if (control.controller_type === SYSEX_MENU) {
          var menu = SysExMenus.findOne({_id: control.parameter_id});
          menu[SYSEX_MENU] = true;
          actual_controls.push(menu);
        }
        else if (control.controller_type === SYSEX_TOGGLE) {
          var toggle = SysExToggles.findOne({_id: control.parameter_id});
          toggle[SYSEX_TOGGLE] = true;
          actual_controls.push(toggle);
        }
      }
      return actual_controls;
    }
    else
    {
      return [];
    }
  }
});

Template.panel_control.helpers({
  invokeAfterLoad() {
    "use strict";
    if(this === {}) {
      console.log("empty");
      return "";
    }
    var someValue = Session.get('someValue');
    Meteor.defer(() => {

      var knob_node = $('#' + this._id);
      if (knob_node.hasClass("knob")) {
        knob_node.knob({
          'release': (current_value) => {
            var parameter_number = this.parameter_number;
            send_midi_param_change(parameter_number, current_value);
          },
          'change': (current_value) => {
            var parameter_number = this.parameter_number;
            let last_value = knob_node.attr('data-current-value');
            current_value = ~~current_value;
            if (last_value !== current_value) {
              send_midi_param_change(parameter_number, current_value);
              knob_node.attr('data-current-value', current_value);
            }
          }
        });
      }
    });
    return "";
  },
  is_sysex_continuous() {
    "use strict";
    return this.sysex_continuous;
  },
  is_sysex_menu() {
    "use strict";
    return this.sysex_menu;
  },
  is_sysex_toggle() {
    "use strict";
    return this.sysex_toggle;
  }
});

Template.panel_control.events({
  'change .checkbox'(event) {
    "use strict";
    event.preventDefault();
    var checkbox_state = event.target.checked;
    var parameter_number = event.target.getAttribute('data-param-num');
    let midi_value = null;
    if (checkbox_state) {
      midi_value = event.target.getAttribute('data-true-value')
    }
    else {
      midi_value = event.target.getAttribute('data-false-value')
    }
    send_midi_param_change(parameter_number, midi_value);
  },
  'change .sysex_menu_selector'(event) {
    "use strict";
    event.preventDefault();
    let selected_value =  event.target.value;
    let parameter_number = event.target.getAttribute('data-param-num');
    send_midi_param_change(parameter_number, selected_value);
  }
});

function send_midi_param_change(parameter_number, current_value) {
  let EOX = 0b11110111;
  let channel = Session.get("midi_channel");
  let sysex_header_id = Session.get("current_sysex_header_id");
  let sysex_header = SysExHeaderInfo.findOne({_id: sysex_header_id});
  let manufacturer = Manufacturers.findOne({_id: sysex_header.manufacturer_id});
  sysex_header.manufacturer_id = manufacturer.manufacturer_sys_ex_id[0];
  let midi_message = create_header(channel, sysex_header);
  midi_message.push(parameter_number);
  midi_message.push(current_value);
  midi_message.push(EOX);
  send_midi(midi_message);
}

function create_header(midi_channel_hex, sysex_header_info) {
  "use strict";
  let status = 0b11110000;
  let item = null;
  let message = [status];
  message.push(sysex_header_info.manufacturer_id);
  for (item of sysex_header_info.before_channel_chunk) {
    message.push(item)
  }
  message.push(midi_channel_hex+sysex_header_info.channel_mod);
  for (item of sysex_header_info.after_channel_chunk) {
    message.push(item)
  }
  return message;
}