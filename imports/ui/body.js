/**
 * Created by jonh on 5.4.2016.
 */
import { Template } from 'meteor/templating';
import { Synths, Manufactures } from '../api/synths.js'
import { MidiRemoteLayout } from '../lib/control_collection.js'
import { SysExHeader } from '../lib/sysex_header.js'
import { Manufactor } from '../lib/manufacturers.js'
import './body.html';

Template.body.helpers({
  synths() {
    "use strict";
    return Synths.find({});
  },

  manufacturers() {
    "use strict";
    return Manufactures.find({})
  }
});

Template.body.events({
  'click .add_synth'(event) {
    "use strict";
    event.preventDefault();
    const target = event.target;
    const text = target.synth_name.value;
    let synth = new MidiRemoteLayout(text, new SysExHeader(127,[],[]));
    console.log(synth);
    Synths.insert(synth);
    target.synth_name.value = '';
  },
  'click .add_manufacturer'(event) {
    "use strict";
    event.preventDefault();
    console.log("stuff");
    const target = event.target.parentNode;
    const name = target.manufacturer_name.value;
    const id = target.manufacturer_id.value;
    let manufacturer = new Manufactor(name, id);
    Manufactures.insert(manufacturer);
    target.manufacturer_id.value = 0;
    target.manufacturer_name.value = '';
  }
});