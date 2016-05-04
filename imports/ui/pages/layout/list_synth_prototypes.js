import { remove_all_from_panel } from './layout_helpers.js'
import { FlowRouter } from 'meteor/kadira:flow-router'

import {
SynthPrototypes,
SynthPanels
} from './../../../api/collections.js'

import './list_synth_prototypes.html'


Template.list_synth_prototypes.helpers({
  synths() {
    "use strict";
    return SynthPrototypes.find({});
  }
});

Template.synth.helpers({
  num_parameters() {
    "use strict";
    let synth = SynthPrototypes.findOne({_id: this._id});
    return synth.items.length;
  }
});

Template.synth.events({
  'click .remove_synth'(event) {
    "use strict";
    event.preventDefault();
    var synth = SynthPrototypes.findOne({_id: this._id});
    if (synth === undefined) {
      Alerts.add('SynthProto is undefined');
      return null;
    }
    for(var panel_id of synth.items) {
      var panel = SynthPanels.findOne({_id: panel_id});
      if (panel === undefined) {
        Alerts.add('Panel is undefined');
        return null;
      }
      remove_all_from_panel(panel);
      SynthPanels.remove({_id: panel_id});
    }
    SynthPrototypes.remove({_id: this._id});

  },

  'click .edit_synth'(event) {
    "use strict";
    event.preventDefault();
    let target = event.target;
    let proto_id = target.id;
    FlowRouter.go('/edit/proto/' + proto_id);
  }
});

