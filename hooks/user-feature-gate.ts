'use client'
import { useSubscription } from './use-subscription'
import { useState } from 'react'

export const useFeatureGate = () => {
    const { checkFeatureAccess, needsUpgrade, getUpgradeMessage } = useSubscription()
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [blockedFeature, setBlockedFeature] = useState<string>('')

    const gateFeature = (feature: string, callback?: () => void): boolean => {
        if (checkFeatureAccess(feature)) {
            callback?.()
            return true
        } else {
            setBlockedFeature(feature)
            setShowUpgradeModal(true)
            return false
        }
    }

    const closeUpgradeModal = () => {
        setShowUpgradeModal(false)
        setBlockedFeature('')
    }

    return {
        gateFeature,
        showUpgradeModal,
        blockedFeature,
        closeUpgradeModal,
        upgradeMessage: getUpgradeMessage(blockedFeature),
        needsUpgrade: needsUpgrade(blockedFeature)
    }
}