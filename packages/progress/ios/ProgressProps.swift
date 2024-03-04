import SwiftUI
import ExpoModulesCore

class ProgressProps: ObservableObject {
  @Published var value: Double = 0
  @Published var max: Double = 1
}

