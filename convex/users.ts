import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper function to get plan features
const getPlanFeatures = (plan: string) => {
   const features = {
    free: {
        monthlyCreditsAllowance: 10,
        hasWatermarkRemoval: false,
        hasPriorityProcessing: false,
        hasHDGeneration: false,
        hasBatchProcessing: false,
        hasCustomBrandKit: false,
        hasAPIAccess: false,
        hasTeamCollaboration: false,
        maxStorageGB: 1
    },
    pro: {
        monthlyCreditsAllowance: 500,
        hasWatermarkRemoval: true,
        hasPriorityProcessing: true,
        hasHDGeneration: true,
        hasBatchProcessing: true,
        hasCustomBrandKit: true,
        hasAPIAccess: false,
        hasTeamCollaboration: false,
        maxStorageGB: 10
    }
};

    return features[plan as keyof typeof features] || features.free;
};

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier),
            )
            .unique();
            
        if (user !== null) {
            if (user.name !== identity.name) {
                await ctx.db.patch(user._id, { 
                    name: identity.name,
                    updatedAt: Date.now()
                });
            }
            return user._id;
        }

        const now = Date.now();
        const freeFeatures = getPlanFeatures('free');
        
        return await ctx.db.insert("users", {
            name: identity.name ?? "Anonymous",
            email: identity.email ?? "guest@gmail.com",
            tokenIdentifier: identity.tokenIdentifier,
            
            // Subscription info
            plan: "free",
            planStartDate: now,
            isActive: true,
            
            // Credits
            credits: 10, // Starting free credits
            monthlyCreditsUsed: 0,
            purchasedCredits: 0,
            
            // Usage tracking
            imageGeneratedToday: 0,
            videoGeneratedToday: 0,
            downloadsToday: 0,
            imageGeneratedThisMonth: 0,
            videoGeneratedThisMonth: 0,
            
            // Feature flags (spread freeFeatures to get all plan-specific settings)
            ...freeFeatures,
            
            // Timestamps
            lastActiveAt: now,
            createdAt: now,
            updatedAt: now
        });
    },
});

export const getUser = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }
        
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier),
            )
            .unique();

        if (!user) {
             throw new Error("User Not Found !")
        }

        return user;
    }
})

export const addCredits = mutation({
    args: {
        creditsToAdd: v.number(),
    },
    handler: async (ctx, { creditsToAdd }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        // Record credit purchase
        await ctx.db.insert("creditPurchases", {
            userId: user._id,
            userEmail: user.email,
            creditsAmount: creditsToAdd,
            priceUSD: 0, // You can calculate this based on credit packages
            status: "completed",
            createdAt: Date.now(),
            completedAt: Date.now()
        });

        // Update user's credits and purchased credits
        await ctx.db.patch(user._id, {
            credits: user.credits + creditsToAdd,
            purchasedCredits: user.purchasedCredits + creditsToAdd,
            updatedAt: Date.now()
        });
    },
});

export const upgradeSubscription = mutation({
    args: {
        newPlan: v.union(v.literal('free'), v.literal('pro')),
        creditsToAdd: v.number(),
    },
    handler: async (ctx, { newPlan, creditsToAdd }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        const now = Date.now();
        const nextBillingDate = now + (30 * 24 * 60 * 60 * 1000); // 30 days from now
        const newFeatures = getPlanFeatures(newPlan);

        // Record subscription history
        await ctx.db.insert("subscriptionHistory", {
            userId: user._id,
            userEmail: user.email,
            plan: newPlan,
            previousPlan: user.plan,
            amount: newPlan === 'pro' && 19.99 || 0,
            currency: 'USD',
            startDate: now,
            endDate: nextBillingDate,
            billingCycle: 'monthly',
            status: 'active',
            createdAt: now,
            updatedAt: now
        });

        // Update user's plan and features
        await ctx.db.patch(user._id, {
            plan: newPlan,
            planStartDate: now,
            planEndDate: nextBillingDate,
            isActive: true,
            credits: user.credits + creditsToAdd,
            monthlyCreditsUsed: 0, // Reset monthly usage
            monthlyCreditsAllowance: newFeatures.monthlyCreditsAllowance,
            nextBillingDate: nextBillingDate,
            lastBillingDate: now,
            
            // Update feature flags
            hasWatermarkRemoval: newFeatures.hasWatermarkRemoval,
            hasPriorityProcessing: newFeatures.hasPriorityProcessing,
            hasHDGeneration: newFeatures.hasHDGeneration,
            hasBatchProcessing: newFeatures.hasBatchProcessing,
            hasCustomBrandKit: newFeatures.hasCustomBrandKit,
            hasAPIAccess: newFeatures.hasAPIAccess,
            hasTeamCollaboration: newFeatures.hasTeamCollaboration,
            maxStorageGB: newFeatures.maxStorageGB,
            
            updatedAt: now
        });
    },
});

export const useCredits = mutation({
    args: {
        amount: v.number(),
        type: v.union(v.literal("image"), v.literal("video")),
    },
    handler: async (ctx, { amount, type }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        if (user.credits < amount) {
            throw new Error("Insufficient credits");
        }

        const now = Date.now();
        
        // Update user credits and usage
        await ctx.db.patch(user._id, {
            credits: user.credits - amount,
            monthlyCreditsUsed: user.monthlyCreditsUsed + amount,
            imageGeneratedThisMonth: type === "image" ? user.imageGeneratedThisMonth + 1 : user.imageGeneratedThisMonth,
            videoGeneratedThisMonth: type === "video" ? user.videoGeneratedThisMonth + 1 : user.videoGeneratedThisMonth,
            lastActiveAt: now,
            updatedAt: now
        });

        // Record generation stats
        await ctx.db.insert("generationStats", {
            userId: user._id,
            type: type,
            generatedAt: new Date().toISOString(),
            success: true,
            model: type === "image" ? "stable-diffusion" : "wan-2.2-i2v",
            creditsUsed: amount,
            planUsed: user.plan
        });

        return { success: true, remainingCredits: user.credits - amount };
    },
});

export const checkFeatureAccess = query({
    args: {
        feature: v.string(),
    },
    handler: async (ctx, { feature }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        // Check feature access based on plan
        const featureMap: { [key: string]: keyof typeof user } = {
            "watermark_removal": "hasWatermarkRemoval",
            "priority_processing": "hasPriorityProcessing",
            "hd_generation": "hasHDGeneration",
            "batch_processing": "hasBatchProcessing",
            "custom_brand_kit": "hasCustomBrandKit",
            "api_access": "hasAPIAccess",
            "team_collaboration": "hasTeamCollaboration"
        };

        const featureKey = featureMap[feature];
        if (!featureKey) {
            return false;
        }

        return user[featureKey] as boolean;
    },
});

export const getUserUsageStats = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        return {
            plan: user.plan,
            credits: user.credits,
            monthlyCreditsUsed: user.monthlyCreditsUsed,
            monthlyCreditsAllowance: user.monthlyCreditsAllowance,
            purchasedCredits: user.purchasedCredits,
            imageGeneratedThisMonth: user.imageGeneratedThisMonth,
            videoGeneratedThisMonth: user.videoGeneratedThisMonth,
            planStartDate: user.planStartDate,
            planEndDate: user.planEndDate,
            nextBillingDate: user.nextBillingDate,
            isActive: user.isActive
        };
    },
});

export const resetMonthlyUsage = mutation({
    handler: async (ctx) => {
        // This would typically be called by a scheduled function
        const users = await ctx.db.query("users").collect();
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

        for (const user of users) {
            if (user.lastBillingDate && user.lastBillingDate <= thirtyDaysAgo) {
                const features = getPlanFeatures(user.plan);
                
                await ctx.db.patch(user._id, {
                    monthlyCreditsUsed: 0,
                    imageGeneratedThisMonth: 0,
                    videoGeneratedThisMonth: 0,
                    credits: user.credits + features.monthlyCreditsAllowance,
                    lastBillingDate: now,
                    nextBillingDate: now + (30 * 24 * 60 * 60 * 1000),
                    updatedAt: now
                });
            }
        }
    },
});