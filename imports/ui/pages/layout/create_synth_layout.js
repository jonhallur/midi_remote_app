/**
 * Created by jonh on 14.4.2016.
 */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import {
  SynthPrototypes,
  Manufacturers,
  SysExHeaderInfo,
} from '../../../api/collections.js'

import './create_synth_layout.html'
import './list_synth_prototypes.html'



Template.create_synth_layout.helpers({
  sysexheaders() {
    "use strict";
    return SysExHeaderInfo.find({});
  },
  manufacturer_name() {
    "use strict";
    let manufacturer = Manufacturers.findOne({_id: this.manufacturer_id});
    return manufacturer.name;
  },
  manufacturers() {
    "use strict";
    return Manufacturers.find({});
  }
});


Template.create_synth_layout.events({
  'click #add_synth'(event) {
    "use strict";
    event.preventDefault();
    var synth_name_selector = '#synth_name';
    var synth_name_input = $(synth_name_selector);
    const synth_name = synth_name_input.val();
    const header_id = $('#sysexheader_selector').val();
    console.log('header: ', header_id);
    let synth = {name: synth_name, items: [], sys_ex_header_id: header_id};
    SynthPrototypes.insert(synth);
    synth_name_input.val('');
  }
});

