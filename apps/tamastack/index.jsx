import { ExpoRoot } from "expo-router";

console.log('ExpoRoot', ExpoRoot)

// This file should only import and register the root. No components or exports
// should be added here.
// import { renderRootComponent } from "expo-router/src/renderRootComponent";
// import { ExpoRoot } from "expo-router";
// import Head from "expo-router/head";
// const modules = import.meta.glob('./app/*.tsx')

// console.log('modules', modules)

// // Must be exported or Fast Refresh won't update the context
// export function App() {
//   return (
//     // <Head.Provider>
//     <ExpoRoot context={ctx} />
//     // </Head.Provider>
//   );
// }


// renderRootComponent(App);


import { AppRegistry, LogBox } from 'react-native'
import { App } from './src/App'

AppRegistry.registerComponent('main', () => App)

LogBox.install()

