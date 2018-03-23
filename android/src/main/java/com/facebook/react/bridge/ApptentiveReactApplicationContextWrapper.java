package com.facebook.react.bridge;

import android.app.Activity;
import android.app.Application;
import android.content.Context;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

/**
 * This class breaks encapsulation but makes its easier for end user to integrate.
 */
public class ApptentiveReactApplicationContextWrapper {
	private final ReactApplicationContext reactContext;

	public ApptentiveReactApplicationContextWrapper(ReactApplicationContext reactContext) {
		if (reactContext == null) {
			throw new IllegalArgumentException("React context is null");
		}
		this.reactContext = reactContext;
	}

	public Activity getCurrentActivity() {
		return reactContext.getCurrentActivity();
	}

	public Application getApplication() {
		return getCurrentActivity().getApplication(); // this might throw an exception but will catch it later
	}

	public Context getContext() {
		return reactContext.getApplicationContext();
	}
}