/**
 * Created by jonh on 21.4.2016.
 */

import { FlowRouter } from 'meteor/kadira:flow-router';
import {
  SynthPrototypes,
  SynthPanels
} from './../../../api/collections.js';
import { swap_by_index, remove_all_from_panel } from './layout_helpers.js'
import './list_controller_panels.html';

Template.list_controller_panels.helpers({
  controller_panels() {
    "use strict";
    let proto_id = FlowRouter.getParam('proto_id');
    let synth = SynthPrototypes.findOne({_id: proto_id});
    if ((synth !== undefined) && (synth.hasOwnProperty('items'))) {
      return synth.items;
    }
    else {
      return [];
    }
  }
});

Template.controller_panel.helpers({
  num_items() {
    "use strict";
    let panel = SynthPanels.findOne({_id: this});
    if (panel !== undefined) {
      return panel.items.length;
    }
  },
  panel_name() {
    "use strict";
    let panel = SynthPanels.findOne({_id: this});
    if (panel !== undefined) {
      return panel.name;
    }
  }
});

Template.controller_panel.events({
  'click .edit_panel'(event) {
    "use strict";
    event.preventDefault();
    let proto_id = FlowRouter.getParam('proto_id');
    let panel_id = event.target.parentNode.parentNode.id;
    FlowRouter.go('/edit/proto/' + proto_id + '/panel/' + panel_id);
  },
  'click .delete_panel'(event) {
    "use strict";
    event.preventDefault();
    let panel_id = event.target.parentNode.parentNode.id;
    let synth_id = FlowRouter.getParam('proto_id');
    let synth_proto = SynthPrototypes.findOne({_id: synth_id});
    let item_index = synth_proto.items.indexOf(panel_id);
    let panel = SynthPanels.findOne({_id: panel_id});
    remove_all_from_panel(panel);
    synth_proto.items.splice(item_index, 1);
    SynthPrototypes.update({_id: synth_id}, synth_proto);
    SynthPanels.remove({_id: panel_id});
  },
  'click .move_panel_up'(event) {
    "use strict";
    event.preventDefault();
    var index_modifier = -1;
    let synth_id = FlowRouter.getParam('proto_id');
    let synth = SynthPrototypes.findOne({_id: synth_id});
    var cannot_move = 0;
    let id = event.target.parentNode.parentNode.id;
    var item_index = synth.items.indexOf(id);
    if (item_index === -1 || item_index === cannot_move) {
      return null;  //not found or already at top
    }
    let new_index = item_index + index_modifier;
    swap_by_index(synth, new_index, item_index);
    SynthPrototypes.update({_id: synth_id}, synth);

  },
  'click .move_panel_down'(event) {
    "use strict";
    event.preventDefault();
    var index_modifier = 1;
    let synth_id = FlowRouter.getParam('proto_id');
    let synth = SynthPrototypes.findOne({_id: synth_id});
    var cannot_move = synth.items.length - 1;
    let panel_id = event.target.parentNode.parentNode.id;
    var item_index = synth.items.indexOf(panel_id);
    if (item_index === -1 || item_index === cannot_move) {
      return null;
    }
    let new_index = item_index + index_modifier;
    swap_by_index(synth, new_index, item_index);
    SynthPrototypes.update({_id: synth_id}, synth);
  }
});