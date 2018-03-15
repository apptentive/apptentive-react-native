#import "RNApptentiveModule.h"
#import <Apptentive/Apptentive.h>

static NSString *const kRejectCode = @"ApptentiveModule";

@interface RNApptentiveModule ()

@property (assign, nonatomic, getter=isRegistered) BOOL registered;

@end

@implementation RNApptentiveModule

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
	register:(NSDictionary *)configurationDictionary
	resolver:(RCTPromiseResolveBlock)resolve
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (self.registered) {
		rejecter(kRejectCode, @"Apptentive is already initialised", nil);
		return;
	}

	ApptentiveConfiguration *configuration = [ApptentiveConfiguration
											  configurationWithApptentiveKey:configurationDictionary[@"appKey"]
											  apptentiveSignature:configurationDictionary[@"signature"]];

	[configuration setLogLevel:logLevelFromString(configurationDictionary[@"logLevel"])];

	if (configuration) {
		configuration.appID = configurationDictionary[@"appleID"];
		[Apptentive registerWithConfiguration:configuration];
		self.registered = YES;
		resolve(configuration.distributionName);
	} else {
		rejecter(kRejectCode, @"Configuration returned nil", nil);
	}
}

RCT_EXPORT_METHOD(
	presentMessageCenter:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared presentMessageCenterFromViewController:nil completion:^(BOOL presented) {
		resolver(@(presented));
	}];
}

RCT_EXPORT_METHOD(
	canShowMessageCenter:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared queryCanShowMessageCenterWithCompletion:^(BOOL canShowMessageCenter) {
		resolver(@(canShowMessageCenter));
	}];
}

RCT_EXPORT_METHOD(
	canShowInteraction:(NSString *)eventName
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared queryCanShowInteractionForEvent:eventName completion:^(BOOL canShowInteraction) {
		resolver(@(canShowInteraction));
	}];
}

RCT_EXPORT_METHOD(
	engage:(NSString *)eventName
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared engage:eventName fromViewController:nil completion:^(BOOL engaged) {
		resolver(@(engaged));
	}];
}

RCT_EXPORT_METHOD(
	  getPersonName:(RCTPromiseResolveBlock)resolver
	  rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	resolver(Apptentive.shared.personName);
}

RCT_EXPORT_METHOD(
	setPersonName:(NSString *)personName
) {
	Apptentive.shared.personName = personName;
}

RCT_EXPORT_METHOD(
	getPersonEmail:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	resolver(Apptentive.shared.personEmailAddress);
}

RCT_EXPORT_METHOD(
	setPersonEmail:(NSString *)personEmail
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	Apptentive.shared.personEmailAddress = personEmail;
}

RCT_EXPORT_METHOD(
	addCustomPersonDataString:(NSString *)key
	value:(NSString *)value
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared addCustomPersonDataString:value withKey:key];
}

RCT_EXPORT_METHOD(
	addCustomPersonDataNumber:(NSString *)key
	value:(NSNumber *)value
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared addCustomPersonDataNumber:value withKey:key];
}

RCT_EXPORT_METHOD(
	addCustomPersonDataBool:(NSString *)key
	value:(NSNumber *)value
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared addCustomPersonDataBool:value.boolValue withKey:key];
}

RCT_EXPORT_METHOD(
	removeCustomPersonData:(NSString *)key
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared removeCustomPersonDataWithKey:key];
}

RCT_EXPORT_METHOD(
	addCustomDeviceDataString:(NSString *)key
	value:(NSString *)value
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared addCustomDeviceDataString:value withKey:key];
}

RCT_EXPORT_METHOD(
	addCustomDeviceDataNumber:(NSString *)key
	value:(NSNumber *)value
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared addCustomDeviceDataNumber:value withKey:key];
}

RCT_EXPORT_METHOD(
	addCustomDeviceDataBool:(NSString *)key
	value:(NSNumber *)value
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared addCustomDeviceDataBool:value.boolValue withKey:key];
}

RCT_EXPORT_METHOD(
	removeCustomDeviceData:(NSString *)key
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared removeCustomDeviceDataWithKey:key];
}

RCT_EXPORT_MODULE()

@end
  
