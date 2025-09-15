// convex/images.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Create a new image record and handle credit deduction
export const createImage = mutation({
  args: {
    // Other image-related arguments
    imageId: v.string(),
    imageUrl: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    productName: v.string(),
    style: v.string(),
    size: v.string(),
    description: v.string(),
    generatedAt: v.string(),
    status: v.union(v.literal("generating"), v.literal("completed"), v.literal("failed")),
    generationError: v.optional(v.string()),
    videoPrompt: v.string(),

    // These new arguments are passed from the frontend
    creditsUsed: v.number(),
    qualityLevel: v.union(v.literal("standard"), v.literal("hd"), v.literal("ultra_hd")),
  },
  handler: async (ctx, args) => {
    // 1. Fetch user identity from the authenticated session
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // 2. Query the 'users' table using the token identifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    // 3. Check if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // 4. Check for sufficient credits
    if (user.credits < args.creditsUsed) {
      throw new Error("Insufficient credits");
    }

    const now = Date.now();
    
    // 5. Deduct credits and update usage stats on the user document
    await ctx.db.patch(user._id, {
      credits: user.credits - args.creditsUsed,
      monthlyCreditsUsed: user.monthlyCreditsUsed + args.creditsUsed,
      imageGeneratedThisMonth: user.imageGeneratedThisMonth + 1,
      lastActiveAt: now,
      updatedAt: now,
    });
    
    // 6. Insert the new image record
    const imageRecordId = await ctx.db.insert("images", {
      ...args,
       planUsed: user.plan, // Pass the user's current plan
       hasWatermark: user.plan=='free' ? false : true, // Logic based on user's plan
      userId: user._id, // Set the userId from the fetched user object
    });
    
    // 7. Record generation stats
    await ctx.db.insert("generationStats", {
      userId: user._id,
      type: "image",
      generatedAt: new Date().toISOString(),
      success: true,
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      creditsUsed: args.creditsUsed,
      planUsed: user.plan,
    });

    return imageRecordId;
  },
});


// Update image status (useful for async generation)
// export const updateimageStatus = mutation({
//   args: {
//     imageId: v.id("images"),
//     status: v.union(v.literal("generating"), v.literal("completed"), v.literal("failed")),
//     generationError: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.imageId, {
//       status: args.status,
//       generationError: args.generationError,
//     });
//   },
// });

// Get all images for a user
export const getUserImages = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db
        .query("images")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .collect();
    } else {
      // If no userId, return all images (for admin or demo purposes)
      return await ctx.db
        .query("images")
        .order("desc")
        .take(50); // Limit to last 50
    }
  },
});

// Get image by original image ID
export const getimageByImageId = query({
  args: { imageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("images")
      .filter((q) => q.eq(q.field("_id"), args.imageId))
      .first();
  },
});

// Get image by ID
export const getimage = query({
  args: { imageId: v.id("images") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.imageId);
  },
});

// Delete image
export const deleteimage = mutation({
  args: { imageId: v.id("images") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.imageId);
  },
});

// Track generation stats
// export const trackGeneration = mutation({
//   args: {
//     userId: v.optional(v.string()),
//     type: v.union(v.literal("image"), v.literal("image")),
//     generatedAt: v.string(),
//     success: v.boolean(),
//     model: v.string(),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.insert("generationStats", args);
//   },
// });

// Return the last 100 tasks in a given task list.
export const getImageList = query({
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("images")
      .order("desc")
      .take(100);
    return tasks;
  },
});