import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // user table
    users: defineTable({
        name: v.string(),
        email: v.string(),
        tokenIdentifier: v.string(),

        // Subscription information
        plan: v.union(v.literal('free'), v.literal('pro'), v.literal('premium')),
        planStartDate: v.optional(v.number()), // timestamp when current plan started
        planEndDate: v.optional(v.number()), // timestamp when current plan ends
        isActive: v.boolean(), // whether subscription is active
        
        // Credits system
        credits: v.number(), // total available credits
        monthlyCreditsUsed: v.number(), // credits used this billing cycle
        monthlyCreditsAllowance: v.number(), // monthly credits from subscription
        purchasedCredits: v.number(), // credits bought separately (never expire)
        
        // Usage tracking for plan limits
        imageGeneratedToday: v.number(),
        videoGeneratedToday: v.number(),
        downloadsToday: v.number(),
        imageGeneratedThisMonth: v.number(),
        videoGeneratedThisMonth: v.number(),
        
        // Billing information
        lastBillingDate: v.optional(v.number()),
        nextBillingDate: v.optional(v.number()),
        paypalSubscriptionId: v.optional(v.string()),
        
        // Feature flags based on plan
        hasWatermarkRemoval: v.boolean(),
        hasPriorityProcessing: v.boolean(),
        hasHDGeneration: v.boolean(),
        hasBatchProcessing: v.boolean(),
        hasCustomBrandKit: v.boolean(),
        hasAPIAccess: v.boolean(),
        hasTeamCollaboration: v.boolean(),
        maxStorageGB: v.number(),

        lastActiveAt: v.number(),
        createdAt: v.number(),
        updatedAt: v.number()

    }).index("by_token", ["tokenIdentifier"])
      .index("by_email", ["email"])
      .index("by_plan", ["plan"]),

    // Table for storing subscription history
    subscriptionHistory: defineTable({
        userId: v.string(),
        userEmail: v.string(),
        
        // Subscription details
        plan: v.union(v.literal('free'), v.literal('pro'), v.literal('premium')),
        previousPlan: v.optional(v.union(v.literal('free'), v.literal('pro'), v.literal('premium'))),
        
        // Billing information
        amount: v.number(),
        currency: v.string(),
        paypalTransactionId: v.optional(v.string()),
        paypalSubscriptionId: v.optional(v.string()),
        
        // Dates
        startDate: v.number(),
        endDate: v.number(),
        billingCycle: v.union(v.literal('monthly'), v.literal('yearly')),
        
        // Status
        status: v.union(
            v.literal('active'), 
            v.literal('cancelled'), 
            v.literal('expired'), 
            v.literal('paused')
        ),
        
        createdAt: v.number(),
        updatedAt: v.number()
    }).index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Table for tracking credit purchases
    creditPurchases: defineTable({
        userId: v.string(),
        userEmail: v.string(),
        
        // Purchase details
        creditsAmount: v.number(),
        priceUSD: v.number(),
        paypalTransactionId: v.optional(v.string()),
        
        // Status
        status: v.union(v.literal('pending'), v.literal('completed'), v.literal('failed')),
        
        createdAt: v.number(),
        completedAt: v.optional(v.number())
    }).index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Table for storing original uploaded images
    images: defineTable({
        imageId: v.string(),
        imageUrl: v.string(),
        fileName: v.string(),
        fileSize: v.number(),
        productName: v.string(),
        style: v.string(),
        size: v.string(),
        description: v.string(),
        generatedAt: v.string(),
        status: v.optional(v.union(v.literal("generating"), v.literal("completed"), v.literal("failed"))),
        generationError: v.optional(v.string()),
        userId: v.optional(v.string()),
        userEmail: v.optional(v.string()),
        videoPrompt: v.string(),
        
        // Generation metadata
        creditsUsed: v.number(),
        planUsed: v.string(),
        hasWatermark: v.boolean(),
        qualityLevel: v.union(v.literal("standard"), v.literal("hd"), v.literal("ultra_hd"))
    }).index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Table for storing generated videos
    videos: defineTable({
        // Video data
        videoId: v.string(),
        videoUrl: v.string(),
        fileName: v.string(),
        fileSize: v.number(),

        // Reference to original image
        originalImageId: v.string(),
        originalImageUrl: v.string(),

        // Generation metadata
        videoPrompt: v.string(),
        productName: v.string(),
        style: v.string(),
        description: v.string(),
        selectedProduct: v.object({
            id: v.number(),
            name: v.string(),
            image: v.string(),
            category: v.string(),
        }),

        // Generation info
        generatedAt: v.string(),
        status: v.union(v.literal("generating"), v.literal("completed"), v.literal("failed")),
        generationError: v.optional(v.string()),

        // User info
        userId: v.optional(v.string()),
        userEmail: v.optional(v.string()),
        
        // Generation metadata
        creditsUsed: v.number(),
        planUsed: v.string(),
        hasWatermark: v.boolean(),
        qualityLevel: v.union(v.literal("standard"), v.literal("hd"), v.literal("ultra_hd"))
    }).index("by_user", ["userId"])
      .index("by_status", ["status"]),

    // Table for tracking generation stats/usage
    generationStats: defineTable({
        userId: v.optional(v.string()),
        type: v.union(v.literal("image"), v.literal("video")),
        generatedAt: v.string(),
        success: v.boolean(),
        model: v.string(),
        creditsUsed: v.number(),
        planUsed: v.string(),
        processingTimeMs: v.optional(v.number())
    }).index("by_user", ["userId"])
      .index("by_type", ["type"])
      .index("by_date", ["generatedAt"]),

    // Table for feature usage tracking
    featureUsage: defineTable({
        userId: v.string(),
        featureName: v.string(), // "hd_generation", "watermark_removal", "batch_processing", etc.
        usageCount: v.number(),
        lastUsedAt: v.number(),
        planRequired: v.string() // minimum plan required for this feature
    }).index("by_user", ["userId"])
      .index("by_feature", ["featureName"])
});