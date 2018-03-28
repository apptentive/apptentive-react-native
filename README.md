
# React Native Apptentive SDK

_The module is still under the development and would be available soon_

## Getting started

`$ npm install apptentive-react-native --save`

### Mostly automatic installation

`$ react-native link apptentive-react-native`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `apptentive-react-native` and add `RNApptentiveModule.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNApptentiveModule.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.apptentive.android.sdk.reactlibrary.RNApptentivePackage;` to the imports at the top of the file
  - Add `new RNApptentivePackage()` to the list returned by the `getPackages()` method
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
Register `Apptentive` in your `App.js` file:  
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
Make sure you use the Apptentive App Key and Signature for the Android app you created in the Apptentive console. Sharing these keys between two apps, or using keys from the wrong platform is not supported, and will lead to incorrect behavior. You can find them [here](https://be.apptentive.com/apps/current/settings/api).

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
Apptentive.onUnreadMessageChange = (count) => {
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
  
_TBD_
