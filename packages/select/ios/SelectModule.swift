import ExpoModulesCore

public class TamaguiSelectModule: Module {
  public func definition() -> ModuleDefinition {
    Name("TamaguiSelect")
    View(SelectExpoView.self) {
      Events("onValueChange")
      Prop("type") { (view: SelectExpoView, prop: String?) in
        view.props.type = prop ?? "menu"
      }
      Prop("options") { (view: SelectExpoView, prop: [[String:String]]) in
        view.props.options = prop
      }
      Prop("value") { (view: SelectExpoView, prop: String) in
        view.props.value = prop
      }
    }
  }
}
