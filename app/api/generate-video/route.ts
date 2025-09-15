import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { imagekit } from "@/lib/imagekit";


// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// RunPod API configuration
const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;
const ENDPOINT = "wan-2-1-i2v-720";

export async function POST(req: Request) {
    try {
        const {
            imageId,
            imageUrl,
            videoPrompt,
            productName,
            style,
            description,
            selectedProduct
        } = await req.json();

        if (!imageUrl || !imageId) {
            return NextResponse.json(
                { error: "Image URL and Image ID are required" },
                { status: 400 }
            );
        }

        console.log(`🎬 Starting video generation for: ${productName || selectedProduct}`);

        // Step 1: Generate video using RunPod WAN 2.1 I2V API
        console.log("🎬 Generating video with RunPod WAN 2.1 I2V...");

        const runpodResponse = await fetch(`https://api.runpod.ai/v2/${ENDPOINT}/runsync`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${RUNPOD_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                input: {
                    prompt: videoPrompt || "Professional promotional video, cinematic quality, smooth camera movement",
                    image: imageUrl,
                    max_tokens: 256,
                    temperature: 0.7,
                    num_inference_steps: 30,
                    guidance: 5,
                    negative_prompt: "blurry, low quality, distorted, amateur",
                    size: "1280*720",
                    duration: 5,
                    flow_shift: 5,
                    seed: -1,
                    enable_prompt_optimization: true,
                    enable_safety_checker: true
                }
            })
        });

        if (!runpodResponse.ok) {
            const errorText = await runpodResponse.text();
            throw new Error(`RunPod API error: ${runpodResponse.status} ${errorText}`);
        }

        const runpodData = await runpodResponse.json();
        console.log("response runpodData : ", runpodData);

        // Extract video URL from RunPod response - check all possible locations
        const videoUrl = runpodData.output?.result ||
            runpodData.output?.video_url ||
            runpodData.output?.url ||
            runpodData.result ||
            runpodData.video_url ||
            runpodData.url;

        if (!videoUrl) {
            console.error("❌ No video URL found in RunPod response:", runpodData);
            throw new Error("No video URL returned from RunPod API");
        }

        console.log("✅ Video generated successfully:", videoUrl);

        // Step 2: Download the video from RunPod
        console.log("⬇️ Downloading video from RunPod...");
        const videoResponse = await fetch(videoUrl);

        if (!videoResponse.ok) {
            throw new Error(`Failed to download video: ${videoResponse.status}`);
        }

        const videoBuffer = await videoResponse.arrayBuffer();
        const videoBufferNode = Buffer.from(videoBuffer); // Convert to Node.js Buffer

        // Step 3: Upload video to ImageKit
        console.log("⬆️ Uploading video to ImageKit...");

        // Sanitize product name for folder path (remove special characters, spaces, etc.)
        const sanitizeForPath = (str: string) => {
            return str
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphens
                .replace(/-+/g, '-')        // Replace multiple hyphens with single
                .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens
        };

        const sanitizedProductName = sanitizeForPath(productName || selectedProduct || 'general');
        const fileName = `video_${imageId}_${Date.now()}.mp4`;

        // Await the ImageKit upload
        const imagekitResponse = await imagekit.upload({
            file: videoBufferNode,
            fileName: fileName,
            folder: "/amplify/generated"
        });

        console.log("✅ Video uploaded to ImageKit:", imagekitResponse.url);

        // Step 4: Save video details to Convex using your existing schema
        console.log("💾 Saving video details to Convex...");

        // Corrected video generation code in route.ts
        try {
            const videoRecord = await convex.mutation(api.videos.createVideo, {
                videoId: imagekitResponse.fileId,
                videoUrl: imagekitResponse.url,
                fileName: imagekitResponse.name,
                fileSize: imagekitResponse.size,
                originalImageId: imageId,
                originalImageUrl: imageUrl,
                videoPrompt: videoPrompt || `Professional promotional video for ${productName || selectedProduct}`,
                productName: productName || selectedProduct || 'Unknown Product',
                style: style || 'promotional',
                description: description || '',
                selectedProduct: selectedProduct ? {
                    id: 1,
                    name: selectedProduct,
                    image: imageUrl,
                    category: 'Generated'
                } : {
                    id: 1,
                    name: productName || 'Unknown Product',
                    image: imageUrl,
                    category: 'Generated'
                },
                generatedAt: new Date().toISOString(),
                status: "completed" as const,

                // Pass the new arguments for the mutation
                creditsUsed: 10, // Example credit cost for video generation
                planUsed: 'pro', // This should be fetched from the user object on the client-side
                hasWatermark: false, // This should be determined by the user's plan
                qualityLevel: 'hd' as const,
            });
            console.log("✅ Video saved to Convex with ID:", videoRecord);
        } catch (convexError) {
            console.warn("⚠️ Failed to save to Convex:", convexError);
        }

        // Step 5: Return success response
        return NextResponse.json({
            success: true,
            message: "Video generated and saved successfully!",
            data: {
                videoId: imagekitResponse.fileId,
                videoUrl: imagekitResponse.url,
                thumbnailUrl: imagekitResponse.thumbnailUrl || imageUrl,
                fileName: imagekitResponse.name,
                fileSize: imagekitResponse.size,
                duration: 5,
                resolution: "1280x720",
                format: "mp4",
                sourceImageId: imageId,
                productName: productName || selectedProduct,
                generatedAt: new Date().toISOString(),
                // Additional URLs for fallback
                runpodUrl: videoUrl,
                downloadUrl: imagekitResponse.url
            }
        });

    } catch (error: any) {
        console.error("❌ Video generation error:", error);

        // Return detailed error information
        return NextResponse.json({
            success: false,
            error: error.message || "Video generation failed",
            details: {
                timestamp: new Date().toISOString(),
                service: error.message.includes('RunPod') ? 'RunPod' :
                    error.message.includes('ImageKit') ? 'ImageKit' :
                        error.message.includes('Convex') ? 'Convex' : 'Unknown'
            }
        }, { status: 500 });
    }
}