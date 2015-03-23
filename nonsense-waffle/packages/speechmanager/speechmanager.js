"use strict";

SpeechManager = {
  aUtterances: null,
  bSpeechEnabled: false,
  bSpeechSupported: false,
  bListenSupported: false,

  init: function () {
    //TODO: make these if statements jslint compatible
    if ('speechSynthesis' in window) {//this browser can talk
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
    var i;

    if (this.bSpeechEnabled && this.bSpeechSupported) {
      this.aUtterances = [];
      speechSynthesis.cancel();//cancel anything that was playing previously

      //this deals with a bug in google chrome where it can't speak long texts in one shot, so we break the string into sentences
      //TODO: deal with situations where a single sentence is more than 160 or so characters
      var sentences = msg.split(". ");
      for (i = 0; i < sentences.length; i++) {
        this.aUtterances[i] = new SpeechSynthesisUtterance();
        this.aUtterances[i].text = sentences[i];
        speechSynthesis.speak(this.aUtterances[i]);
      }
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