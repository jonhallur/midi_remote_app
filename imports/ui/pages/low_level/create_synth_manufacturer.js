import { Manufacturers } from './../../../api/collections.js'

import './create_synth_manufacturer.html'

Template.new_manufacturer.events({
  'click .add_manufacturer'(event) {
    "use strict";
    event.preventDefault();
    const target = event.target.parentNode;
    const name = target.manufacturer_name.value;
    const id = target.manufacturer_id.value;
    let manufacturer = { name: name, manufacturer_sys_ex_id: id};
    Manufacturers.insert(manufacturer);
    target.manufacturer_id.value = 0;
    target.manufacturer_name.value = '';
  }
});
