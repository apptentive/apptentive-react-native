#import "RNApptentiveModule.h"
#import <Apptentive/Apptentive.h>

static NSString *const kRejectCode = @"ApptentiveModule";
extern ApptentiveLogLevel ApptentiveLogLevelFromString(NSString *level);


@interface RNApptentiveModule ()

@property (readonly, nonatomic, getter=isRegistered) BOOL registered;

@end

@implementation RNApptentiveModule

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
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

	if ([configurationDictionary[@"apptentiveKey"] length] == 0) {
		rejecter(kRejectCode, @"Apptentive Key is missing or empty", nil);
	}

	if ([configurationDictionary[@"apptentiveSignature"] length] == 0) {
		rejecter(kRejectCode, @"Apptentive Signature is missing or empty", nil);
	}

	ApptentiveConfiguration *configuration = [ApptentiveConfiguration
											  configurationWithApptentiveKey:configurationDictionary[@"apptentiveKey"]
											  apptentiveSignature:configurationDictionary[@"apptentiveSignature"]];

	ApptentiveLogLevel logLevel = ApptentiveLogLevelFromString([configurationDictionary[@"logLevel"] lowercaseString]);
	if (logLevel == ApptentiveLogLevelUndefined) {
		rejecter(kRejectCode, [NSString stringWithFormat:@"%@ is not a valid log level", configurationDictionary[@"logLevel"]], nil);
	}

	[configuration setLogLevel:logLevel];

	if (configuration) {
		configuration.appID = configurationDictionary[@"appleID"];
		[Apptentive registerWithConfiguration:configuration];

		[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(messageCenterUnreadCountChangedNotification:) name:ApptentiveMessageCenterUnreadCountChangedNotification object:nil];

		if (Apptentive.shared != nil) {
			resolve(configuration.distributionName);
		} else {
			rejecter(kRejectCode, @"Unable to register", nil);
		}
	} else {
		rejecter(kRejectCode, @"Configuration returned nil", nil);
	}
}

RCT_EXPORT_METHOD(
	presentMessageCenter:(NSDictionary *)customData
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared presentMessageCenterFromViewController:nil withCustomData:customData completion:^(BOOL presented) {
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
	customData:(NSDictionary *)customData
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	[Apptentive.shared engage:eventName withCustomData:customData fromViewController:nil completion:^(BOOL engaged) {
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
	resolver:(RCTPromiseResolveBlock)resolver
	rejecter:(RCTPromiseRejectBlock)rejecter
) {
	if (!self.registered) {
		rejecter(kRejectCode, @"Apptentive is not registered", nil);
	}

	if (personName != nil && ![personName isKindOfClass:[NSString class]]) {
		rejecter(kRejectCode, @"Person name is not a string", nil);
	}

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

	if (personEmail != nil && ![personEmail isKindOfClass:[NSString class]]) {
		rejecter(kRejectCode, @"Person email is not a string", nil);
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

	if (key == nil) {
		rejecter(kRejectCode, @"Key is nil", nil);
	}

	if (value == nil) {
		rejecter(kRejectCode, @"Value is nil", nil);
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

	if (key == nil) {
		rejecter(kRejectCode, @"Key is nil", nil);
	}

	if (value == nil) {
		rejecter(kRejectCode, @"Value is nil", nil);
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

	if (key == nil) {
		rejecter(kRejectCode, @"Key is nil", nil);
	}

	if (value == nil) {
		rejecter(kRejectCode, @"Value is nil", nil);
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

	if (key == nil) {
		rejecter(kRejectCode, @"Key is nil", nil);
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

	if (key == nil) {
		rejecter(kRejectCode, @"Key is nil", nil);
	}

	if (value == nil) {
		rejecter(kRejectCode, @"Value is nil", nil);
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

	if (key == nil) {
		rejecter(kRejectCode, @"Key is nil", nil);
	}

	if (value == nil) {
		rejecter(kRejectCode, @"Value is nil", nil);
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

	if (key == nil) {
		rejecter(kRejectCode, @"Key is nil", nil);
	}

	if (value == nil) {
		rejecter(kRejectCode, @"Value is nil", nil);
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

	if (key == nil) {
		rejecter(kRejectCode, @"Key is nil", nil);
	}

	[Apptentive.shared removeCustomDeviceDataWithKey:key];
}

RCT_EXPORT_MODULE()

- (BOOL)isRegistered {
	return Apptentive.shared != nil;
}

- (NSArray<NSString *> *)supportedEvents
{
	return @[@"onUnreadMessageChange"];
}

- (void)messageCenterUnreadCountChangedNotification:(NSNotification *)notification {
	NSUInteger count = [notification.userInfo[@"count"] intValue];
	[self sendEventWithName:@"onUnreadMessageChange" body:@{ @"count": @(count)}];
}

@end
