
# React Native Apptentive SDK

## Getting started

`$ npm install apptentive-react-native --save`

`$ react-native link apptentive-react-native`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `apptentive-react-native` and add `RNApptentiveModule.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNApptentiveModule.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNApptentiveModulePackage;` to the imports at the top of the file
  - Add `new RNApptentiveModulePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':apptentive-react-native'
  	project(':apptentive-react-native').projectDir = new File(rootProject.projectDir, 	'../node_modules/apptentive-react-native/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':apptentive-react-native')
  	```

## Usage
```javascript
import RNApptentiveModule from 'apptentive-react-native';

Create one app for each supported platform in your [Apptentive Dashboard](https://be.apptentive.com) (i.e. one Android app and one iOS app if you support both platforms that Apptentive supports). Then navigate to the [API & Development section under the Settings tab](https://be.apptentive.com/apps/current/settings/api) for each of your apps, and note the Apptentive App Key and Apptentive App Signature.

Then in your `App.js` file, add code to register the Apptentive SDK:

```javascript
import { Apptentive, ApptentiveConfiguration } from 'apptentive-react-native';

const credentials = Platform.select({
  ios: {
    apptentiveKey: '<YOUR_IOS_APP_KEY>',
    apptentiveSignature: '<YOUR_IOS_APP_SIGNATURE>'
  },
  android: {
    apptentiveKey: '<YOUR_ANDROID_APP_KEY>',
    apptentiveSignature: '<YOUR_ANDROID_APP_SIGNATURE>'
  }
});

export default class App extends Component {
  componentDidMount() {
    const configuration = new ApptentiveConfiguration(
      credentials.apptentiveKey,
      credentials.apptentiveSignature
    );
    Apptentive.register(configuration);
    ...
  }
  ...
}
```

Again, be sure to use separate credentials for each platform, as supporting both platforms with one set of credentials is not supported.

## Message Center

See: [How to Use Message Center](https://learn.apptentive.com/knowledge-base/how-to-use-message-center/)

### Showing Message Center

With the Apptentive Message Center your customers can send feedback, and you can reply, all without making them leave the app. Handling support inside the app will increase the number of support messages received and ensure a better customer experience.

Message Center lets customers see all the messages they have send you, read all of your replies, and even send screenshots that may help debug issues.

Add [Message Center](http://learn.apptentive.com/knowledge-base/apptentive-android-sdk-features/#message-center) to talk to your customers.

Find a place in your app where you can add a button that opens Message Center. Your setings page is a good place.

```
<Button
  onPress={() => {
    Apptentive.presentMessageCenter()
      .then((presented) => console.log(`Message center presented: ${presented}`));
  }}
  title="Show Message Center"
/>
```

### Unread Message Count Callback

You can receive a callback when a new unread message comes in. You can use this callback to notify your customer, and display a badge letting them know how many unread messages are waiting for them. Because this listener could be called at any time, you should store the value returned from this method, and then perform any user interaction you desire at the appropriate time.
```
Apptentive.onUnreadMessageCountChanged = (count) => {
  console.log(`Unread message count changed: ${count}`)
}
```

## Events

Events record user interaction. You can use them to determine if and when an Interaction will be shown to your customer. You will use these Events later to target Interactions, and to determine whether an Interaction can be shown. You trigger an Event with the `Engage()` method. This will record the Event, and then check to see if any Interactions targeted to that Event are allowed to be displayed, based on the logic you set up in the Apptentive Dashboard.
  
```
Apptentive.engage(this.state.eventName).then((engaged) => console.log(`Event engaged: ${engaged}`))
```
You can add an Event almost anywhere in your app, just remember that if you want to show an Interaction at that Event, it needs to be a place where launching an Activity will not cause a problem in your app.

## Push Notifications
Apptentive can send push notifications to ensure your customers see your replies to their feedback in Message Center.  
  
### iOS

On iOS, you'll need to follow [Apple's instructions on adding Push capability to your app](https://help.apple.com/xcode/mac/current/#/devdfd3d04a1). 

You will need to export your push certificate and key in `.p12` format and upload it to the [Integrations section of the Settings tab](https://be.apptentive.com/apps/current/settings/integrations) in your Apptentive dashboard under "Apptentive Push". You can find more information on this process in the [Push Notifications section of our iOS Integration Reference](https://learn.apptentive.com/knowledge-base/ios-integration-reference/#push-notifications).

You will then edit your AppDelegate.m file. First import the Apptentive SDK at the top level of this file:

```
@import Apptentive;
```

Then add the following methods to your App Delegate class:

```
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    // Register for Apptentive's push service:
    [Apptentive.shared setPushNotificationIntegration:ApptentivePushProviderApptentive withDeviceToken:deviceToken];

    // Uncomment if using PushNotificationsIOS module:
    //[RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
    // Forward the notification to the Apptentive SDK:
    BOOL handledByApptentive = [Apptentive.shared didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];

    // Be sure your code calls the completion handler if you expect to receive non-Apptentive push notifications.
    if (!handledByApptentive) {
        // ...handle the push notification
        // ...and call the completion handler:
        completionHandler(UIBackgroundFetchResultNewData);

        // Uncomment if using PushNotificationIOS module (and remove the above call to `completionHandler`):
        //[RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler]; 
    }
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
    // Forward the notification to the Apptentive SDK:
    BOOL handledByApptentive = [Apptentive.shared didReceiveLocalNotification:notification fromViewController:self.window.rootViewController];

    // Uncomment if using PushNotificationIOS module:
    //if (!handledByApptentive) {
    //    [RCTPushNotificationManager didReceiveLocalNotification:notification];
    //}
}
```

Apptentive's push services work well alongside other push notification services, such as those handled by the [PushNotificationIOS React Native module](https://facebook.github.io/react-native/docs/pushnotificationios.html) . Note that you will have to implement the handful of additional methods listed in the documentation in your App Delegate to support this module.

### Android
  
On Android, you'll need to follow [Apptentive Android Integration Guide](https://learn.apptentive.com/knowledge-base/android-integration-reference/#push-notifications).
