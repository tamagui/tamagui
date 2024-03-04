import SwiftUI

struct SelectView: View {
  @ObservedObject var props: SelectProps
  
  var body: some View {
    if #available(iOS 14.0, *) {
      Picker("", selection: $props.value) {
        ForEach(props.options, id: \.self) { option in
          if let label = option["label"], let value = option["value"] {
            Text(label).tag(value)
          }
        }
      }
      .pickerType(type: props.type)
      .onChange(of: props.value) { newValue in
        props.onValueChange([
          "value": newValue
        ])
      }
    }
  }
}


extension View {
  func pickerType(type: String) -> some View {
    modifier(PickerType(type: type))
  }
}


struct PickerType: ViewModifier {
  var type: String
  func body(content: Content) -> some View {
    switch(type) {
    case "wheel":
      return AnyView(content.pickerStyle(.wheel))
    case "segmented":
      return AnyView(content.pickerStyle(.segmented))
    case "menu":
      if #available(iOS 14.0, *) {
        return AnyView(content.pickerStyle(.menu))
      } else {
        return AnyView(content.pickerStyle(.segmented))
      }
    default:
      return AnyView(content.pickerStyle(.segmented))
    }
  }
}
