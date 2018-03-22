package com.apptentive.android.sdk.reactlibrary;

import android.app.Application;
import android.content.Context;
import android.support.annotation.Nullable;

import com.apptentive.android.sdk.Apptentive;
import com.apptentive.android.sdk.ApptentiveInternal;
import com.apptentive.android.sdk.conversation.Conversation;
import com.apptentive.android.sdk.conversation.ConversationDispatchTask;
import com.apptentive.android.sdk.util.ObjectUtils;
import com.apptentive.android.sdk.util.StringUtils;
import com.facebook.react.bridge.ApptentiveReactApplicationContextWrapper;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

import static com.apptentive.android.sdk.ApptentiveHelper.dispatchConversationTask;

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
	public void register(ReadableMap configuration, Promise promise) {
		try {
			Application application = reactContextWrapper.getApplication();

			// TODO: override log level
			if (ApptentiveInternal.isApptentiveRegistered()) {
				promise.reject(CODE_APPTENTIVE, "Apptentive instance already initialized");
				return;
			}

			Map<String, Object> config = toHashMap(configuration);
			String apptentiveKey = ObjectUtils.as(config.get("apptentiveKey"), String.class);
			if (StringUtils.isNullOrEmpty(apptentiveKey)) {
				promise.reject(CODE_APPTENTIVE, "Apptentive key is null or empty");
				return;
			}

			String apptentiveSignature = ObjectUtils.as(config.get("apptentiveSignature"), String.class);
			if (StringUtils.isNullOrEmpty(apptentiveSignature)) {
				promise.reject(CODE_APPTENTIVE, "Apptentive signature is null or empty");
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

		Apptentive.showMessageCenter(getContext(), new PromiseBooleanCallback(promise), toHashMap(customData));
	}

	@ReactMethod
	public void canShowMessageCenter(Promise promise) {
		if (!checkRegistered(promise, "check if message center can be presented")) {
			return;
		}

		Apptentive.canShowMessageCenter(new PromiseBooleanCallback(promise));
	}

	@ReactMethod
	public void canShowInteraction(String event, Promise promise) {
		if (!checkRegistered(promise, "check if interaction '%s' can be showed", event)) {
			return;
		}

		Apptentive.queryCanShowInteraction(event, new PromiseBooleanCallback(promise));
	}

	@ReactMethod
	public void engage(String event, ReadableMap customData, Promise promise) {
		if (!checkRegistered(promise, "engage event '%s'", event)) {
			return;
		}

		Apptentive.engage(getContext(), event, new PromiseBooleanCallback(promise), toHashMap(customData));
	}

	@ReactMethod
	public void getPersonName(final Promise promise) {
		final String description = "get person name";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				promise.resolve(Apptentive.getPersonName());
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void setPersonName(final String name, final Promise promise) {
		final String description = "set person name";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.setPersonName(name);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void getPersonEmail(final Promise promise) {
		final String description = "get person email";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				promise.resolve(Apptentive.getPersonEmail());
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void setPersonEmail(final String email, final Promise promise) {
		final String description = "set person email";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.setPersonEmail(email);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void addCustomPersonDataNumber(final String key, final Number value, final Promise promise) {
		final String description = "add custom person data number";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.addCustomPersonData(key, value);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void addCustomPersonDataString(final String key, final String value, final Promise promise) {
		final String description = "add custom person data string";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.addCustomPersonData(key, value);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void addCustomPersonDataBool(final String key, final Boolean value, final Promise promise) {
		final String description = "add custom person data boolean";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.addCustomPersonData(key, value);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void removeCustomPersonData(final String key, final Promise promise) {
		final String description = "remove custom person data";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.removeCustomPersonData(key);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void addCustomDeviceDataNumber(final String key, final Number value, final Promise promise) {
		final String description = "add custom device data number";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.addCustomDeviceData(key, value);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void addCustomDeviceDataString(final String key, final String value, final Promise promise) {
		final String description = "add custom device data string";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.addCustomDeviceData(key, value);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void addCustomDeviceDataBool(final String key, final Boolean value, final Promise promise) {
		final String description = "add custom device data boolean";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.addCustomDeviceData(key, value);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	@ReactMethod
	public void removeCustomDeviceData(final String key, final Promise promise) {
		final String description = "remove custom device data";
		dispatchConversationTask(new ConversationDispatchTask(new PromiseFailOnlyCallback(promise, description)) {
			@Override
			protected boolean execute(Conversation conversation) {
				Apptentive.removeCustomDeviceData(key);
				promise.resolve(true);
				return true;
			}
		}, description);
	}

	//endregion

	//region Helpers

	private static @Nullable Map<String, Object> toHashMap(ReadableMap map) {
		return map != null ? map.toHashMap() : null;
	}

	private static boolean checkRegistered(Promise promise, String message, Object... args) {
		if (!ApptentiveInternal.isApptentiveRegistered()) {
			promise.reject(CODE_APPTENTIVE, StringUtils.format("Unable to %s: Apptentive instance is not properly initialized", StringUtils.format(message, args)));
			return false;
		}

		return true;
	}

	private Context getContext() {
		return reactContextWrapper.getContext();
	}

	private static abstract class PromiseCallback implements Apptentive.BooleanCallback {
		final Promise promise;

		private PromiseCallback(Promise promise) {
			this.promise = promise;
		}
	}

	private static class PromiseBooleanCallback extends PromiseCallback {
		private PromiseBooleanCallback(Promise promise) {
			super(promise);
		}

		@Override
		public void onFinish(boolean result) {
			if (promise != null) {
				promise.resolve(result);
			}
		}
	}

	private static class PromiseFailOnlyCallback extends PromiseBooleanCallback {
		private final String message;

		private PromiseFailOnlyCallback(Promise promise, String message) {
			super(promise);
			this.message = message;
		}

		@Override
		public void onFinish(boolean result) {
			if (!result) {
				if (promise != null) {
					promise.reject(CODE_APPTENTIVE, message);
				}
			}
		}
	}

	//endregion
}
