import { useState, useRef } from 'react'
import { View, Text as RNText, StyleSheet } from 'react-native'
import ActionSheet, {
  type ActionSheetRef,
  ScrollView as ActionScrollView,
} from 'react-native-actions-sheet'
import { Button, Sheet, Text, YStack } from 'tamagui'

/**
 * Side-by-side comparison of Tamagui Sheet vs react-native-actions-sheet
 * to verify gesture smoothness
 */
export function ActionsSheetComparison() {
  const [tamaguiOpen, setTamaguiOpen] = useState(false)
  const [tamaguiPosition, setTamaguiPosition] = useState(0)
  const actionsSheetRef = useRef<ActionSheetRef>(null)

  return (
    <YStack padding="$4" gap="$4" flex={1}>
      <Text fontSize="$6" fontWeight="bold">
        Sheet Comparison
      </Text>

      <Text fontSize="$3" color="$gray11">
        Compare gesture smoothness between Tamagui Sheet and react-native-actions-sheet
      </Text>

      <YStack gap="$3">
        <Button onPress={() => actionsSheetRef.current?.show()} theme="blue" size="$5">
          Open Actions Sheet (Reference)
        </Button>

        <Button onPress={() => setTamaguiOpen(true)} theme="green" size="$5">
          Open Tamagui Sheet
        </Button>
      </YStack>

      <YStack gap="$2" padding="$3" bg="$backgroundHover" borderRadius="$2">
        <Text fontWeight="bold">Test instructions:</Text>
        <Text fontSize="$2">1. Open each sheet</Text>
        <Text fontSize="$2">2. Drag down to lower snap point</Text>
        <Text fontSize="$2">3. Drag up - watch for jitter when sheet hits top</Text>
        <Text fontSize="$2">
          4. Scroll content, then drag down - watch for jitter at scroll=0
        </Text>
      </YStack>

      {/* Tamagui Sheet */}
      <Sheet
        modal
        open={tamaguiOpen}
        onOpenChange={setTamaguiOpen}
        snapPoints={[85, 50]}
        snapPointsMode="percent"
        position={tamaguiPosition}
        onPositionChange={setTamaguiPosition}
        dismissOnSnapToBottom
        zIndex={100000}
      >
        <Sheet.Overlay bg="$color" opacity={0.5} />
        <Sheet.Handle />
        <Sheet.Frame>
          <Sheet.ScrollView>
            <YStack gap="$3" padding="$4">
              <Text fontSize="$5" fontWeight="bold">
                Tamagui Sheet
              </Text>
              <Text color="$gray11">Position: {tamaguiPosition}</Text>

              {Array.from({ length: 30 }).map((_, i) => (
                <YStack
                  key={i}
                  padding="$3"
                  bg="$background"
                  borderRadius="$2"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <Text>Item {i + 1}</Text>
                </YStack>
              ))}

              <Button onPress={() => setTamaguiOpen(false)} marginTop="$4">
                Close
              </Button>
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>

      {/* Actions Sheet - using their ScrollView component */}
      <ActionSheet
        ref={actionsSheetRef}
        snapPoints={[50, 100]}
        initialSnapIndex={0}
        gestureEnabled
        containerStyle={{
          maxHeight: '100%',
          height: '100%',
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 20,
            width: '100%',
            height: '100%',
          }}
        >
          <RNText style={styles.sheetTitle}>Actions Sheet (Reference)</RNText>
          <RNText style={styles.sheetSubtitle}>Using their ScrollView component</RNText>
          <ActionScrollView
            style={{
              width: '100%',
              flexShrink: 1,
            }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <View key={i} style={styles.itemTall}>
                <RNText style={styles.itemTextLarge}>Item {i + 1}</RNText>
                <RNText style={styles.itemSubtext}>
                  Scroll me and test drag handoff
                </RNText>
              </View>
            ))}
          </ActionScrollView>
        </View>
      </ActionSheet>
    </YStack>
  )
}

const styles = StyleSheet.create({
  actionsSheetContainer: {
    backgroundColor: '#fff',
  },
  sheetContent: {
    flex: 1,
    padding: 16,
    height: '100%',
  },
  sheetContentTall: {
    flex: 1,
    padding: 16,
    minHeight: 600,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewTall: {
    flex: 1,
    minHeight: 500,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  item: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTall: {
    padding: 20,
    backgroundColor: '#e8f4e8',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c0d8c0',
  },
  itemText: {
    fontSize: 16,
  },
  itemTextLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d5a2d',
  },
  itemSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
})
