require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

Pod::Spec.new do |s|
  s.name         = "TamaguiStyleRegistry"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/tamagui/tamagui"
  s.license      = package["license"]
  s.authors      = { "Tamagui" => "hello@tamagui.dev" }
  s.platforms    = { :ios => "13.4" }
  s.source       = { :git => package["repository"]["url"], :tag => "#{s.version}" }

  # include both iOS and C++ source files
  s.source_files = "ios/**/*.{h,m,mm}", "cpp/**/*.{h,hpp,cpp}"
  s.requires_arc = true

  # C++ settings
  s.pod_target_xcconfig = {
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20"
  }

  # let React Native handle all the dependencies
  install_modules_dependencies(s)
end
