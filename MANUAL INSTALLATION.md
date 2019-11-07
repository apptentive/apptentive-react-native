### Manual installation

Manual installation is no longer supported, but the instructions below are included for reference. We recommend using React Native 0.60-style auto-linking. 

#### iOS

1. Add the Apptentive SDK to the iOS project or workspace. We recommend using CocoaPods. 
1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `apptentive-react-native` and add `RNApptentiveModule.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNApptentiveModule.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)

#### Android

**Note**: Apptentive SDK requires Android API level 26 and up to work properly.  

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

