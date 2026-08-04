#include <jni.h>
#include "tamaguiregistryOnLoad.hpp"

// called by System.loadLibrary("tamaguiregistry"); registers all nitro hybrids
JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::tamagui::registry::initialize(vm);
}
