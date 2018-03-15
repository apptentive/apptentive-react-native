package com.reactlibrary;

import android.app.Application;
import android.content.Context;
import android.support.annotation.Nullable;

import com.apptentive.android.sdk.Apptentive;
import com.apptentive.android.sdk.ApptentiveHelper;
import com.apptentive.android.sdk.ApptentiveInternal;
import com.apptentive.android.sdk.conversation.Conversation;
import com.apptentive.android.sdk.conversation.ConversationDispatchTask;
import com.apptentive.android.sdk.util.NotImplementedException;
import com.apptentive.android.sdk.util.StringUtils;
import com.facebook.react.bridge.ApptentiveReactApplicationContextWrapper;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

public class RNApptentiveModuleModule extends ReactContextBaseJavaModule {
  private static final String CODE_APPTENTIVE = "Apptentive";

  private final ApptentiveReactApplicationContextWrapper reactContextWrapper;

  public RNApptentiveModuleModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContextWrapper = new ApptentiveReactApplicationContextWrapper(reactContext);
  }

  @Override
  public String getName() {
    return "RNApptentiveModule";
  }

  //region JavaScript bindings

  @ReactMethod
  public void register(String apptentiveKey, String apptentiveSignature, String logLevel, boolean shouldSanitizeLogMessages, Promise promise) {
    try {
      Application application = reactContextWrapper.getApplication();

      // TODO: override log level
      if (ApptentiveInternal.isApptentiveRegistered()) {
        promise.reject(CODE_APPTENTIVE, "Apptentive instance already initialized");
        return;
      }

      Apptentive.register(application, apptentiveKey, apptentiveSignature);
      promise.resolve(Boolean.TRUE);
    } catch (Exception e) {
      promise.reject(CODE_APPTENTIVE, "Exception while initialized Apptentive", e);
    }
  }

  @ReactMethod
  public void presentMessageCenter(ReadableMap customData, Promise promise) {
    if (!checkRegistered(promise, "present message center")) {
      return;
    }

    Apptentive.showMessageCenter(getContext(), new PromiseCallback(promise), createCustomData(customData));
  }

  @ReactMethod
  public void canShowMessageCenter(Promise promise) {
    if (!checkRegistered(promise, "check if message center can be presented")) {
      return;
    }

    Apptentive.canShowMessageCenter(new PromiseCallback(promise));
  }

  @ReactMethod
  public void canShowInteraction(String event, Promise promise) {
    if (!checkRegistered(promise, "check if interaction '%s' can be showed", event)) {
      return;
    }

    Apptentive.queryCanShowInteraction(event, new PromiseCallback(promise));
  }

  @ReactMethod
  public void engage(String event, ReadableMap customData, Promise promise) {
    if (!checkRegistered(promise, "engage event '%s'", event)) {
      return;
    }

    Apptentive.engage(getContext(), event, new PromiseCallback(promise), createCustomData(customData));
  }

  @ReactMethod
  public void getPersonName(Promise promise) {
    if (!checkRegistered(promise, "get person name")) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void setPersonName(String name, Promise promise) {
    if (!checkRegistered(promise, "set person name")) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void getPersonEmail(Promise promise) {
    if (!checkRegistered(promise, "get person email")) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void setPersonEmail(String email, Promise promise) {
    if (!checkRegistered(promise, "set person email")) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void addCustomPersonDataNumber(String key, Number value, Promise promise) {
    if (!checkRegistered(promise, "add custom person data key '%s'", key)) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void addCustomPersonDataString(String key, String value, Promise promise) {
    if (!checkRegistered(promise, "add custom person data key '%s'", key)) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void addCustomPersonDataBool(String key, Boolean value, Promise promise) {
    if (!checkRegistered(promise, "add custom person data key '%s'", key)) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void removeCustomPersonData(String key, Promise promise) {
    if (!checkRegistered(promise, "remove custom person data key '%s'", key)) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void addCustomDeviceDataNumber(String key, Number value, Promise promise) {
    if (!checkRegistered(promise, "add custom device data key '%s'", key)) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void addCustomDeviceDataString(String key, String value, Promise promise) {
    if (!checkRegistered(promise, "add custom device data key '%s'", key)) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void addCustomDeviceDataBool(String key, Boolean value, Promise promise) {
    if (!checkRegistered(promise, "add custom device data key '%s'", key)) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  @ReactMethod
  public void removeCustomDeviceData(String key, Promise promise) {
    if (!checkRegistered(promise, "remove custom device data key '%s'", key)) {
      return;
    }

    throw new RuntimeException("Implement me");
  }

  //endregion

  //region Helpers

  private @Nullable Map<String, Object> createCustomData(ReadableMap customData) {
    throw new RuntimeException("Implement me");
  }

  private boolean checkRegistered(Promise promise, String message, Object... args) {
    if (!ApptentiveInternal.isApptentiveRegistered()) {
      promise.reject(CODE_APPTENTIVE, StringUtils.format("Unable to %s: Apptentive instance is not properly initialized", StringUtils.format(message, args)));
      return false;
    }

    return true;
  }

  private Context getContext() {
    return reactContextWrapper.getContext();
  }

  private static class PromiseCallback implements Apptentive.BooleanCallback {
    private final Promise promise;

    private PromiseCallback(Promise promise) {
      this.promise = promise;
    }

    @Override
    public void onFinish(boolean result) {
      if (promise != null) {
        promise.resolve(result);
      }
    }
  }

  //endregion
}