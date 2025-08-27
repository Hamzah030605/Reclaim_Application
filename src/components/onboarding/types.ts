export interface OnboardingScreenProps {
  data: any
  updateData: (data: any) => void
  onNext: (data?: any) => void
  onBack: () => void
  onPrev: () => void
  canGoBack: boolean
  isLastStep: boolean
}
