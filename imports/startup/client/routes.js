/**
 * Created by jonh on 10.4.2016.
 */
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import to load these templates
import './../../ui/layouts/app-body.js';
import './../../ui/pages/low_level/create_synth_sysex.js';
import './../../ui/pages/low_level/create_synth_manufacturer.js';
import './../../ui/pages/midi_controllers/create_sysex_continuous.js';
import './../../ui/pages/midi_controllers/create_sysex_toggle.js';
import './../../ui/pages/midi_controllers/create_sysex_menu.js';
import './../../ui/pages/layout/create_synth_layout.js';
import './../../ui/pages/layout/edit_synth_layout.js';
import './../../ui/pages/layout/edit_synth_panel.js';
import './../../ui/pages/layout/list_synth_prototypes.js';
import './../../ui/pages/layout/list_controller_panels.js';
import './../../ui/pages/layout/edit_proto_preset.js';

import './../../ui/pages/landing_page.js'

FlowRouter.route('/create/prototype', {
  name: 'create.prototype',
  action() {
    "use strict";
    BlazeLayout.render('app_body', { main: 'create_synth_layout'});
  }
});

FlowRouter.route('/list/prototypes', {
  name: 'list.prototypes',
  action() {
    "use strict";
    BlazeLayout.render('app_body', {main: 'list_synth_prototypes'});
  }
});

FlowRouter.route('/create/manufacturer', {
  name: 'create.manufacturer',
  action() {
    "use strict";
    BlazeLayout.render('app_body', { main: 'new_manufacturer'});
  }
});

FlowRouter.route('/create/sysexheader', {
  name: 'create.sysexheader',
  action() {
    "use strict";
    BlazeLayout.render('app_body', { main: 'new_sysexheader'});
  }
});

FlowRouter.route('/edit/proto/:proto_id/', {
  name: 'edit.proto',
  action() {
    "use strict";
    BlazeLayout.render('app_body', {main: 'edit_synth_layout'})
  }
});

FlowRouter.route('/edit/proto/:proto_id/panel/:panel_id', {
  name: 'edit.proto.panel',
  action() {
    "use strict";
    BlazeLayout.render('app_body', {main: 'edit_synth_panel'})
  }
});

FlowRouter.route('/edit/proto/:proto_id/panel/:panel_id/parameter/:parameter_id', {
  name: 'edit.proto.panel.parameter',
  action() {
    "use strict";
    BlazeLayout.render('app_body', {main: 'edit_synth_parameter'})
  }
});

FlowRouter.route('/proto/:id/control', {
  name: 'edit.proto.preset',
  action() {
    "use strict";
    BlazeLayout.render('app_body', {main: 'edit_proto_preset'})
  }
});

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('app_body', { main: 'landing_page' });
  }
});
