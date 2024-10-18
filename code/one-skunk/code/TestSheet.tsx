import * as React from 'react'
import { StyleSheet, type ViewStyle } from 'react-native'

import {
  ExampleItemCard,
  ObjectPropertyDisplay,
  CardButton,
  Colors,
} from 'react-native-ios-utilities'
import {
  ModalSheetView,
  ModalSheetViewContext,
  ModalSheetViewMainContent,
  type ModalSheetViewRef,
  type ModalMetrics,
} from 'react-native-ios-modal'

type ExampleItemProps = {
  index: number
  style?: ViewStyle
  extraProps?: Record<string, unknown>
}

let shouldEnableModalEventsLogging = false

export function ModalSheetViewTest01(props: ExampleItemProps) {
  const modalSheetViewRef = React.useRef<ModalSheetViewRef | null>(null)
  const modalContext = React.useContext(ModalSheetViewContext)

  const [modalMetrics, setModalMetrics] = React.useState<ModalMetrics | undefined>()

  const [shouldMountRecursiveContent, setShouldMountRecursiveContent] = React.useState(false)

  const recursionLevel = (props.extraProps?.recursionLevel as any as number) ?? 0

  let dataForDebugDisplay = {}

  if (modalMetrics != null) {
    const modalMetricsUpdated = {
      ...modalMetrics,
      modalViewControllerMetrics: {
        ...modalMetrics.modalViewControllerMetrics,
        instanceID: [modalMetrics.modalViewControllerMetrics.instanceID],
      },
      presentationControllerMetrics: {
        ...modalMetrics.presentationControllerMetrics,
        instanceID: [modalMetrics.presentationControllerMetrics?.instanceID],
      },
    }

    dataForDebugDisplay = {
      ...dataForDebugDisplay,
      ...modalMetricsUpdated,
    }
  }

  const hasDataForDebugDisplay = Object.keys(dataForDebugDisplay).length > 0

  const isFirstRecursion = recursionLevel == 0

  return (
    <ExampleItemCard
      style={props.style}
      index={props.index}
      title={'ModalSheetViewTest01'}
      description={['TBA']}
    >
      <ObjectPropertyDisplay
        recursiveStyle={styles.debugDisplayInner}
        object={hasDataForDebugDisplay ? dataForDebugDisplay : undefined}
      />
      <CardButton
        title={'Present Sheet Modal'}
        subtitle={'Present content as sheet'}
        onPress={async () => {
          setShouldMountRecursiveContent(true)
          console.info(
            'ModalSheetViewTest01',
            '\n - presenting modal...',
            `\n - recursionLevel: ${recursionLevel}`
          )
          await modalSheetViewRef.current?.presentModal()
          console.info(
            'ModalSheetViewTest01',
            '\n - present modal completed',
            `\n - recursionLevel: ${recursionLevel}`
          )
        }}
      />
      <React.Fragment>
        {!isFirstRecursion && (
          <CardButton
            title={'Dismiss Modal'}
            subtitle={'Dismiss current modal'}
            onPress={async () => {
              const modalSheetViewRefPrev: ModalSheetViewRef | null = props.extraProps
                ?.modalSheetViewRefPrev as any

              if (modalSheetViewRefPrev == null) {
                return
              }

              await modalSheetViewRefPrev.dismissModal()
              console.info(
                'ModalSheetViewTest01',
                '\n - dismiss modal completed',
                `\n - recursionLevel: ${recursionLevel}`
              )
            }}
          />
        )}
        {!isFirstRecursion && (
          <CardButton
            title={'Get modal metrics for prev. modal'}
            subtitle={'invoke `getModalMetrics`'}
            onPress={async () => {
              const modalRef = modalContext?.getModalSheetViewRef()

              console.info({ modalContext, modalRef })

              const modalMetrics = await modalRef?.getModalMetrics()

              setModalMetrics(modalMetrics)
              console.info(
                'ModalSheetViewTest01',
                '\n - invoked getModalMetrics',
                '\n',
                modalMetrics
              )
            }}
          />
        )}
      </React.Fragment>
      <ModalSheetView
        ref={(ref) => (modalSheetViewRef.current = ref)}
        onModalWillPresent={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalWillPresent',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalDidPresent={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalDidPresent',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalWillShow={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalWillShow',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalDidShow={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalDidShow',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalWillDismiss={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalWillDismiss',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalDidDismiss={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalDidDismiss',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalWillHide={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalWillHide',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalDidHide={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalDidHide',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalSheetStateWillChange={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalSheetStateWillChange',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalSheetStateDidChange={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalSheetStateDidChange',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
        onModalFocusChange={({ nativeEvent }) => {
          if (!shouldEnableModalEventsLogging) {
            return
          }

          console.info(
            'ModalSheetViewTest01.onModalFocusChange',
            '\n - nativeEvent:',
            nativeEvent,
            '\n'
          )
        }}
      >
        <ModalSheetViewMainContent contentContainerStyle={styles.modalContent}>
          <React.Fragment>
            {shouldMountRecursiveContent && (
              <ModalSheetViewTest01
                style={{
                  ...props.style,
                  ...styles.modalContentCard,
                }}
                index={props.index}
                extraProps={{
                  recursionLevel: recursionLevel + 1,
                  modalSheetViewRefPrev: modalSheetViewRef.current,
                }}
              />
            )}
          </React.Fragment>
        </ModalSheetViewMainContent>
      </ModalSheetView>
    </ExampleItemCard>
  )
}

const styles = StyleSheet.create({
  debugDisplayInner: {
    backgroundColor: `${Colors.PURPLE[200]}99`,
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
  modalContentCard: {
    alignSelf: 'stretch',
  },
})
