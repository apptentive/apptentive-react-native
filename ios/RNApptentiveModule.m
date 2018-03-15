#import "RNApptentiveModule.h"
#import <Apptentive/Apptentive.h>

static NSString *const kRejectCode = @"ApptentiveModule";

@implementation RNApptentiveModule {
	BOOL _initialised;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

static ApptentiveLogLevel logLevelFromString(NSString *string) {
	static NSDictionary *_logLevelMapping;
	static dispatch_once_t onceToken;
	dispatch_once(&onceToken, ^{
		_logLevelMapping = @{
							 @"crit": @(ApptentiveLogLevelCrit),
							 @"error": @(ApptentiveLogLevelError),
							 @"warn": @(ApptentiveLogLevelWarn),
							 @"info": @(ApptentiveLogLevelInfo),
							 @"debug": @(ApptentiveLogLevelDebug),
							 @"verbose": @(ApptentiveLogLevelVerbose)
							 };
	});

	return [_logLevelMapping[string] integerValue] ?: ApptentiveLogLevelUndefined;
}

RCT_EXPORT_METHOD(
	registerWithAppKey:(NSString *)appKey
	signature:(NSString *)signature
	logLevel:(NSString *)logLevelString
	shouldSanitizeLogMessages:(BOOL)shouldSanitizeLogMessages
	resolver:(RCTPromiseResolveBlock)resolve
	rejecter:(RCTPromiseRejectBlock)reject
) {
	if (_initialised) {
		reject(kRejectCode, @"Apptentive is already initialised", nil);
		return;
	}
	if (!appKey || [appKey isEqualToString:@""]) {
		reject(kRejectCode, @"Your appKey is empty", nil);
		return;
	}
	if (!signature || [signature isEqualToString:@""]) {
		reject(kRejectCode, @"Your signature is empty", nil);
		return;
	}

	ApptentiveConfiguration *configuration = [ApptentiveConfiguration
											  configurationWithApptentiveKey:appKey
											  apptentiveSignature:signature];

	[configuration setLogLevel:logLevelFromString(logLevelString)];

	if (configuration) {
		//configuration.appID = appleID;
		[Apptentive registerWithConfiguration:configuration];
		_initialised = YES;
		resolve(configuration.distributionName);
	} else {
		reject(kRejectCode, @"Configuration returned nil", nil);
	}
}

RCT_EXPORT_METHOD(
	presentMessageCenter:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)reject
) {
	[Apptentive.shared presentMessageCenterFromViewController:nil completion:^(BOOL presented) {
		resolver(@(presented));
	}];
}

RCT_EXPORT_METHOD(
	canShowMessageCenter:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)reject
) {
	[Apptentive.shared queryCanShowMessageCenterWithCompletion:^(BOOL canShowMessageCenter) {
		resolver(@(canShowMessageCenter));
	}];
}

RCT_EXPORT_METHOD(
	canShowInteraction:(NSString *)eventName
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)reject
) {
	[Apptentive.shared queryCanShowInteractionForEvent:eventName completion:^(BOOL canShowInteraction) {
		resolver(@(canShowInteraction));
	}];
}

RCT_EXPORT_METHOD(
	engage:(NSString *)eventName
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)reject
) {
	[Apptentive.shared engage:eventName fromViewController:nil completion:^(BOOL engaged) {
		resolver(@(engaged));
	}];
}

RCT_EXPORT_METHOD(
	  getPersonName:(RCTPromiseResolveBlock)resolver
	  rejecter:(RCTPromiseRejectBlock)reject
) {
	resolver(Apptentive.shared.personName);
}

RCT_EXPORT_METHOD(
	setPersonName:(NSString *)personName
) {
	Apptentive.shared.personName = personName;
}

RCT_EXPORT_METHOD(
	getPersonEmail:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)reject
) {
	resolver(Apptentive.shared.personEmailAddress);
}

RCT_EXPORT_METHOD(
	setPersonEmail:(NSString *)personEmail
) {
	Apptentive.shared.personEmailAddress = personEmail;
}

RCT_EXPORT_METHOD(
	addCustomPersonDataString:(NSString *)key
	value:(NSString *)value
) {
	[Apptentive.shared addCustomPersonDataString:value withKey:key];
}

RCT_EXPORT_METHOD(
	addCustomPersonDataNumber:(NSString *)key
	value:(NSNumber *)value
) {
	[Apptentive.shared addCustomPersonDataNumber:value withKey:key];
}

RCT_EXPORT_METHOD(
	addCustomPersonDataBool:(NSString *)key
	value:(NSNumber *)value
) {
	[Apptentive.shared addCustomPersonDataBool:value.boolValue withKey:key];
}

RCT_EXPORT_METHOD(
	removeCustomPersonData:(NSString *)key
) {
	[Apptentive.shared removeCustomPersonDataWithKey:key];
}

RCT_EXPORT_METHOD(
	addCustomDeviceDataString:(NSString *)key
	value:(NSString *)value
) {
	[Apptentive.shared addCustomDeviceDataString:value withKey:key];
}

RCT_EXPORT_METHOD(
	addCustomDeviceDataNumber:(NSString *)key
	value:(NSNumber *)value
) {
	[Apptentive.shared addCustomDeviceDataNumber:value withKey:key];
}

RCT_EXPORT_METHOD(
	addCustomDeviceDataBool:(NSString *)key
	value:(NSNumber *)value
) {
	[Apptentive.shared addCustomDeviceDataBool:value.boolValue withKey:key];
}

RCT_EXPORT_METHOD(
	removeCustomDeviceData:(NSString *)key
) {
	[Apptentive.shared removeCustomDeviceDataWithKey:key];
}

RCT_EXPORT_MODULE()

@end
  
