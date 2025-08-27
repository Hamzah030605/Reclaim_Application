import { useState } from 'react'
import { motion } from 'framer-motion'
import { Crown, Check, Shield } from 'lucide-react'
import { OnboardingScreenProps } from '../types'

export default function PricingScreen({ data, onNext, onBack }: OnboardingScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly')

  const handleSubscribe = () => {
    // TODO: Implement Stripe payment processing
    // For now, simulate successful payment
    console.log(`Selected plan: ${selectedPlan}`)
    // Redirect to dashboard after successful payment
    window.location.href = '/dashboard'
  }

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '$12.99',
      period: '/month',
      description: 'Full access to all features',
      features: [
        'Personalized recovery plan',
        'Community access & support',
        'Advanced blocking across devices',
        'Streak tracking & gamification',
        'Daily quests & achievements',
        'Progress analytics'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '$29.99',
      period: '/year',
      originalPrice: '$155.88',
      savings: 'Save 80%',
      description: 'Best value - commit to your recovery',
      popular: true,
      features: [
        'Everything in Monthly',
        'AI Coach premium support',
        'Advanced analytics & insights',
        'Priority community features',
        'Exclusive educational content',
        'Extended blocking features'
      ]
    }
  ]

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Crown className="w-16 h-16 text-achievement-gold mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-primary-text mb-4">
            Commit to Your Recovery
          </h2>
          <p className="text-lg text-secondary-text">
            Choose your plan and take the first step toward lasting freedom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-brand-blue bg-brand-blue/5'
                  : 'border-border-gray hover:border-brand-blue/50'
              } ${plan.popular ? 'ring-2 ring-achievement-gold' : ''}`}
              onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-achievement-gold text-primary-text px-3 py-1 rounded-full text-sm font-semibold">
                    Best Value
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-primary-text mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-primary-text">{plan.price}</span>
                  <span className="text-secondary-text">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="text-sm">
                    <span className="line-through text-secondary-text">{plan.originalPrice}</span>
                    <span className="ml-2 text-success-green font-semibold">{plan.savings}</span>
                  </div>
                )}
                <p className="text-sm text-secondary-text mt-2">{plan.description}</p>
              </div>

              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-success-green flex-shrink-0" />
                    <span className="text-sm text-secondary-text">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-secondary-text">
            <Shield className="w-4 h-4" />
            <span>Secure payment • Cancel anytime • 7-day money-back guarantee</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button onClick={onBack} className="btn-secondary flex-1">
            Back
          </button>
          <button
            onClick={handleSubscribe}
            className="btn-success flex-1 text-lg py-4"
          >
            Start Your Journey - {plans.find(p => p.id === selectedPlan)?.price}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-secondary-text">
            By subscribing, you agree to our{' '}
            <a href="#" className="text-brand-blue underline">Terms of Service</a> and{' '}
            <a href="#" className="text-brand-blue underline">Privacy Policy</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
