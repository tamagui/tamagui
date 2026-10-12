project(TamaguiRegistry)
cmake_minimum_required(VERSION 3.9.0)

set(PACKAGE_NAME tamaguiregistry)
set(CMAKE_CXX_STANDARD 20)

add_library(${PACKAGE_NAME} SHARED
  src/main/cpp/cpp-adapter.cpp
  ../cpp/HybridTamaguiRegistry.cpp
)

# nitrogen autolinking (generated sources + NitroModules linkage)
include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/tamaguiregistry+autolinking.cmake)

include_directories(
  "../cpp"
)

# the reactnative prefab ships the android text headers (ParagraphProps,
# ParagraphState) under platform/android without putting them on its path
get_target_property(RN_INCLUDE_DIRS ReactAndroid::reactnative INTERFACE_INCLUDE_DIRECTORIES)
foreach(dir ${RN_INCLUDE_DIRS})
  include_directories(
    "${dir}/react/renderer/components/text/platform/android"
    "${dir}/react/renderer/textlayoutmanager/platform/android"
  )
endforeach()

find_library(LOG_LIB log)

target_link_libraries(
  ${PACKAGE_NAME}
  ${LOG_LIB}
  android
)
