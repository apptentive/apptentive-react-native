import Foundation
import ApptentiveKit

@objc(ApptentiveModule) class ApptentiveModule: RCTEventEmitter, @unchecked Sendable {

  // Register the Apptentive iOS SDK
  @objc(register:resolver:rejecter:)
  func register(_ configuration: Dictionary<String,Any>, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    guard let distributionName = configuration["distributionName"] as? String,
          let distributionVersion = configuration["distributionVersion"] as? String
    else {
      return reject("Apptentive Error", "Internal error: missing distribution information", nil)
    }

    Task { @MainActor in
      Apptentive.shared.distributionName = distributionName
      Apptentive.shared.distributionVersion = distributionVersion
    }

    guard let apptentiveKey = configuration["apptentiveKey"] as? String,
          let apptentiveSignature = configuration["apptentiveSignature"] as? String
    else {
      return reject("Apptentive Error", "Missing key or signature", nil)
    }

    var environment: Apptentive.Environment = .production
    if let overrideBaseURLString = configuration["overrideBaseURL"] as? String, let overrideBaseURL = URL(string: overrideBaseURLString) {
      environment = .custom(overrideBaseURL)
    }

    let region = (configuration["region"] as? String).flatMap { Apptentive.Region(rawValue: $0) } ?? .us

    Task {
      do {
        try await Apptentive.shared.register(with: .init(key: apptentiveKey, signature: apptentiveSignature), region: region, environment: environment)
        resolve(true)
      } catch let error {
        reject("Apptentive Error", "Could not register Apptentive", error)
      }
    }
  }

  // Engage an event by an event name string
  @objc(engage:resolver:rejecter:)
  func engage(_ event: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task {
      do {
        let launchedInteraction = try await Apptentive.shared.engage(event: Event(name: event))
        resolve(launchedInteraction)
      } catch let error {
        reject("Apptentive Error", "Error engaging event \(event)", error)
      }
    }
  }

  // Show the Apptentive Message Center
  @objc(showMessageCenter:rejecter:)
  func showMessageCenter(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task {
      do {
        let launchedMessageCenter = try await Apptentive.shared.presentMessageCenter(from: nil)
        resolve(launchedMessageCenter)
      } catch let error {
        reject("Apptentive Error", "Error presenting Message Center.", error)
      }
    }
  }

  // Set person name
  @objc(setPersonName:resolver:rejecter:)
  func setPersonName(_ name: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task { @MainActor in
      Apptentive.shared.personName = name
      resolve(true)
    }
  }

  // Get person name, empty string is there is none
  @objc(getPersonName:rejecter:)
  func getPersonName(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task { @MainActor in
      resolve(Apptentive.shared.personName)
    }
  }

  // Set person email
  @objc(setPersonEmail:resolver:rejecter:)
  func setPersonEmail(_ email: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task { @MainActor in
      Apptentive.shared.personEmailAddress = email
      resolve(true)
    }
  }

  // Get person email, empty string is there is none
  @objc(getPersonEmail:rejecter:)
  func getPersonEmail(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task { @MainActor in
      resolve(Apptentive.shared.personEmailAddress)
    }
  }

  // Add person custom data based on key string and value of type bool, number, or string
  @objc(addCustomPersonData:value:resolver:rejecter:)
  func addCustomPersonData(_ key: String, value: Any, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task { @MainActor in
      if let value_number = value as? NSNumber, CFGetTypeID(value_number) == CFBooleanGetTypeID() {
        Apptentive.shared.personCustomData[key] = value_number as? Bool
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
  }

  // Remove person custom data based on key string
  @objc(removeCustomPersonData:resolver:rejecter:)
  func removeCustomPersonData(_ key: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task { @MainActor in
      Apptentive.shared.personCustomData[key] = nil
      resolve(true)
    }
  }

  // Add device custom data based on key string and value of type bool, number, or string
  @objc(addCustomDeviceData:value:resolver:rejecter:)
  func addCustomDeviceData(_ key: String, value: Any, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task { @MainActor in
      if let value_number = value as? NSNumber, CFGetTypeID(value_number) == CFBooleanGetTypeID() {
        Apptentive.shared.deviceCustomData[key] = value_number as? Bool
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
  }

  // Remove device custom data based on key string
  @objc(removeCustomDeviceData:resolver:rejecter:)
  func removeCustomDeviceData(_ key: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task { @MainActor in
      Apptentive.shared.deviceCustomData[key] = nil
      resolve(true)
    }
  }

  // Check if an event name will launch an interaction
  @objc(canShowInteraction:resolver:rejecter:)
  func canShowInteraction(_ event: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
    Task {
      do {
        let canShowInteraction = try await Apptentive.shared.canShowInteraction(event: Event(name: event))
        resolve(canShowInteraction)
      } catch let error {
        reject("Apptentive Error", "Error checking if event \(event) can launch an Apptentive interaction.", error)
      }
    }
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
    Task { @MainActor in
      resolve(Apptentive.shared.unreadMessageCount)
    }
  }

  // MARK: - Events

  struct EventName {
    static let unreadMessageCountChanged = "onUnreadMessageCountChanged"
  }

  private var observation: NSKeyValueObservation?

  override func constantsToExport() -> [AnyHashable : Any]! {
    ["unreadMessageCountChangedEvent": "onUnreadMessageCountChanged"]
  }

  override func supportedEvents() -> [String]! {
    return [EventName.unreadMessageCountChanged]
  }

  override func startObserving() {
    Task { @MainActor in
      self.observation = Apptentive.shared.observe(\.unreadMessageCount, options: [.old, .new], changeHandler: { apptentive, change in
        if change.oldValue != change.newValue {
          Task {
            let unreadMessageCount = await MainActor.run { apptentive.unreadMessageCount }
            self.sendEvent(withName: EventName.unreadMessageCountChanged, body: ["count": unreadMessageCount])
          }
        }
      })
    }
  }

  override func stopObserving() {
    self.observation?.invalidate()
  }
}
