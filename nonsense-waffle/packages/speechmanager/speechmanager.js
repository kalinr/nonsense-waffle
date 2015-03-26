"use strict";

SpeechManager = {
  aUtterances: [],
  bSpeechEnabled: false,
  bSpeechSupported: false,
  bSpeaking: false,
  bListenSupported: false,
  bListening: false,
  oSpeechRecognition: null,
  oTriggers: [],//associative array (eventName:callback)

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

    if ('webkitSpeechRecognition' in window) {//this browser can listen
      this.bListenSupported = true;

      console.log("speechsupported!!!!!");


      this.oSpeechRecognition = new webkitSpeechRecognition();
      this.oSpeechRecognition.continuous = true;
      this.oSpeechRecognition.interimResults = true;
      this.oSpeechRecognition.onresult = function(event) {
        console.log("speechrecog event", event)
      }

      console.log(this.oSpeechRecognition);
    }
  },

  speak: function (msg) {
    var elTemp,
      sentences,
      i,
      self = this;

    if (this.bSpeechEnabled && this.bSpeechSupported) {

      this.bSpeaking = true;

      //get the browser to strip out all the html from the msg
      elTemp = document.createElement("DIV");
      elTemp.innerHTML = msg;
      msg = elTemp.textContent || elTemp.innerText || "";

      this.aUtterances = [];
      speechSynthesis.cancel();//cancel anything that was playing previously

      //this deals with a bug in google chrome where it can't speak long texts in one shot, so we break the string into sentences
      //TODO: deal with situations where a single sentence is more than 160 or so characters
      sentences = msg.split(". ");
      for (i = 0; i < sentences.length; i++) {
        this.aUtterances[i] = new SpeechSynthesisUtterance();
        this.aUtterances[i].text = sentences[i];
        speechSynthesis.speak(this.aUtterances[i]);
      }

      //listen to the end of only the final utterance so we know when they are all done
      this.aUtterances[this.aUtterances.length - 1].onend = function () {
        self.stopSpeaking();
      };
    }
  },

  //stop any speech currently happening
  stopSpeaking: function () {
    speechSynthesis.cancel();
    this.bSpeaking = false;
    this.trigger('speechStopped');
  },

  listen: function () {

    console.log("starting to listen!!!");

    this.oSpeechRecognition.start();
  },

  stopListening: function () {

    console.log(this.oSpeechRecognition.stop);

    this.oSpeechRecognition.stop();
  },

  //add an event listener
  on: function(event, callback) {
    if (!this.oTriggers[event]) {
      this.oTriggers[event] = [];
    }
    this.oTriggers[event].push(callback);
  },

  //trigger an event
  trigger: function(event, params) {
    var i;
    if (this.oTriggers[event]) {
      for (i in this.oTriggers[event] ) {
        this.oTriggers[event][i](params);
      }
    }
  },

  saveState: function () {
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