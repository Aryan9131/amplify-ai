'use client'
import { Button } from '@/components/ui/button'
import { PayPalButtons } from '@paypal/react-paypal-js'
import React, { useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { Check, Star, Zap, Crown, Sparkles } from 'lucide-react'

const creditPlans = [
    {
        credit: 25,
        price: 4.99
    },
    {
        credit: 50,
        price: 9.99
    },
    {
        credit: 100,
        price: 17.99
    }
]

const subscriptionPlans = [
    {
        name: "Free",
        price: 0,
        monthlyCredits: 10,
        features: [
            "10 monthly credits",
            "Basic image generation",
            "Standard video creation",
            "Basic templates",
            "Community support"
        ],
        limitations: [
            "Watermark on exports",
            "Standard processing speed",
            "Basic quality output"
        ],
        icon: Sparkles,
        color: "text-gray-600",
        popular: false
    },
    {
        name: "Pro",
        price: 19.99,
        monthlyCredits: 500,
        features: [
            "500 monthly credits",
            "HD image generation",
            "Premium video effects",
            "Advanced templates library",
            "Priority processing",
            "No watermarks",
            "Batch processing",
            "Custom brand kit",
            "Priority support"
        ],
        limitations: [],
        icon: Zap,
        color: "text-blue-600",
        popular: true
    }
];


const BillingPage = () => {
    const [activeTab, setActiveTab] = useState<'subscriptions' | 'credits'>('subscriptions')
    const addCredits = useMutation(api.users.addCredits)
    const upgradeSubscription = useMutation(api.users.upgradeSubscription)
    const user = useQuery(api.users.getUser)

    const createOrder = (data: any, actions: any, plan: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: plan.price.toFixed(2),
                    },
                    description: `${plan.credit} AI Credits`
                },
            ],
            intent: 'CAPTURE',
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        });
    };

    const createSubscriptionOrder = (data: any, actions: any, plan: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: plan.price.toFixed(2),
                    },
                    description: `${plan.name} Monthly Subscription`
                },
            ],
            intent: 'CAPTURE',
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        });
    };

    const onApprove = async (data: any, actions: any, plan: any) => {
        try {
            const details = await actions.order.capture();
            console.log('Payment captured:', details);
            
            if (details.status === 'COMPLETED') {
                await addCredits({ creditsToAdd: plan.credit });
                alert(`Transaction completed! ${plan.credit} credits added to your account.`);
            } else {
                console.error('Payment not completed:', details);
                alert('Payment was not completed successfully. Please try again.');
            }
        } catch (error) {
            console.error('Error capturing payment:', error);
            alert('There was an error processing your payment. Please try again.');
        }
    };

    const onSubscriptionApprove = async (data: any, actions: any, plan: any) => {
        try {
            const details = await actions.order.capture();
            console.log('Subscription payment captured:', details);
            
            if (details.status === 'COMPLETED') {
                await upgradeSubscription({ 
                    newPlan: plan.name.toLowerCase(),
                    creditsToAdd: plan.monthlyCredits
                });
                alert(`Subscription upgraded to ${plan.name}! ${plan.monthlyCredits} credits added to your account.`);
            } else {
                console.error('Payment not completed:', details);
                alert('Payment was not completed successfully. Please try again.');
            }
        } catch (error) {
            console.error('Error capturing payment:', error);
            alert('There was an error processing your payment. Please try again.');
        }
    };

    const onError = (err: any) => {
        console.error('PayPal Error:', err);
        alert('There was an error with PayPal. Please try again later.');
    };

    const onCancel = (data: any) => {
        console.log('Payment cancelled:', data);
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Choose Your Plan
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    Upgrade your creative workflow with our flexible pricing options
                </p>
                {user && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg inline-block">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Current Plan: <span className="font-semibold capitalize">{user.plan}</span> | 
                            Credits: <span className="font-semibold">{user.credits}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`px-6 py-3 rounded-md font-medium transition-all ${
                            activeTab === 'subscriptions' 
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        Monthly Plans
                    </button>
                    <button
                        onClick={() => setActiveTab('credits')}
                        className={`px-6 py-3 rounded-md font-medium transition-all ${
                            activeTab === 'credits' 
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        Buy Credits
                    </button>
                </div>
            </div>

            {/* Subscription Plans */}
            {activeTab === 'subscriptions' && (
                <div className='w-full flex justify-center items-center'>
                    <div className="grid md:grid-cols-2 gap-10 mt-15 mb-12 ">
                    {subscriptionPlans.map((plan, index) => {
                        const IconComponent = plan.icon
                        const isCurrentPlan = user?.plan === plan.name.toLowerCase()
                        
                        return (
                            <div 
                                key={index} 
                                className={`relative border-2 rounded-2xl p-15 transition-all duration-300 hover:shadow-xl ${
                                    plan.popular 
                                        ? 'border-blue-500 shadow-lg scale-105' 
                                        : isCurrentPlan
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                                            <Star className="w-4 h-4" />
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                {isCurrentPlan && (
                                    <div className="absolute -top-4 right-4">
                                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Current Plan
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <IconComponent className={`w-12 h-12 mx-auto mb-4 ${plan.color}`} />
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">${plan.price}</span>
                                        {plan.price > 0 && <span className="text-gray-500">/month</span>}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                        {plan.monthlyCredits} credits monthly
                                    </p>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {plan.price === 0 ? (
                                    <Button 
                                        className={`w-full py-3 ${isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        variant={isCurrentPlan ? "secondary" : "default"}
                                        disabled={isCurrentPlan}
                                    >
                                        {isCurrentPlan ? 'Current Plan' : 'Free Forever'}
                                    </Button>
                                ) : (
                                    <div className="w-full">
                                        {!isCurrentPlan ? (
                                            <PayPalButtons
                                                style={{
                                                    layout: 'horizontal',
                                                    color: 'gold',
                                                    shape: 'rect',
                                                    label: 'subscribe',
                                                    height: 45
                                                }}
                                                forceReRender={[plan.name, plan.price]}
                                                createOrder={(data, actions) => createSubscriptionOrder(data, actions, plan)}
                                                onApprove={(data, actions) => onSubscriptionApprove(data, actions, plan)}
                                                onError={onError}
                                                onCancel={onCancel}
                                            />
                                        ) : (
                                            <Button className="w-full py-3" variant="secondary" disabled>
                                                Current Plan
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                </div>
            )}

            {/* Credit Packages */}
            {activeTab === 'credits' && (
                <div>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-4">Buy Additional Credits</h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Need more credits? Purchase additional credits that never expire and work with any subscription plan.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {creditPlans.map((plan, index) => {
                            const costPerCredit = (plan.price / plan.credit).toFixed(3)
                            const savings = index === 2 ? '25%' : index === 1 ? '15%' : null
                            
                            return (
                                <div key={index} className="relative border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                                    {savings && (
                                        <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Save {savings}
                                        </div>
                                    )}
                                    
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Zap className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">{plan.credit} Credits</h3>
                                        <div className="mb-2">
                                            <span className="text-3xl font-bold text-blue-600">${plan.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            ${costPerCredit} per credit
                                        </p>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Credits:</span>
                                            <span className="font-semibold">{plan.credit}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Never expires:</span>
                                            <Check className="w-4 h-4 text-green-500" />
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Works with any plan:</span>
                                            <Check className="w-4 h-4 text-green-500" />
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <PayPalButtons
                                            style={{
                                                layout: 'vertical',
                                                color: 'blue',
                                                shape: 'rect',
                                                label: 'pay',
                                                height: 45
                                            }}
                                            forceReRender={[plan.credit, plan.price]}
                                            createOrder={(data, actions) => createOrder(data, actions, plan)}
                                            onApprove={(data, actions) => onApprove(data, actions, plan)}
                                            onError={onError}
                                            onCancel={onCancel}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Credits are added instantly to your account and never expire. Use them anytime!
                        </p>
                    </div>
                </div>
            )}

            {/* FAQ Section */}
            <div className="mt-16 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">How do credits work?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Each image generation costs 3 credit and video generation costs 5 credits. Subscription plans include monthly credits, and you can buy additional credits anytime.
                        </p>
                    </div>
                    {/* <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Do credits expire?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Purchased credits never expire. Monthly subscription credits reset each billing cycle.
                        </p>
                    </div> */}
                    {/* <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">Can I change my plan?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Yes! You can upgrade or downgrade your subscription at any time. Changes take effect at your next billing cycle.
                        </p>
                    </div> */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="font-semibold mb-2">What's the difference between plans?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Higher plans include more monthly credits, premium features like HD generation, no watermarks, and priority processing.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BillingPage;