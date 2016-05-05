/**
 * Created by jonh on 11.4.2016.
 */
import './edit_synth_layout.html';
import { SynthPrototypes, SynthPanels, MidiParameters } from './../../../api/collections.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {find_index_by_id, swap_by_index, remove_all_from_panel} from './layout_helpers.js'

Template.edit_synth_layout.helpers({
  synth() {
    "use strict";
    let proto_id = FlowRouter.getParam('proto_id');
    return SynthPrototypes.findOne({_id: proto_id});
  }
});

Template.edit_synth_layout.events({
  'submit .new_midi_panel'(event) {
    "use strict";
    event.preventDefault();
    let proto_id = FlowRouter.getParam('proto_id');
    let synth = SynthPrototypes.findOne({_id: proto_id});
    let panel_name_input = $('#panel_name');
    let panel_name = panel_name_input.val();
    let panel = { owner_id: proto_id, name: panel_name, items: [] };
    let panel_id = SynthPanels.insert(panel);
    synth.items.push(panel_id);
    SynthPrototypes.update({_id: proto_id}, synth);
    panel_name_input.val('');
  }
});

