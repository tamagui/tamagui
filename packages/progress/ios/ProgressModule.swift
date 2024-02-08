import ExpoModulesCore

public class TamaguiProgressModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Progress")
    View(ProgressExpoView.self) {
      Prop("value") { (view: ProgressExpoView, prop: Double) in
        view.props.value = prop
      }
      Prop("max") { (view: ProgressExpoView, prop: Double?) in
        view.props.max = prop ?? 1
      }
      Prop("accent") { (view: ProgressExpoView, prop: UIColor?) in
        view.props.accent = prop
      }
    }
  }
}
