
package com.reactlibrary;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class RNApptentiveModuleModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNApptentiveModuleModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNApptentiveModule";
  }

  @ReactMethod
  public void register(String apptentiveKey, String apptentiveSignature, String logLevel, boolean shouldSanitizeLogMessages, Promise promise) {
    System.out.println("Register");
  }
}