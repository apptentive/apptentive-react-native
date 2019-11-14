import XCTest

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
    func testExample() {
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

    func testLaunchPerformance() {
        if #available(macOS 10.15, iOS 13.0, tvOS 13.0, *) {
            // This measures how long it takes to launch your application.
            measure(metrics: [XCTOSSignpostMetric.applicationLaunch]) {
                XCUIApplication().launch()
            }
        }
    }
}
