require "json"

package = JSON.parse(File.read(File.join(__dir__, "..", "package.json")))

Pod::Spec.new do |s|
  s.name            = "TamaguiStyleRegistry"
  s.version         = package["version"]
  s.summary         = package["description"]
  s.homepage        = package["homepage"] || "https://tamagui.dev"
  s.license         = package["license"]
  s.authors         = package["author"] || { "Tamagui" => "team@tamagui.dev" }
  s.platforms       = { :ios => "13.0" }
  s.source          = { :git => package["repository"]["url"], :tag => "v#{s.version}" }

  s.source_files    = "*.{h,mm}", "../cpp/*.{h,cpp}"
  s.requires_arc    = true

  s.pod_target_xcconfig = {
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++20",
    "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\" \"$(PODS_ROOT)/RCT-Folly\" \"$(PODS_ROOT)/Headers/Private/React-Core\" \"$(PODS_ROOT)/Headers/Public/React-hermes\"",
    "GCC_WARN_PEDANTIC" => "NO"
  }

  # Use install_modules_dependencies helper (React Native 0.71+)
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
    s.dependency "React-RCTFabric"
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  end
end
