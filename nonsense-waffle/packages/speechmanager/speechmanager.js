"use strict";

SpeechManager = {
  oSpeechUtterance: null,
  bSpeechEnabled: false,
  bSpeechSupported: false,
  bListenSupported: false,

  init: function () {
    //TODO: make these if statements jslint compatible
    if ('speechSynthesis' in window) {//this browser can talk
      this.oSpeechUtterance = new SpeechSynthesisUtterance();
      this.bSpeechSupported = true;

      //we blindly assume that if speechsynthesis is available, this browser must also have localStorage
      var bSpeechEnabledSaved = JSON.parse(localStorage.getItem('bSpeechEnabled'));

      if (bSpeechEnabledSaved || bSpeechEnabledSaved === null || bSpeechEnabledSaved === undefined) {
        //if the stored value was true or if there was no stored value, default speech enabled to true
        this.bSpeechEnabled = true;
      }
    }

    if ('SpeechRecognition' in window) {//this browser can listen
      this.bListenSupported = true;
    }
  },

  speak: function (msg) {
    if (this.bSpeechEnabled && this.bSpeechSupported) {
      speechSynthesis.cancel();//cancel anything that was playing previously
      this.oSpeechUtterance.text = msg;
      speechSynthesis.speak(this.oSpeechUtterance);
    }
  },

  saveState: function (){
    if (Storage !== undefined) {
      localStorage.setItem('bSpeechEnabled', this.bSpeechEnabled);
    }
  },

  disable: function () {
    this.bSpeechEnabled = false;
    if (this.bSpeechSupported) {
      speechSynthesis.cancel();
    }
    this.saveState();
  },

  enable: function () {
    this.bSpeechEnabled = true;
    this.saveState();
  },

  toggleEnabled: function () {
    if (this.bSpeechEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.bSpeechEnabled;
  }
}