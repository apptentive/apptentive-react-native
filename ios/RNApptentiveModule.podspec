
Pod::Spec.new do |s|
  s.name         = "RNApptentiveModule"
  s.version      = "5.0.0"
  s.summary      = "Apptentive React Native Module"
  s.description  = "Apptentive React Native Module for iOS/Andorid"
  s.homepage     = "https://www.apptentive.com/"
  s.license      = { :type => "BSD Clause-", :file => "LICENSE" }
  s.author       = { "Apptentive SDK Team" => "sdks@apptentive.com" }
  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/apptentive/apptentive-react-native.git", :tag => "master" }
  s.source_files  = "**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "apptentive-ios", "5.0.3"
end

  