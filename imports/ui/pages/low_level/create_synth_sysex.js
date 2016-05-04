import { SysExHeaderInfo, Manufacturers } from './../../../api/collections.js'

import './create_synth_sysex.html'

Template.new_sysexheader.helpers({
  manufacturers() {
    "use strict";
    return Manufacturers.find({});
  }
});

Template.new_sysexheader.events({
  'click .add_sysexheader'(event) {
    "use strict";
    event.preventDefault();
    let target = event.target.parentNode;
    let type_name = target.model_name.value;
    let manufacturer = parseInt(target.manufacturer_selector.value);
    let before = target.before_channel.value;
    let after = target.after_channel.value;
    let channel_mod = target.channel_mod.value;
    if (before === "") {
      before = [];
    }
    else {
      before = before.split(" ").join("").split(",");
      before = before.map(Number);
    }
    if (after === "") {
      after = [];
    }
    else {
      after = after.split(" ").join("").split(",");
      after = after.map(Number);
    }
    var channel_mod_numeric = Number(channel_mod) ? channel_mod !== "" : 0;
    let sysexheader = {
      type_name: type_name,
      manufacturer_id: manufacturer,
      before_channel_chunk: before,
      channel_mod: channel_mod_numeric,
      after_channel_chunk: after
    };
    SysExHeaderInfo.insert(sysexheader);

    target.before_channel.value = "";
    target.after_channel.value = "";
    target.channel_mod.value = "";

  }
});
