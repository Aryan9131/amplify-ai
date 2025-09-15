import { NextResponse } from "next/server";
import ImageKit from "imagekit";
import { imagekit } from "@/lib/imagekit";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Initialize Convex Client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // Get the file using its key
        const file = formData.get('file') as File | null;

        const userId = formData.get('userId') as string;
        const userPlan = formData.get('userPlan') as string;

        // Get other string data
        const description = formData.get('description') as string;
        const selectedProduct = formData.get('selectedProduct') as string;
        const selectedStyle = formData.get('selectedStyle') as string;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
            }, { status: 400 });
        }

        // Check file size (e.g., 10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            return NextResponse.json({
                success: false,
                error: 'File size too large. Maximum 10MB allowed.'
            }, { status: 400 });
        }

        // Convert file to buffer for ImageKit upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        const extension = file.name.split('.').pop();
        const fileName = `${originalName}_${timestamp}.${extension}`;

        // Upload original image to ImageKit
        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: fileName,
            folder: "/amplify/uploads",
            tags: ["user-upload", selectedStyle],
        });

        console.log('ImageKit upload successful:', uploadResponse.fileId);

        // DYNAMIC IMAGE ANALYSIS + GENERATION
        let generatedImageUrl = null;
        let generatedImageFileId = null;
        let videoPrompt = null;
        let aiGenerationError = null;

        try {
            let productAnalysis = "";
            let generatedImageBuffer = null;

            // METHOD 1: OpenRouter Vision API (Best Option - Works 100%)
            // METHOD 1: Google Gemini Vision API (primary analysis)
            if (process.env.GOOGLE_API_KEY) {
                try {
                    console.log("Analyzing image with Google Gemini Vision...");

                    const imageBase64 = buffer.toString('base64');

                    const geminiResponse = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                contents: [{
                                    parts: [
                                        {
                                            text: "Analyze this product image in detail. Describe: product type, packaging, colors, branding, size/volume, material, and visible text/logos. Be very specific and objective."
                                        },
                                        {
                                            inline_data: {
                                                mime_type: file.type,
                                                data: imageBase64
                                            }
                                        }
                                    ]
                                }]
                            })
                        }
                    );

                    if (geminiResponse.ok) {
                        const geminiResult = await geminiResponse.json();
                        productAnalysis = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || "";
                        console.log("Gemini Vision Analysis:", productAnalysis);
                    } else {
                        console.log("Gemini Vision failed:", geminiResponse.status);
                    }
                } catch (geminiError) {
                    console.log("Gemini Vision error:", geminiError);
                }
            }


            // METHOD 2: Use Google Gemini directly (Free with API key)
            if (!productAnalysis && process.env.GOOGLE_API_KEY) {
                try {
                    console.log("Trying Google Gemini Vision...");

                    const imageBase64 = buffer.toString('base64');

                    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    {
                                        text: "Analyze this product image in detail. Describe the product type, packaging, colors, branding, size, material, and any visible text. Be very specific."
                                    },
                                    {
                                        inline_data: {
                                            mime_type: file.type,
                                            data: imageBase64
                                        }
                                    }
                                ]
                            }]
                        })
                    });

                    if (geminiResponse.ok) {
                        const geminiResult = await geminiResponse.json();
                        productAnalysis = geminiResult.candidates[0].content.parts[0].text;
                        console.log("Gemini Vision Analysis:", productAnalysis);
                    }
                } catch (geminiError) {
                    console.log("Gemini Vision failed:", geminiError);
                }
            }

            // METHOD 3: Fallback to filename analysis only if vision completely fails
            // METHOD 5: Enhanced filename analysis (absolute last resort)
            if (!productAnalysis) {
                console.log("All vision models failed, using enhanced filename analysis...");
                const filename = file.name.toLowerCase();

                // Extract meaningful information from filename
                let productType = selectedProduct || "product";
                let sizeInfo = "";
                let containerHint = "";

                // Size extraction
                const sizeMatch = filename.match(/(\d+)\s*(ml|l|kg|g|oz|lb)/i);
                if (sizeMatch) sizeInfo = `${sizeMatch[1]}${sizeMatch[2].toLowerCase()} `;

                // Basic container type hints
                if (filename.includes('can') || filename.includes('cane')) {
                    containerHint = "aluminum can container";
                } else if (filename.includes('bottle')) {
                    containerHint = "bottle container";
                } else if (filename.includes('packet') || filename.includes('pack')) {
                    containerHint = "packet packaging";
                } else if (filename.includes('box')) {
                    containerHint = "box packaging";
                } else {
                    containerHint = "commercial packaging";
                }

                productAnalysis = `This appears to be a ${sizeInfo}${productType} in ${containerHint} format, suitable for retail display and commercial advertising`;
                console.log("Enhanced filename analysis:", productAnalysis);
            }

            // Create dynamic advertisement prompt using actual analysis
            const adPrompt = `Create a professional advertisement showcasing: ${productAnalysis}. Transform this into a dynamic commercial image with: vibrant splash effects or relevant visual elements around the product, clean colorful background that complements the product, floating elements related to the product's theme and industry, sharp product focus with motion and energy, professional commercial lighting and photography. Style: ${selectedStyle}. Additional context: ${description}. Maintain the exact product characteristics described in the analysis. High-end advertising, 4K resolution, marketing ready, premium commercial photography quality.`;

            console.log("Dynamic advertisement prompt:", adPrompt);

            // 2. Try DeepAI (free img generation)
            if (productAnalysis && process.env.DEEPAI_API_KEY) {
                try {
                    console.log("*** Trying DEEPAI_MODEL .... ")
                    const res = await fetch('https://api.deepai.org/api/text2img', {
                        method: 'POST',
                        headers: {
                            'Api-Key': process.env.DEEPAI_API_KEY,
                        },
                        body: new URLSearchParams({
                            text: adPrompt
                        })
                    });
                    if (res.ok) {
                        const j = await res.json();
                        if (j.output_url) {
                            generatedImageBuffer = await fetch(j.output_url).then(r => r.arrayBuffer());
                            console.log("DeepAI generation success");
                        }
                    } else {
                        console.log("DeepAI failed:", res.status);
                    }
                } catch (err) {
                    console.log("DeepAI error:", err);
                }
            }


            // Generate image using working text-to-image models with dynamic analysis
            if (!generatedImageBuffer) {
                const models = [
                    "stabilityai/stable-diffusion-xl-base-1.0", // Best quality
                    "runwayml/stable-diffusion-v1-5",           // Reliable fallback
                    "CompVis/stable-diffusion-v1-4"             // Emergency fallback
                ];

                for (const model of models) {
                    try {
                        console.log(`Trying model: ${model}`);
                        const response = await fetch(
                            `https://api-inference.huggingface.co/models/${model}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
                                    "Content-Type": "application/json",
                                },
                                method: "POST",
                                body: JSON.stringify({
                                    inputs: adPrompt,
                                    parameters: {
                                        negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy, watermark, text, signature, logo, username, grainy, pixelated, low resolution, wrong product type, different characteristics than described",
                                        num_inference_steps: 50,
                                        guidance_scale: 7.5,
                                        width: 1024,
                                        height: 1024,
                                    }
                                }),
                            }
                        );

                        if (response.ok) {
                            generatedImageBuffer = await response.arrayBuffer();
                            console.log(`Successfully generated image using model: ${model}`);
                            break;
                        } else {
                            console.log(`Model ${model} failed:`, response.status);
                            if (response.status === 503) {
                                await new Promise(resolve => setTimeout(resolve, 2000));
                            }
                        }
                    } catch (modelError) {
                        console.log(`Error with model ${model}:`, modelError);
                        continue;
                    }
                }
            }

            if (generatedImageBuffer) {
                // Upload generated image to ImageKit
                const generatedFileName = `generated_${originalName}_${timestamp}.png`;
                const generatedUploadResponse = await imagekit.upload({
                    file: Buffer.from(generatedImageBuffer),
                    fileName: generatedFileName,
                    folder: "/amplify/generated-images",
                    tags: ["ai-generated", "advertisement", selectedStyle, "vision-analyzed"],
                });

                generatedImageUrl = generatedUploadResponse.url;
                generatedImageFileId = generatedUploadResponse.fileId;

                console.log('Generated image uploaded successfully:', generatedUploadResponse.fileId);
            } else {
                throw new Error('All Hugging Face models failed');
            }

            // Generate video prompt using dynamic analysis
            videoPrompt = `Create a dynamic promotional video showcasing: ${productAnalysis}. Include smooth camera movements, elegant transitions, professional product focus, animated effects relevant to this specific product type, premium lighting and marketing appeal. Style: ${selectedStyle.toLowerCase()}. Add smooth zoom and rotation effects, end with prominent product display. Duration: 5-10 seconds. High-end commercial quality.`;

        } catch (error) {
            console.error('AI image generation failed:', error);
            aiGenerationError = error instanceof Error ? error.message : 'AI processing failed';

            // Fallback: use original image and create default video prompt
            generatedImageUrl = uploadResponse.url;
            generatedImageFileId = uploadResponse.fileId;
            videoPrompt = `Create a dynamic promotional video showcasing this ${selectedProduct} with smooth camera movements, elegant transitions, and professional product focus. ${selectedStyle} style with premium lighting and marketing appeal. Include dynamic effects and motion graphics. Duration: 5-10 seconds.`;
        }

        // ✅ CREATE CONVEX DATABASE ENTRY HERE (Backend)
        const imageData = {
            imageId: generatedImageFileId,
            imageUrl: generatedImageUrl,
            fileName: `generated_${originalName}_${timestamp}.png`,
            fileSize: uploadResponse.size,
            productName: selectedProduct,
            style: selectedStyle,
            size: "1024x1024", // or whatever size you're generating
            description: description,
            generatedAt: new Date().toISOString(),
            status: "completed" as const,
            videoPrompt: videoPrompt || "",
            // 👇 NEW ARGS BASED ON UPDATED MUTATION
            creditsUsed: 1, // Example credit cost
            qualityLevel: 'standard' as const, // Example quality
        };

        // Save to Convex database and deduct credits
        let convexImageId = null;
        try {
            convexImageId = await convex.mutation(api.images.createImage, imageData);
            console.log('✅ Image saved to Convex database and credits deducted:', convexImageId);
        } catch (convexError) {
            console.error('❌ Failed to save to Convex:', convexError);
            // You should handle this error gracefully on the front end
            // For example, by telling the user that the operation failed
        }
        // Return comprehensive response
        return NextResponse.json({
            success: true,
            message: 'File uploaded and processed successfully',
            data: {
                // Original upload data
                original: {
                    fileId: uploadResponse.fileId,
                    url: uploadResponse.url,
                    thumbnailUrl: uploadResponse.thumbnailUrl,
                    fileName: uploadResponse.name,
                    size: uploadResponse.size,
                },
                // Generated advertisement data
                generated: {
                    imageUrl: generatedImageUrl,
                    imageFileId: generatedImageFileId,
                    videoPrompt: videoPrompt,
                    hasAiGeneration: !aiGenerationError,
                    aiError: aiGenerationError,
                },
                // Metadata for database storage
                metadata: {
                    description,
                    selectedProduct,
                    selectedStyle,
                    uploadedAt: new Date().toISOString(),
                    videoPrompt,
                }
            }
        });

    } catch (error) {
        console.error('Error processing upload:', error);

        if (error instanceof Error) {
            return NextResponse.json({
                success: false,
                error: `Upload failed: ${error.message}`
            }, { status: 500 });
        }

        return NextResponse.json({
            success: false,
            error: 'Internal Server Error'
        }, { status: 500 });
    }
}