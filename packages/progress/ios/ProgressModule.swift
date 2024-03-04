import ExpoModulesCore

public class TamaguiProgressModule: Module {
  public func definition() -> ModuleDefinition {
    Name("TamaguiProgress")
    View(ProgressExpoView.self) {
      Prop("value") { (view: ProgressExpoView, prop: Double) in
        view.props.value = prop
      }
      Prop("max") { (view: ProgressExpoView, prop: Double?) in
        view.props.max = prop ?? 1
      }
    }
  }
}
