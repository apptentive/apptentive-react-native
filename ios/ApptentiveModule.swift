import Foundation
import ApptentiveKit
// import "ApptentiveModule.h"

@objc(ApptentiveModule) class ApptentiveModule: NSObject {

  // Register the Apptentive iOS SDK
  @objc(register:resolver:rejecter:)
  func register(_ configuration: Dictionary<String,Any>, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    guard let distributionName = configuration["distributionName"] as? String,
          let distributionVersion = configuration["distributionVersion"] as? String
    else {
      return reject("Apptentive Error", "Internal error: missing distribution information", nil)
    }

    Apptentive.shared.distributionName = distributionName
    Apptentive.shared.distributionVersion = distributionVersion

    if let logLevel = configuration["logLevel"] as? String {
      guard let rnLogLevel = RNLogLevel(rawValue: logLevel) else {
      return reject("Apptentive Error", "Unrecognized log level value “\(configuration["logLevel"] ?? "<none>")”", nil)
      }

      ApptentiveLogger.logLevel = rnLogLevel.logLevel
    }

    guard let apptentiveKey = configuration["apptentiveKey"] as? String,
          let apptentiveSignature = configuration["apptentiveSignature"] as? String
    else {
      return reject("Apptentive Error", "Missing key or signature", nil)
    }

    Apptentive.shared.register(with: .init(key: apptentiveKey, signature: apptentiveSignature), completion: { (result) -> Void in
      switch result {
      case .success(let success):
        resolve(success)
      case .failure(let error):
        reject("Apptentive Error", "Could not register Apptentive", error)
      }
    })
  }

  // Engage an event by an event name string
  @objc(engage:resolver:rejecter:)
  func engage(_ event: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Apptentive.shared.engage(event: Event(name: event), completion: { (result) -> Void in
      switch result {
      case .success(let launchedInteraction):
        resolve(launchedInteraction)
      case .failure(let error):
        reject("Apptentive Error", "Error engaging event \(event)", error)
      }
    })
  }

  // Show the Apptentive Message Center
  @objc(showMessageCenter:rejecter:)
  func showMessageCenter(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Apptentive.shared.presentMessageCenter(from: nil, completion: { (result) -> Void in
      switch result {
      case .success(let launchedMessageCenter):
        resolve(launchedMessageCenter)
      case .failure(let error):
        reject("Apptentive Error", "Error presenting Message Center.", error)
      }
    })
  }

  // Set person name
  @objc(setPersonName:resolver:rejecter:)
  func setPersonName(_ name: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Apptentive.shared.personName = name
    resolve(true)
  }

  // Get person name, empty string is there is none
  @objc(getPersonName:rejecter:)
  func getPersonName(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    resolve(Apptentive.shared.personName ?? "")
  }

  // Set person email
  @objc(setPersonEmail:resolver:rejecter:)
  func setPersonEmail(_ email: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Apptentive.shared.personEmailAddress = email
    resolve(true)
  }

  // Get person email, empty string is there is none
  @objc(getPersonEmail:rejecter:)
  func getPersonEmail(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    resolve(Apptentive.shared.personEmailAddress ?? "")
  }

  // Add person custom data based on key string and value of type bool, number, or string
  @objc(addCustomPersonData:value:resolver:rejecter:)
  func addCustomPersonData(_ key: String, value: Any, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    if let value_bool = value as? Bool {
      Apptentive.shared.personCustomData[key] = value_bool
    }
    else if let value_int = value as? Int {
      Apptentive.shared.personCustomData[key] = value_int
    }
    else if let value_double = value as? Double {
      Apptentive.shared.personCustomData[key] = value_double
    }
    else if let value_float = value as? Float {
      Apptentive.shared.personCustomData[key] = value_float
    }
    else if let value_str = value as? String {
      Apptentive.shared.personCustomData[key] = value_str
    } else {
      let dataType = type(of: value)
      reject("Apptentive Error","Invalid type of person custom data: \(dataType)", nil)
      return
    }
    resolve(true)
  }

  // Remove person custom data based on key string
  @objc(removeCustomPersonData:resolver:rejecter:)
  func removeCustomPersonData(_ key: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Apptentive.shared.personCustomData[key] = nil
    resolve(true)
  }

  // Add device custom data based on key string and value of type bool, number, or string
  @objc(addCustomDeviceData:value:resolver:rejecter:)
  func addCustomDeviceData(_ key: String, value: Any, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    if let value_bool = value as? Bool {
      Apptentive.shared.deviceCustomData[key] = value_bool
    }
    else if let value_int = value as? Int {
      Apptentive.shared.deviceCustomData[key] = value_int
    }
    else if let value_double = value as? Double {
      Apptentive.shared.deviceCustomData[key] = value_double
    }
    else if let value_float = value as? Float {
      Apptentive.shared.deviceCustomData[key] = value_float
    }
    else if let value_str = value as? String {
      Apptentive.shared.deviceCustomData[key] = value_str
    } else {
      let dataType = type(of: value)
      reject("Apptentive Error","Invalid type of device custom data: \(dataType)", nil)
      return
    }
    resolve(true)

  }

  // Remove device custom data based on key string
  @objc(removeCustomDeviceData:resolver:rejecter:)
  func removeCustomDeviceData(_ key: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Apptentive.shared.deviceCustomData[key] = nil
    resolve(true)
  }

  // Check if an event name will launch an interaction
  @objc(canShowInteraction:resolver:rejecter:)
  func canShowInteraction(_ event: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Apptentive.shared.canShowInteraction(event: Event(name: event), completion: { (result) -> Void in
      switch result {
      case .success(let canShowInteraction):
        resolve(canShowInteraction)
      case .failure(let error):
        reject("Apptentive Error", "Error checking if event \(event) can launch an Apptentive interaction.", error)
      }
    })
  }

  // Check if Message Center can be shown
  // Not implemented in iOS
  @objc(canShowMessageCenter:rejecter:)
  func canShowMessageCenter(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    // Not Implemented
    resolve(true)
  }

  // Get unread message count in Message Center
  @objc(getUnreadMessageCount:rejecter:)
  func getUnreadMessageCount(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    resolve(Apptentive.shared.unreadMessageCount)
  }

  // Avoid RN Module warning
  @objc static func requiresMainQueueSetup() -> Bool { return false }

  private enum RNLogLevel: String {
    case verbose
    case debug
    case info
    case warn
    case error
    case crit

    var logLevel: LogLevel {
      switch self {
      case .verbose, .debug:
        return .debug
      case .info:
        return .info
      case .warn:
        return .warning
      case .error:
        return .error
      case .crit:
        return .critical
      }
    }
  }
}
