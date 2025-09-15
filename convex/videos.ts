// convex/videos.ts - Video mutations and queries for your existing schema
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new video record and deduct credits
export const createVideo = mutation({
  args: {
    videoId: v.string(),
    videoUrl: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    originalImageId: v.string(),
    originalImageUrl: v.string(),
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
    generatedAt: v.string(),
    status: v.union(v.literal("generating"), v.literal("completed"), v.literal("failed")),
    generationError: v.optional(v.string()),
    creditsUsed: v.number(),
    planUsed: v.string(),
    hasWatermark: v.boolean(),
    qualityLevel: v.union(v.literal("standard"), v.literal("hd"), v.literal("ultra_hd")),
  },
  handler: async (ctx, args) => {
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

    if (user.credits < args.creditsUsed) {
      throw new Error("Insufficient credits");
    }
    
    const now = Date.now();
    
    await ctx.db.patch(user._id, {
      credits: user.credits - args.creditsUsed,
      monthlyCreditsUsed: user.monthlyCreditsUsed + args.creditsUsed,
      videoGeneratedThisMonth: user.videoGeneratedThisMonth + 1,
      videoGeneratedToday: user.videoGeneratedToday + 1,
      lastActiveAt: now,
      updatedAt: now,
    });
    
    const videoRecordId = await ctx.db.insert("videos", {
      ...args,
      userId: user._id,
      userEmail: user.email!, // Use the non-null assertion as `email` is `v.string()` in the schema
    });
    
    await ctx.db.insert("generationStats", {
      userId: user._id,
      type: "video",
      generatedAt: new Date().toISOString(),
      success: true,
      model: "your-video-model",
      creditsUsed: args.creditsUsed,
      planUsed: args.planUsed,
      processingTimeMs: 0,
    });

    return videoRecordId;
  },
});
// Get videos by user
export const getUserVideos = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userId) {
      return [];
    }
    
    return await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
  },
});

// Get all videos for a user (if no auth system)
export const getAllUserVideos = query({
  args: { userEmail: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.userEmail) {
      return await ctx.db.query("videos").order("desc").collect();
    }
    
    return await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("userEmail"), args.userEmail))
      .order("desc")
      .collect();
  },
});

// Get videos by original image
export const getVideosByImage = query({
  args: { originalImageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("originalImageId"), args.originalImageId))
      .collect();
  },
});

// Get single video by ID
export const getVideo = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.videoId);
  },
});

// Update video status
export const updateStatus = mutation({
  args: {
    videoId: v.id("videos"),
    status: v.union(v.literal("generating"), v.literal("completed"), v.literal("failed")),
    generationError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.videoId, {
      status: args.status,
      generationError: args.generationError,
    });
  },
});

// Delete video
export const deleteVideo = mutation({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.videoId);
  },
});

// Get recent videos (for dashboard/admin)
export const getRecentVideos = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query("videos")
      .order("desc")
      .take(limit);
  },
});

// Count user's videos today (for usage tracking)
export const countUserVideosToday = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const videos = await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    
    return videos.filter(video => 
      video.generatedAt.startsWith(today)
    ).length;
  },
});