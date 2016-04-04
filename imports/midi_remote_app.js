import * as SysEx from './lib/midi_parameter.js';

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.body.rendered = function () {
    require('jquery-knob');
    $(".dial").knob();
  };

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });

  Juno2SysEx = new SysEx.SysExHeader(
    0b01000001,
    [0b00110101],
    [0b00100011, 0b00100000, 0b00000001]
  );

  DX21SysEx = new SysEx.SysExHeader(
    0b01000011,
    [],
    [0b00010010]
  );

  Juno2VCFCutoff = new SysEx.SysExParameter("VCF Cutoff", 0, 127, 100, Juno2SysEx, 16);
  DX21Feedback = new SysEx.SysExParameter("Feedback Level", 0, 7, 0, DX21SysEx, 53);
  console.log();
  console.log(Juno2VCFCutoff.create_message(1, 69));
  console.log(DX21Feedback.create_message(2, 7));

}

