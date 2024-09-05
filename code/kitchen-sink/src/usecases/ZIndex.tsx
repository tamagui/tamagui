import React from "react";
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button, TooltipSimple } from 'tamagui';

export function ZIndex() {
  return <TooltipInModal />;
}

export function TooltipInModal() {
  return (
    <>
      <Gap />
      <SimpleModal />
      <Gap />
      <TransparentModal />
      <Gap />
      <AnimatedModalStack />
      <Gap />
      <Modalception />
    </>);

}

function Gap() {
  return <View style={styles.gap} />;
}

function AnimatedModal({ animationType }) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <>
      <Button onPress={() => setIsVisible(true)}>Animation {animationType}</Button>
      <Modal
        animationType={animationType}
        onRequestClose={() => setIsVisible(false)}
        visible={isVisible}>

        <View style={styles.container}>
          <Text>Modal with "animationType" of "{animationType}"</Text>
          <Gap />
          <TooltipSimple label="test tooltip">
            <Button onPress={() => setIsVisible(false)}>Close</Button>
          </TooltipSimple>
        </View>
      </Modal>
    </>);

}

function AnimatedModalStack() {
  return (
    <>
      <AnimatedModal animationType={'none'} />
      <Gap />
      <AnimatedModal animationType={'slide'} />
      <Gap />
      <AnimatedModal animationType={'fade'} />
    </>);

}

const WIGGLE_ROOM = 128;

function Modalception({ depth = 1 }) {
  const [isVisible, setIsVisible] = React.useState(false);

  const offset = React.useMemo(() => {
    return {
      top: Math.random() * WIGGLE_ROOM - WIGGLE_ROOM / 2,
      left: Math.random() * WIGGLE_ROOM - WIGGLE_ROOM / 2
    };
  }, []);

  return (
    <>
      <Button onPress={() => setIsVisible(true)}>Open modal</Button>
      <Modal onRequestClose={() => setIsVisible(false)} transparent visible={isVisible}>
        <View style={[styles.containeralt, offset]}>
          <Text>This is in Modal {depth}</Text>
          <Gap />
          {isVisible ? <Modalception depth={depth + 1} /> : null}
          <Gap />
          <TooltipSimple label="test tooltip">
            <Button color="red" onPress={() => setIsVisible(false)}>
              Close
            </Button>
          </TooltipSimple>
        </View>
      </Modal>
    </>);

}

function SimpleModal() {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <>
      <Button onPress={() => setIsVisible(true)}>Simple modal</Button>
      <Modal onRequestClose={() => setIsVisible(false)} visible={isVisible}>
        <View style={styles.container}>
          <Text>Hello, World!</Text>
          <Gap />
          <TooltipSimple label="test tooltip">
            <Button onPress={() => setIsVisible(false)}>Close</Button>
          </TooltipSimple>
        </View>
      </Modal>
    </>);

}

function TransparentModal() {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <>
      <Button onPress={() => setIsVisible(true)}>Transparent modal</Button>
      <Modal onRequestClose={() => setIsVisible(false)} transparent visible={isVisible}>
        <View style={styles.containeralt}>
          <Text style={{ textAlign: 'center' }}>Modal with "transparent" value</Text>
          <Gap />

          <TooltipSimple label="test tooltip">
            <Button onPress={() => setIsVisible(false)}>Close</Button>
          </TooltipSimple>
        </View>
      </Modal>
    </>);

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  containeralt: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#eee',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    height: 300,
    margin: 'auto',
    padding: 30,
    width: 300
  },
  gap: {
    height: 10
  }
});