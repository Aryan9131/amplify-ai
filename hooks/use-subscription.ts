'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

export const useSubscription = () => {
    const user = useQuery(api.users.getUser)
    const usageStats = useQuery(api.users.getUserUsageStats)

    const checkFeatureAccess = (feature: string): boolean => {
        if (!user) return false
        
        const featureMap: { [key: string]: boolean } = {
            "watermark_removal": user.hasWatermarkRemoval,
            "priority_processing": user.hasPriorityProcessing,
            "hd_generation": user.hasHDGeneration,
            "batch_processing": user.hasBatchProcessing,
            "custom_brand_kit": user.hasCustomBrandKit,
            "api_access": user.hasAPIAccess,
            "team_collaboration": user.hasTeamCollaboration
        }

        return featureMap[feature] || false
    }

    const getPlanLimits = () => {
        if (!user) return null

        const limits = {
            free: {
                monthlyCredits: 10,
                maxStorageGB: 1,
                maxTeamMembers: 1,
                features: [
                    "10 monthly credits",
                    "Basic image generation",
                    "Standard video creation",
                    "Basic templates",
                    "Community support"
                ]
            },
            pro: {
                monthlyCredits: 500,
                maxStorageGB: 10,
                maxTeamMembers: 5,
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
                ]
            },
            premium: {
                monthlyCredits: 1500,
                maxStorageGB: 100,
                maxTeamMembers: 20,
                features: [
                    "1500 monthly credits",
                    "Ultra HD generation",
                    "Advanced AI models",
                    "Custom style training",
                    "API access",
                    "Team collaboration",
                    "Advanced analytics",
                    "White-label options",
                    "Dedicated support"
                ]
            }
        }

        return limits[user.plan as keyof typeof limits]
    }

    const needsUpgrade = (feature: string): boolean => {
        return !checkFeatureAccess(feature)
    }

    const getUpgradeMessage = (feature: string): string => {
        const messages = {
            "watermark_removal": "Upgrade to Pro to remove watermarks from your creations",
            "priority_processing": "Upgrade to Pro for faster generation times",
            "hd_generation": "Upgrade to Pro for HD quality generation",
            "batch_processing": "Upgrade to Pro to process multiple items at once",
            "custom_brand_kit": "Upgrade to Pro to create custom brand kits",
            "api_access": "Upgrade to Premium for API access",
            "team_collaboration": "Upgrade to Premium for team collaboration features"
        }

        return messages[feature as keyof typeof messages] || "Upgrade your plan to access this feature"
    }

    const isTrialExpired = (): boolean => {
        if (!user || !user.planEndDate) return false
        return Date.now() > user.planEndDate
    }

    const getDaysUntilBilling = (): number => {
        if (!user || !user.nextBillingDate) return 0
        const daysLeft = Math.ceil((user.nextBillingDate - Date.now()) / (1000 * 60 * 60 * 24))
        return Math.max(0, daysLeft)
    }

    const getCreditUsagePercentage = (): number => {
        if (!usageStats) return 0
        if (usageStats.monthlyCreditsAllowance === 0) return 0
        return (usageStats.monthlyCreditsUsed / usageStats.monthlyCreditsAllowance) * 100
    }

    const getRemainingCredits = (): number => {
        return user?.credits || 0
    }

    const canGenerate = (creditsCost: number = 1): boolean => {
        return getRemainingCredits() >= creditsCost
    }

    return {
        user,
        usageStats,
        checkFeatureAccess,
        getPlanLimits,
        needsUpgrade,
        getUpgradeMessage,
        isTrialExpired,
        getDaysUntilBilling,
        getCreditUsagePercentage,
        getRemainingCredits,
        canGenerate,
        isLoading: user === undefined
    }
}
