/**
 * Created by jonh on 15.4.2016.
 */
import './landing_page.html'
import * as c from './../../api/collections.js'
Template.landing_page.helpers({
  db_stats() {
    "use strict";
    return {
      num_manufact: c.Manufacturers.find({}).count(),
      num_sysex_head: c.SysExHeaderInfo.find({}).count(),
      num_protos: c.SynthPrototypes.find({}).count(),
      num_panels: c.SynthPanels.find({}).count(),
      num_params: c.MidiParameters.find({}).count(),
      num_sysex_cont: c.SysExContinuous.find({}).count(),
      num_sysex_menu: c.SysExMenus.find({}).count(),
      num_sysex_togg: c.SysExToggles.find({}).count(),
    };
  }
});