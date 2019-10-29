require 'json'
pjson = JSON.parse(File.read('package.json'))

Pod::Spec.new do |s|

  s.name            = "Apptentive"
  s.version         = pjson["version"]
  s.homepage        = "https://www.npmjs.com/package/react-native-apptentive-module"
  s.summary         = pjson["description"]
  s.license         = pjson["license"]
  s.author          = { "Apptentive" => "support@apptentive.com" }
  
  s.ios.deployment_target = '8.0'
  s.tvos.deployment_target = '9.2'

  s.source          = { :git => "https://github.com/longgame/apptentive-react-native.git" } 
  s.source_files    = '*.{h,m}'
  s.preserve_paths  = "**/*.js"

  s.dependency 'React'
end
