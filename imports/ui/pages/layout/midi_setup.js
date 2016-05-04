import './midi_setup.html'
import { Alerts } from 'meteor/mrt:bootstrap-alerts';

export var midi_access;

export function send_midi(message) {
  "use strict";
  var output_id = Session.get("selected_midi_output");
  var output = midi_access.outputs.get(output_id);
  if (output === undefined) {
    Alerts.add("No MIDI out selected");
    return;
  }
  output.send(message);
}

Meteor.startup(function () {
  Session.setDefault("midi_outputs", []);
  Session.setDefault("midi_inputs", []);
  Session.setDefault("midi_available", false);
  Session.setDefault("selected_midi_output", null);
  Session.setDefault("selected_midi_input", null);
  Session.setDefault("selected_midi_seq_output", null);
  Session.setDefault("selected_midi_seq_input", null);
  Session.setDefault("selected_midi_output_name", "(NONE)");
  Session.setDefault("selected_midi_input_name", "(NONE)");
  Session.setDefault("selected_midi_seq_output_name", "(None}");
  Session.setDefault("selected_midi_seq_input_name", "(None}");
});

Template.midi.onRendered(function () {
  updateMidiStatus();
});

Template.midi.helpers({
  midi_outputs: function () {

    var midiOutputs = Session.get("midi_outputs");
    console.log("m-outs: ", midiOutputs);
    return midiOutputs;
  },
  midi_inputs: function () {
    "use strict";
    return Session.get("midi_inputs");
  },
  selected_midi_output_name: function () {
    return Session.get("selected_midi_output_name");
  },
  selected_midi_input_name: function () {
    "use strict";
    return Session.get("selected_midi_input_name")
  },
  selected_midi_seq_output_name: function () {
    return Session.get("selected_midi_seq_output_name");
  },
  selected_midi_seq_input_name: function () {
    return Session.get("selected_midi_seq_input_name");
  },
  midi_available: function () {
    return Session.get("midi_available") ? "available" : "not available";
  }
});

Template.midi.events({
  'click .midi-output': function(event) {
    event.preventDefault();

    var output_id = event.currentTarget.parentNode.id;
    Session.set("selected_midi_output", output_id);
    Session.set("selected_midi_output_name", midi_access.outputs.get(output_id).name);
  },
  'click .midi-input': function(event) {
    event.preventDefault();

    var input_id = event.currentTarget.parentNode.id;
    Session.set("selected_midi_input", input_id);
    Session.set("selected_midi_input_name", midi_access.inputs.get(input_id).name);
  },
  'click .midi-seq-output': (event) => {
    "use strict";
    event.preventDefault();
    var seq_out_id = event.currentTarget.parentNode.id;
    Session.set("selected_midi_seq_output", seq_out_id);
    var midi_seq_output = midi_access.outputs.get(seq_out_id);
    Session.set("selected_midi_seq_output_name", midi_seq_output.name);

  },
  'click .midi-seq-input': (event) => {
    "use strict";
    event.preventDefault();

    var seq_in_id = event.currentTarget.parentNode.id;
    Session.set("selected_midi_seq_input", seq_in_id);
    var midi_seq_input = midi_access.inputs.get(seq_in_id);
    Session.set("selected_midi_seq_input_name", midi_seq_input.name);
    midi_seq_input.onmidimessage = SendMidiToKeyboard;
  }
});



function SendMidiToKeyboard(event) {
  let output_id = Session.get("selected_midi_output");
  let midi_output = midi_access.outputs.get(output_id);
  midi_output.send(event.data);

}

updateMidiStatus = function () {
  if (navigator.requestMIDIAccess) {
    var midi_outputs = [];
    var midi_inputs = [];
    navigator.requestMIDIAccess({
      sysex: true
    }).then(function (midiAccess) {
      midi_access = midiAccess;
      midi_access.outputs.forEach((entry) => {
        "use strict";
        midi_outputs.push({name: entry.name, id: entry.id});
      });
      midi_access.inputs.forEach((entry) => {
        "use strict";
        midi_inputs.push({name: entry.name, id: entry.id});
      });
      Session.set("midi_outputs", midi_outputs);
      Session.set("midi_inputs", midi_inputs);
      Session.set("midi_available", true);

    }, function (midiAccess) {
      Session.set("midi_available", false);
    });
  }
  else {
    Session.set("midi_available", false);
  }
};