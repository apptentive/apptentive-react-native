function init(Module, configuration) {
  const apptentiveKey = configuration.apptentiveKey;
  const apptentiveSignature = configuration.apptentiveSignature;
  const logLevel = configuration.logLevel;
  const shouldSanitizeLogMessages = configuration.shouldSanitizeLogMessages;
  return Module.registerWithAppKey(apptentiveKey, apptentiveSignature, logLevel, shouldSanitizeLogMessages);
}

module.exports = {
  init
}
