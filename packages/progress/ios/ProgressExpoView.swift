import ExpoModulesCore
import SwiftUI

class ProgressExpoView: ExpoView {
  let props: ProgressProps
  
  required init(appContext: AppContext? = nil) {
    props = ProgressProps()
    let hostingController = UIHostingController(rootView: ProgressViewView(props: props))
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
