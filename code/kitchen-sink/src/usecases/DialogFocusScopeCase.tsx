import { Button, Dialog, Input, Label, XStack, YStack } from 'tamagui'

export function DialogFocusScopeCase() {
  return (
    <YStack padding="$4" gap="$4">
      {/* Modal Dialog - Should trap focus */}
      <Dialog modal>
        <Dialog.Trigger asChild>
          <Button data-testid="modal-dialog-trigger">Open Modal Dialog</Button>
        </Dialog.Trigger>
        <DialogContent
          testId="modal"
          title="Modal Dialog (Focus Trapped)"
          description="Focus should be trapped within this dialog. Tab key should cycle through elements."
        />
      </Dialog>

      {/* Non-Modal Dialog - Should NOT trap focus */}
      <Dialog modal={false}>
        <Dialog.Trigger asChild>
          <Button data-testid="non-modal-dialog-trigger">Open Non-Modal Dialog</Button>
        </Dialog.Trigger>
        <DialogContent
          testId="non-modal"
          title="Non-Modal Dialog (Focus Not Trapped)"
          description="Focus can leave this dialog. Click outside to close."
        />
      </Dialog>

      {/* Nested Dialogs */}
      <Dialog modal>
        <Dialog.Trigger asChild>
          <Button data-testid="parent-dialog-trigger">
            Open Dialog with Nested Dialog
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            key="parent-overlay"
            transition="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            key="parent-content"
            bordered
            elevate
            transition={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            width={500}
            padding="$6"
            gap="$4"
          >
            <YStack data-testid="parent-dialog-content" gap="$4">
              <Dialog.Title>Parent Dialog</Dialog.Title>
              <Dialog.Description>
                This dialog contains another dialog. Focus should be managed correctly.
              </Dialog.Description>

              <YStack gap="$3">
                <Label htmlFor="parent-input">Parent Input</Label>
                <Input id="parent-input" placeholder="Type here..." />
              </YStack>

              {/* Nested Dialog */}
              <Dialog modal>
                <Dialog.Trigger asChild>
                  <Button data-testid="nested-dialog-trigger">Open Nested Dialog</Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay
                    key="nested-overlay"
                    transition="quick"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                  <Dialog.Content
                    key="nested-content"
                    bordered
                    elevate
                    transition="quick"
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    width={400}
                    padding="$6"
                    gap="$4"
                  >
                    <YStack data-testid="nested-dialog-content" gap="$4">
                      <Dialog.Title>Nested Dialog</Dialog.Title>
                      <Dialog.Description>
                        Focus should be trapped in this nested dialog.
                      </Dialog.Description>

                      <YStack gap="$3">
                        <Label htmlFor="nested-input">Nested Input</Label>
                        <Input
                          id="nested-input"
                          data-testid="nested-input"
                          placeholder="Focus trapped here..."
                        />
                      </YStack>

                      <XStack gap="$3" justifyContent="flex-end">
                        <Dialog.Close asChild>
                          <Button data-testid="nested-close-button">Close Nested</Button>
                        </Dialog.Close>
                      </XStack>
                    </YStack>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog>

              <XStack gap="$3" justifyContent="flex-end">
                <Dialog.Close asChild>
                  <Button variant="outlined" data-testid="parent-close-button">
                    Close Parent
                  </Button>
                </Dialog.Close>
              </XStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}

function DialogContent({
  testId,
  title,
  description,
  disableOutsidePointerEvents,
}: {
  testId: string
  title: string
  description: string
  disableOutsidePointerEvents?: boolean
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        key="overlay"
        transition="quick"
        opacity={0.5}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Dialog.Content
        key="content"
        bordered
        elevate
        disableOutsidePointerEvents={disableOutsidePointerEvents}
        transition={[
          'quick',
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
        enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
        exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
        width={450}
        maxHeight="$20"
        padding="$6"
        gap="$4"
      >
        <YStack data-testid={`${testId}-dialog-content`} gap="$4">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>

          <YStack gap="$3" tag="form">
            <YStack gap="$3">
              <Label htmlFor={`${testId}-first`}>First Name</Label>
              <Input
                id={`${testId}-first`}
                data-testid={`first-input`}
                placeholder="Enter your first name"
                autoComplete="given-name"
              />
            </YStack>

            <YStack gap="$3">
              <Label htmlFor={`${testId}-second`}>Last Name</Label>
              <Input
                id={`${testId}-second`}
                data-testid={`second-input`}
                placeholder="Enter your last name"
                autoComplete="family-name"
              />
            </YStack>

            <YStack gap="$3">
              <Label htmlFor={`${testId}-email`}>Email</Label>
              <Input
                id={`${testId}-email`}
                data-testid={`email-input`}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </YStack>

            <YStack gap="$3">
              <Label htmlFor={`${testId}-select`}>Country</Label>
              <select
                id={`${testId}-select`}
                data-testid={`country-select`}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                }}
              >
                <option value="">Select a country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
              </select>
            </YStack>

            <YStack gap="$3">
              <Label htmlFor={`${testId}-textarea`}>Comments</Label>
              <textarea
                id={`${testId}-textarea`}
                data-testid={`comments-textarea`}
                placeholder="Additional comments..."
                rows={3}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </YStack>

            <XStack gap="$3" alignItems="center">
              <input
                type="checkbox"
                id={`${testId}-checkbox`}
                data-testid={`terms-checkbox`}
              />
              <Label htmlFor={`${testId}-checkbox`} size="$3">
                I agree to the terms and conditions
              </Label>
            </XStack>
          </YStack>

          <XStack gap="$3" justifyContent="flex-end">
            <Dialog.Close asChild>
              <Button variant="outlined" data-testid={`cancel-button`}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button theme="blue" data-testid={`save-button`}>
              Save Changes
            </Button>
          </XStack>
        </YStack>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
