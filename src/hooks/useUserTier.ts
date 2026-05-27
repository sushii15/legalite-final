import { useCallback } from 'react'

export interface UserTierLimits {
  paperLimit: number
  mockTestLimit: number
}

export function useUserTier(plan: 'free' | 'paid' | 'premium'): UserTierLimits {
  return useCallback(() => {
    // Check if today is before May 30, 2026 (limited-time free promotion)
    const today = new Date()
    const promotionEnd = new Date('2026-05-30')
    const isPromotionActive = today < promotionEnd

    switch (plan) {
      case 'free':
        // During promotion (till May 30): show all 16 papers + 10 mocks
        // After May 30: revert to 1 paper + 0 mocks
        return isPromotionActive
          ? { paperLimit: 16, mockTestLimit: 10 }
          : { paperLimit: 1, mockTestLimit: 0 }
      case 'paid':
        return { paperLimit: 11, mockTestLimit: 5 }
      case 'premium':
        return { paperLimit: 16, mockTestLimit: 10 }
      default:
        return isPromotionActive
          ? { paperLimit: 16, mockTestLimit: 10 }
          : { paperLimit: 1, mockTestLimit: 0 }
    }
  }, [plan])()
}
