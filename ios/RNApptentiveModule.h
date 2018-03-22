
#if __has_include("RCTBridgeModule.h")
#import "RCTEventEmitter.h"
#else
#import <React/RCTEventEmitter.h>
#endif

@interface RNApptentiveModule : RCTEventEmitter <RCTBridgeModule>

@end
