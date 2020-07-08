# Sample Setup

Ensure you have updated `App.js` with your key / signature.

Generate the bundle:

```shell
npx react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ios
npx react-native bundle --entry-file index.js --platform android --dev false --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```

Test the UI, adjust the destination name and OS to fit your needs:

```shell
xcodebuild -workspace ios/sample61.xcworkspace/ -scheme sample61 -sdk iphonesimulator -destination  'platform=iOS Simulator,name=iPhone 11,OS=13.2.2' clean build test CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
```
