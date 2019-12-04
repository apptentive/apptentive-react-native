import XCTest
import OHHTTPStubs

class sample61UITests: XCTestCase {
    override func setUp() {
        // Put setup code here. This method is called before the invocation of each test method in the class.

        // In UI tests it is usually best to stop immediately when a failure occurs.
        continueAfterFailure = false

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
    }

    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }

    // NOTE: This test assumes there is a valid Apptentive key / signature.
    func testNoInteractionForEvent() {
        // UI tests must launch the application that they test.
        let app = XCUIApplication()
        app.launch()
        XCTAssert(!app.alerts.element.staticTexts["Please, provide Apptentive Key"].exists)
        app.textFields["input-event-name"].tap()
        app.typeText("fake")
        app.buttons["button-engage"].tap()
        XCTAssertEqual(app.alerts.element.label, "Interaction")
        XCTAssert(app.alerts.element.staticTexts["Interaction \"fake\" was not engaged"].exists)
    }

    func testInteractionForEvent() {
      stub(condition: isHost("api.apptentive.com") && isPath("/conversations")) { request in
        return OHHTTPStubsResponse(
          fileAtPath: OHPathForFile("conversations.json", type(of: self))!,
          statusCode: 201,
          headers: ["Content-Type":"application/json"]
        )
      }

      stub(condition: isHost("api.apptentive.com") && isPath("/conversations/5dd709938bc3a004a50f410e/configuration")) { request in
        return OHHTTPStubsResponse(
          fileAtPath: OHPathForFile("conversations-5dd709938bc3a004a50f410e-configuration.json", type(of: self))!,
          statusCode: 200,
          headers: ["Content-Type":"application/json"]
        )
      }

      stub(condition: isHost("api.apptentive.com") && isPath("/conversations/5dd709938bc3a004a50f410e/interactions")) { request in
        return OHHTTPStubsResponse(
          fileAtPath: OHPathForFile("conversations-5dd709938bc3a004a50f410e-interactions.json", type(of: self))!,
          statusCode: 200,
          headers: ["Content-Type":"application/json"]
        )
      }

      stub(condition: isHost("api.apptentive.com") && isPath("/conversations/5dd709938bc3a004a50f410e/events")) { request in
        return OHHTTPStubsResponse(
          fileAtPath: OHPathForFile("conversations-5dd709938bc3a004a50f410e-events.json", type(of: self))!,
          statusCode: 201,
          headers: ["Content-Type":"application/json"]
        )
      }

      // UI tests must launch the application that they test.
      let app = XCUIApplication()
      app.launch()
      XCTAssert(!app.alerts.element.staticTexts["Please, provide Apptentive Key"].exists)
      app.textFields["input-event-name"].tap()
      app.typeText("note")
      app.buttons["button-engage"].tap()
      XCTAssertEqual(app.alerts.element.label, "Interaction")
      XCTAssert(app.alerts.element.staticTexts["Interaction \"fake\" was not engaged"].exists)
    }

  
    func testLaunchPerformance() {
        if #available(macOS 10.15, iOS 13.0, tvOS 13.0, *) {
            // This measures how long it takes to launch your application.
            measure(metrics: [XCTOSSignpostMetric.applicationLaunch]) {
                XCUIApplication().launch()
            }
        }
    }
}
