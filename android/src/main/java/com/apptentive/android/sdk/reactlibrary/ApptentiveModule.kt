package com.apptentive.android.sdk.reactlibrary

import android.app.Activity
import android.app.Application
import com.apptentive.android.sdk.Apptentive
import com.apptentive.android.sdk.ApptentiveConfiguration
import com.apptentive.android.sdk.ApptentiveLog
import com.apptentive.android.sdk.module.messagecenter.UnreadMessagesListener
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule


class ApptentiveModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
  UnreadMessagesListener {
  private val EVT_UNREAD_MESSAGE_COUNT_CHANGE = "onUnreadMessageCountChanged"

  // React context allows us to get the Application context and the current Activity context
  private var mReactContext: ReactApplicationContext = reactContext

  // Register the Apptentive Android SDK
  @ReactMethod
  fun register(credentials: ReadableMap, promise: Promise): Unit {
    try {
      Apptentive.register(getApplicationContext() , unpackCredentials(credentials))
      Apptentive.addUnreadMessagesListener(this);
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to register Apptentive instance.", e)
    }
  }

  // Engage an event by an event name string
  @ReactMethod
  fun engage(event: String, promise: Promise): Unit {
    try {
      Apptentive.engage(getActivityContext(), event) {
        promise.resolve(it)
      }
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to engage event $event.", e)
    }
  }

  // Show the Apptentive Message Center
  @ReactMethod
  fun showMessageCenter(promise: Promise): Unit {
    try {
      Apptentive.showMessageCenter(getActivityContext()) {
        promise.resolve(it)
      }
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to present Message Center.", e)
    }
  }

  // Set person name
  @ReactMethod
  fun setPersonName(name: String, promise: Promise): Unit {
    try {
      Apptentive.setPersonName(name)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to set person name.", e)
    }
  }

  // Get person name, empty string if there is none
  @ReactMethod
  fun getPersonName(promise: Promise): Unit {
    try {
      promise.resolve(Apptentive.getPersonName() ?: "")
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to get person name.", e)
    }
  }

  // Set person email
  @ReactMethod
  fun setPersonEmail(email: String, promise: Promise): Unit {
    try {
      Apptentive.setPersonEmail(email)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to set person email.", e)
    }
  }

  // Get person email, empty string if there is none
  @ReactMethod
  fun getPersonEmail(promise: Promise): Unit {
    try {
      promise.resolve(Apptentive.getPersonEmail() ?: "")
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to get person email.", e)
    }
  }

  // Add person custom data based on key string and value of type bool
  // Delegated from addCustomPersonData(key, value)
  @ReactMethod
  fun addCustomPersonDataBoolean(key: String, value: Boolean, promise: Promise): Unit {
    Apptentive.addCustomPersonData(key, value)
    promise.resolve(true)
  }

  // Add person custom data based on key string and value of type double
  // Delegated from addCustomPersonData(key, value)
  @ReactMethod
  fun addCustomPersonDataNumber(key: String, value: Double, promise: Promise): Unit {
    Apptentive.addCustomPersonData(key, value)
    promise.resolve(true)
  }

  // Add person custom data based on key string and value of type String
  // Delegated from addCustomPersonData(key, value)
  @ReactMethod
  fun addCustomPersonDataString(key: String, value: String, promise: Promise): Unit {
    Apptentive.addCustomPersonData(key, value)
    promise.resolve(true)
  }

  // Remove person custom data based on key string
  @ReactMethod
  fun removeCustomPersonData(key: String, promise: Promise): Unit {
    try {
      Apptentive.removeCustomPersonData(key)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to remove custom person data $key.", e)
    }
  }

  // Add device custom data based on key string and value of type bool
  // Delegated from addCustomPersonData(key, value)
  @ReactMethod
  fun addCustomDeviceDataBoolean(key: String, value: Boolean, promise: Promise): Unit {
    Apptentive.addCustomDeviceData(key, value)
    promise.resolve(true)
  }

  // Add device custom data based on key string and value of type double
  // Delegated from addCustomPersonData(key, value)
  @ReactMethod
  fun addCustomDeviceDataNumber(key: String, value: Double, promise: Promise): Unit {
    Apptentive.addCustomDeviceData(key, value)
    promise.resolve(true)
  }

  // Add device custom data based on key string and value of type string
  // Delegated from addCustomPersonData(key, value)
  @ReactMethod
  fun addCustomDeviceDataString(key: String, value: String, promise: Promise): Unit {
    Apptentive.addCustomDeviceData(key, value)
    promise.resolve(true)
  }

  // Remove device custom data based on key string
  @ReactMethod
  fun removeCustomDeviceData(key: String, promise: Promise): Unit {
    try {
      Apptentive.removeCustomDeviceData(key)
      promise.resolve(true)
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to remove custom device data $key.", e)
    }
  }

  // Check if an event name will launch an interaction
  @ReactMethod
  fun canShowInteraction(event: String, promise: Promise): Unit {
    try {
      Apptentive.queryCanShowInteraction(event) {
        promise.resolve(it)
      }
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to check if Apptentive interaction can be shown on event $event.", e)
    }
  }

  // Check if Message Center can be shown
  @ReactMethod
  fun canShowMessageCenter(promise: Promise): Unit {
    try {
      Apptentive.canShowMessageCenter {
        promise.resolve(it)
      }
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to check if Apptentive can launch Message Center.", e)
    }
  }

  // Get unread message count in Message Center
  @ReactMethod
  fun getUnreadMessageCount(promise: Promise): Unit {
    try {
      promise.resolve(Apptentive.getUnreadMessageCount())
    } catch (e: Exception) {
      promise.reject("Apptentive Error", "Failed to check number of unread messages in Message Center.", e)
    }
  }

  ////// Utility Functions

  // Set ApptentiveLogger log level
  private fun parseLogLevel(logLevel: String): ApptentiveLog.Level {
    println("APPTENTIVE TEST: Parsing log level: $logLevel")
    return when(logLevel) {
      "verbose" -> ApptentiveLog.Level.VERBOSE
      "debug" -> ApptentiveLog.Level.DEBUG
      "info" -> ApptentiveLog.Level.INFO
      "warn" -> ApptentiveLog.Level.WARN
      "error" -> ApptentiveLog.Level.ERROR
      else -> {
        println("APPTENTIVE ERROR: Unknown log level $logLevel, setting to info by default.")
        ApptentiveLog.Level.INFO
      }
    }
  }

  // Unpack dictionary to create and return ApptentiveConfiguration object
  private fun unpackCredentials(credentials: ReadableMap): ApptentiveConfiguration {
    // Key/Sig
    val apptentiveKey = credentials.getString("apptentiveKey")!!
    val apptentiveSignature = credentials.getString("apptentiveSignature")!!
    // Create configuration instance
    val apptentiveConfiguration = ApptentiveConfiguration(apptentiveKey, apptentiveSignature)
    // Set flags, or defaults if not present
    apptentiveConfiguration.logLevel = parseLogLevel(if (credentials.hasKey("logLevel")) credentials.getString("logLevel") ?: "info" else "info")
    apptentiveConfiguration.setShouldEncryptStorage(if (credentials.hasKey("shouldEncryptStorage")) credentials.getBoolean("shouldEncryptStorage") else false)
    apptentiveConfiguration.setShouldSanitizeLogMessages(if (credentials.hasKey("shouldSanitizeLogMessages")) credentials.getBoolean("shouldSanitizeLogMessages") else true)
    apptentiveConfiguration.isTroubleshootingModeEnabled = if (credentials.hasKey("troubleshootingModeEnabled")) credentials.getBoolean("troubleshootingModeEnabled") else true
    // Return configuration
    return apptentiveConfiguration
  }

  // Represents the name of the module
  override fun getName(): String { return "ApptentiveModule" }

  private fun getApplicationContext(): Application {
    return mReactContext.currentActivity?.applicationContext as Application
  }

  private fun getActivityContext(): Activity? {
    return mReactContext.currentActivity
  }

  override fun onUnreadMessageCountChanged(unreadMessages: Int) {
    var result = Arguments.createMap()

    result.putInt("count", unreadMessages)
    mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(EVT_UNREAD_MESSAGE_COUNT_CHANGE, result)
  }

  override fun hasConstants(): Boolean {
    return true
  }

  override fun getConstants(): MutableMap<String, Any>? {
    return mapOf<String, Any>("unreadMessageCountChangedEvent" to EVT_UNREAD_MESSAGE_COUNT_CHANGE).toMutableMap()
  }
}
