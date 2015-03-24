Package.describe({
  name: 'speechmanager',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A simple manager class for speech-to-text and text-to-speech functionality, supported in Chrome, Safari and iOS',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('0.1.7');
  api.addFiles('speechmanager.js');

  api.export('SpeechManager');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('speechmanager');
  api.addFiles('speechmanager-tests.js');
});
