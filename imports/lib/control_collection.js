import {
  throw_if_not_instance_of
} from './helpers.js'

import { SysExHeader } from './sysex_header.js'

class ControlsCollection {
  constructor (name, collection_type) {
    "use strict";
    this.name = name;
    this.type = collection_type;
    this.items = [];
  }

  push(item) {
    "use strict";
    throw_if_not_instance_of(item, this.type);
    this.items.push(item)
  }

  remove(item) {
    "use strict";
    throw_if_not_instance_of(item, this.type);
    let index = this.items.indexOf(item);
    if (index === -1) {
      return null;
    }
    return this.items.splice(index, 1);
  }
  swap(item1, item2) {
    "use strict";
    throw_if_not_instance_of(item1, this.type);
    throw_if_not_instance_of(item2, this.type);
    let index1 = this.items.indexOf(item1);
    let index2 = this.items.indexOf(item2);
    if ((index1 === -1 ) || (index2 === -1)) {
      return null;
    }
    let temp = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = temp;
  }

  length() {
    "use strict";
    return this.items.length;
  }

  get_item_by_index(index) {
    "use strict";
    if ((index < 0) || (index > this.length())) {
      throw RangeError("parameter index out of range");
    }
    return this.items[index];
  }
}

class MidiPanelLayout extends ControlsCollection {
  constructor(name) {
    "use strict";
    super(name, MidiParameter)
  }
}

class MidiRemoteLayout extends ControlsCollection {
  constructor(name, sys_ex_header) {
    "use strict";
    super(name, MidiPanelLayout);
    throw_if_not_instance_of(sys_ex_header, SysExHeader);
    this.sys_ex_header = sys_ex_header
  }
}


export {ControlsCollection as ControlsCollection};
export {MidiPanelLayout as MidiPanelLayout};
export {MidiRemoteLayout as MidiRemoteLayout};

