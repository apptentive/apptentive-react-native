
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

// TODO: Do some awesome things here
```
  
