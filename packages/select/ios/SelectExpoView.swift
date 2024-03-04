import ExpoModulesCore
import SwiftUI

class SelectExpoView: ExpoView {
  let props: SelectProps
  let onValueChange = EventDispatcher()
  
  required init(appContext: AppContext? = nil) {
    props = SelectProps(onValueChange: onValueChange)
    let hostingController = UIHostingController(rootView: SelectView(props: props))
    super.init(appContext: appContext)
    hostingController.view.translatesAutoresizingMaskIntoConstraints = false
    hostingController.view.backgroundColor = .clear
    addSubview(hostingController.view)
    NSLayoutConstraint.activate([
      hostingController.view.topAnchor.constraint(equalTo: self.topAnchor),
      hostingController.view.bottomAnchor.constraint(equalTo: self.bottomAnchor),
      hostingController.view.leftAnchor.constraint(equalTo: self.leftAnchor),
      hostingController.view.rightAnchor.constraint(equalTo: self.rightAnchor)
    ])
  }
}
