package com.apptentive.android.sdk.reactlibrary;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.support.annotation.Nullable;

import com.apptentive.android.sdk.Apptentive;
import com.apptentive.android.sdk.ApptentiveConfiguration;
import com.apptentive.android.sdk.ApptentiveInternal;
import com.apptentive.android.sdk.ApptentiveLog;
import com.apptentive.android.sdk.conversation.Conversation;
import com.apptentive.android.sdk.conversation.ConversationDispatchTask;
import com.apptentive.android.sdk.lifecycle.ApptentiveActivityLifecycleCallbacks;
import com.apptentive.android.sdk.module.messagecenter.UnreadMessagesListener;
import com.apptentive.android.sdk.util.ObjectUtils;
import com.apptentive.android.sdk.util.StringUtils;
import com.facebook.react.bridge.ApptentiveReactApplicationContextWrapper;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;

import static com.apptentive.android.sdk.ApptentiveHelper.dispatchConversationTask;

public class RNApptentiveModule extends ReactContextBaseJavaModule implements UnreadMessagesListener, Apptentive.AuthenticationFailedListener {
	private static final String CODE_APPTENTIVE = "Apptentive";
	private static final String EVT_UNREAD_MESSAGE_COUNT_CHANGE = "onUnreadMessageCountChanged";
	private static final String EVT_AUTH_FAILED = "onAuthenticationFailed";

	private final ApptentiveReactApplicationContextWrapper reactContextWrapper;

	public RNApptentiveModule(ReactApplicationContext reactContext) {
		super(reactContext);
		reactContextWrapper = new ApptentiveReactApplicationContextWrapper(reactContext);
	}

	@Override
	public String getName() {
		return "RNApptentiveModule";
	}

	//region JavaScript bindings

	@ReactMethod
	public void register(ReadableMap configurationMap, Promise promise) {
		try {
			Application application = reactContextWrapper.getApplication();

			// TODO: override log level
			if (ApptentiveInternal.isApptentiveRegistered()) {
				promise.reject(CODE_APPTENTIVE, "Apptentive instance already initialized");
				return;
			}

			Map<String, Object> config = toHashMap(configurationMap);
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

			ApptentiveConfiguration configuration = new ApptentiveConfiguration(apptentiveKey, apptentiveSignature);
			ApptentiveLog.Level logLevel = parseLogLevel(ObjectUtils.as(config.get("logLevel"), String.class));
			if (logLevel != null) {
				configuration.setLogLevel(logLevel);
			}
			configuration.setShouldSanitizeLogMessages(getBoolean(config, "logLevel", false));
			Apptentive.register(application, configuration);

			ApptentiveInternal instance = ObjectUtils.as(ApptentiveInternal.getInstance(), ApptentiveInternal.class);
			if (instance == null) {
				promise.reject(CODE_APPTENTIVE, "Apptentive instance was not initialized");
				return;
			}

			Activity currentActivity = reactContextWrapper.getCurrentActivity();
			if (currentActivity == null) {
				promise.reject(CODE_APPTENTIVE, "Apptentive instance was not initialized: current activity is null");
				return;
			}

			ApptentiveActivityLifecycleCallbacks lifecycleCallbacks = ApptentiveActivityLifecycleCallbacks.getInstance();
			lifecycleCallbacks.onActivityCreated(currentActivity, null);
			lifecycleCallbacks.onActivityStarted(currentActivity);
			lifecycleCallbacks.onActivityResumed(currentActivity);

			Apptentive.addUnreadMessagesListener(this);
			Apptentive.setAuthenticationFailedListener(this);
			promise.resolve(Boolean.TRUE);
		} catch (Exception e) {
			promise.reject(CODE_APPTENTIVE, "Exception while initialized Apptentive", e);
		}
	}

	private ApptentiveLog.Level parseLogLevel(String logLevel) {
		if (!StringUtils.isNullOrEmpty(logLevel)) {
			switch (logLevel.toLowerCase()) {
				case "verbose":
					return ApptentiveLog.Level.VERBOSE;
				case "debug":
					return ApptentiveLog.Level.DEBUG;
				case "info":
					return ApptentiveLog.Level.INFO;
				case "warn":
				case "warning":
					return ApptentiveLog.Level.WARN;
				case "error":
					return ApptentiveLog.Level.ERROR;
			}
		}

		return null;
	}

	private boolean getBoolean(Map<String, Object> config, String key, boolean defaultValue) {
		Boolean value = ObjectUtils.as(config.get(key), Boolean.class);
		return value != null ? value : defaultValue;
	}

	@ReactMethod
	public void presentMessageCenter(ReadableMap customData, Promise promise) {
		try {
			if (!checkRegistered(promise, "present message center")) {
				return;
			}

			Apptentive.showMessageCenter(getContext(), new PromiseBooleanCallback(promise), toHashMap(customData));
		} catch (Exception e) {
			promise.reject(CODE_APPTENTIVE, "Exception while presenting message center", e);
		}
	}

	@ReactMethod
	public void canShowMessageCenter(Promise promise) {
		try {
			if (!checkRegistered(promise, "check if message center can be presented")) {
				return;
			}

			Apptentive.canShowMessageCenter(new PromiseBooleanCallback(promise));
		} catch (Exception e) {
			promise.reject(CODE_APPTENTIVE, "Exception while querying message center", e);
		}
	}

	@ReactMethod
	public void canShowInteraction(String event, Promise promise) {
		try {
			if (!checkRegistered(promise, "check if interaction '%s' can be showed", event)) {
				return;
			}

			Apptentive.queryCanShowInteraction(event, new PromiseBooleanCallback(promise));
		} catch (Exception e) {
			promise.reject(CODE_APPTENTIVE, "Exception while showing interaction", e);
		}
	}

	@ReactMethod
	public void engage(String event, ReadableMap customData, Promise promise) {
		try {
			if (!checkRegistered(promise, "engage event '%s'", event)) {
				return;
			}

			Apptentive.engage(getContext(), event, new PromiseBooleanCallback(promise), toHashMap(customData));
		} catch (Exception e) {
			promise.reject(CODE_APPTENTIVE, "Exception while engaging event", e);
		}
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

	@ReactMethod
	public void logIn(String token, final Promise promise) {
		try {
			if (!checkRegistered(promise, "login")) {
				return;
			}

			Apptentive.login(token, new Apptentive.LoginCallback() {
				@Override
				public void onLoginFinish() {
					promise.resolve(true);
				}

				@Override
				public void onLoginFail(String errorMessage) {
					promise.reject(CODE_APPTENTIVE, errorMessage);
				}
			});
		} catch (Exception e) {
			promise.reject(CODE_APPTENTIVE, "Exception while login", e);
		}
	}

	@ReactMethod
	public void logOut(final Promise promise) {
		try {
			if (!checkRegistered(promise, "logout")) {
				return;
			}

			Apptentive.logout();
			promise.resolve(true);
		} catch (Exception e) {
			promise.reject(CODE_APPTENTIVE, "Exception while logout", e);
		}
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

	private void sendEvent(String name, Object... params) {
		WritableMap args = Arguments.createMap();
		for (int i = 0; i < params.length; i += 2) {
			String key = (String) params[i];
			Object value = params[i + 1];
			if (value instanceof String) {
				args.putString(key, (String) value);
			} else if (value instanceof Integer) {
				args.putInt(key, (Integer) value);
			} else if (value instanceof Boolean) {
				args.putBoolean(key, (Boolean) value);
			} else {
				throw new IllegalArgumentException("Unexpected value type: " + value);
			}
		}
		reactContextWrapper.sendEvent(name, args);
	}

	private Context getContext() {
		return reactContextWrapper.getContext();
	}

	//region Unread Message Listener

	@Override
	public void onUnreadMessageCountChanged(int unreadMessages) {
		sendEvent(EVT_UNREAD_MESSAGE_COUNT_CHANGE, "count", unreadMessages);
	}

	//endregion

	//region Auth failed listener

	@Override
	public void onAuthenticationFailed(Apptentive.AuthenticationFailedReason reason) {
		sendEvent(EVT_AUTH_FAILED, "reason", getPrettyReason(reason));
	}

	private static String getPrettyReason(Apptentive.AuthenticationFailedReason reason) {
		String raw = reason.toString();
		String[] tokens = raw.split("_");
		StringBuilder result = new StringBuilder();
		for (String token : tokens) {
			if (result.length() > 0) {
				result.append(' ');
			}
			result.append(Character.toUpperCase(token.charAt(0)));
			result.append(token.substring(1).toLowerCase());
		}
		return result.toString();
	}

	//endregion

	//region Promise Callbacks

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