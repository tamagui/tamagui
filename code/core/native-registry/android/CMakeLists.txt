project(TamaguiRegistry)
cmake_minimum_required(VERSION 3.9.0)

set(PACKAGE_NAME tamaguiregistry)
set(CMAKE_CXX_STANDARD 20)

add_library(${PACKAGE_NAME} SHARED
  ../cpp/HybridTamaguiRegistry.cpp
)

# nitrogen autolinking (generated sources + NitroModules linkage)
include(${CMAKE_SOURCE_DIR}/../nitrogen/generated/android/tamaguiregistry+autolinking.cmake)

include_directories(
  "../cpp"
)

find_library(LOG_LIB log)

target_link_libraries(
  ${PACKAGE_NAME}
  ${LOG_LIB}
  android
)
