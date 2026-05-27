import { supabase, supabaseAdmin } from './supabase'
import { PAYMENT_CONFIG } from './constants'

declare global {
  interface Window {
    Razorpay: any
  }
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void
  prefill: {
    email: string
    name?: string
  }
  theme: {
    color: string
  }
}

// Create a Razorpay order on the backend
export async function createRazorpayOrder(planType: 'paid' | 'premium', userEmail: string) {
  try {
    const plan = PAYMENT_CONFIG.plans[planType]

    // Call our backend API to create an order
    // This will be handled by an Edge Function or API route
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: plan.amount,
        currency: plan.currency,
        planType,
        userEmail,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create Razorpay order')
    }

    const data = await response.json()
    return {
      orderId: data.id,
      amount: plan.amount,
      planType,
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

// Verify payment and update user plan
export async function verifyPaymentAndUpdatePlan(
  userId: string,
  paymentId: string,
  orderId: string,
  signature: string,
  planType: 'paid' | 'premium'
) {
  try {
    // Call backend to verify signature and update user plan
    const response = await fetch('/api/payments/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        paymentId,
        orderId,
        signature,
        planType,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Payment verification failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}

// Load Razorpay script
export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay script'))
    document.body.appendChild(script)
  })
}

// Open Razorpay payment modal
export async function openRazorpayModal(
  orderId: string,
  amount: number,
  userEmail: string,
  userName?: string,
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void
) {
  try {
    await loadRazorpayScript()

    const options: RazorpayOptions = {
      key: PAYMENT_CONFIG.razorpayKeyId!,
      amount,
      currency: 'INR',
      name: 'Legalite.ai',
      description: 'AIBE Exam Prep Plan',
      order_id: orderId,
      handler: (response) => {
        onSuccess?.(response)
      },
      prefill: {
        email: userEmail,
        name: userName,
      },
      theme: {
        color: '#c19a6b', // Gold color from design system
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response: any) => {
      onError?.(new Error(response.error.description))
    })
    rzp.open()
  } catch (error) {
    console.error('Error opening Razorpay modal:', error)
    onError?.(error)
  }
}

// Update user plan after successful payment
export async function updateUserPlan(userId: string, planType: 'free' | 'paid' | 'premium') {
  try {
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({ plan: planType })
      .eq('id', userId)

    if (error) {
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error updating user plan:', error)
    throw error
  }
}
