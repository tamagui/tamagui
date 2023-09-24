import { Onboarding } from '@my/ui'
import { useRouter } from 'solito/router'
import { OnboardingStepInfo, StepContent } from '@my/ui'
import { Search, Calendar, Mountain } from '@tamagui/lucide-icons'

const steps: OnboardingStepInfo[] = [
  {
    theme: 'orange',
    Content: () => (
      <StepContent
        title="Find a Climb"
        icon={Search}
        description="Search your local gym for different types and levels of climbs."
      />
    ),
  },
  {
    theme: 'green',
    Content: () => (
      <StepContent
        title="Join a Climb"
        icon={Mountain}
        description="Join a climber, and find a belayer to climb with"
      />
    ),
  },
  {
    theme: 'blue',
    Content: () => (
      <StepContent
        title="Schedule a Climb"
        icon={Calendar}
        description="Post climbs and invite other climbers to join you."
      />
    ),
  },
]

/**
 * note: this screen is used as a standalone page on native and as a sidebar on auth layout on web
 */
export const OnboardingScreen = () => {
  const router = useRouter()
  return (
    <Onboarding
      autoSwipe
      onOnboarded={() => router.push('/sign-up')}
      steps={steps}
    />
  )
}
