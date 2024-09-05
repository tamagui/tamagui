## React Native Lucide Icons

[![npm](https://img.shields.io/npm/v/@tamagui/lucide-icons.svg)](https://www.npmjs.com/package/@tamagui/lucide-icons)

#### Simply beautiful SVG icons as React Native SVG components.
This repository is a copy of the [React Feather](https://github.com/colebemis/react-feather) project.

The main difference between them is that this project outputs React Native SVG components that will render on React Native platforms.

### Installation
    npm install @tamagui/lucide-icons --save

You will also need to ensure you have installed [React Native SVG](https://github.com/react-native-community/react-native-svg) into your project.

#### Usage

```javascript
import { Camera } from '@tamagui/lucide-icons';

class MyClass extends React.Component {
  render() {
    return <Camera />
  }
}
```
If you are using WebPack, you can import only one icon.
```javascript
import Camera from '@tamagui/lucide-icons/dist/icons/camera';

class MyClass extends React.Component {
  render() {
    return <Camera />
  }
}
```
If you can't use ES6 imports, it's possible to include icons from the compiled folder ./dist.
```javascript
var Camera = require('@tamagui/lucide-icons/dist/icons/camera').default;

var MyComponent = React.createClass({
  render: function () {
    return (
      <Camera />
    );
  }
});
```
You can also include the whole icon pack:

```javascript
import * as Icon from '@tamagui/lucide-icons';

class MyClass extends React.Component {
  render() {
    return <Icon.Camera />
  }
}
```
Icons can be configured with inline props:
```javascript
<Icon.AlertCircle color="red" size={48} />
```
