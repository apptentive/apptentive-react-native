package com.facebook.react.bridge;

import android.app.Application;
import android.content.Context;

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

	public Application getApplication() {
		return reactContext.getCurrentActivity().getApplication(); // this might throw an exception but will catch it later
	}

	public Context getContext() {
		return reactContext.getApplicationContext();
	}
}