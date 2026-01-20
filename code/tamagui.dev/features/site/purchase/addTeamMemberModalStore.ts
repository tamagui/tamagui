import { createStore, createUseStore } from '@tamagui/use-store'

class AddTeamMemberModal {
  show = false
  subscriptionId = ''
}

export const addTeamMemberModal = createStore(AddTeamMemberModal)
export const useAddTeamMemberModal = createUseStore(AddTeamMemberModal)
