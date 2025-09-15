'use client';

import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import {
    ArrowLeft,
    Upload,
    Sparkles,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import productStudioHero from '@/public/images/product-studio-hero.png';
import axios from 'axios'
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import GeneratedImagesList from './ImageList';
import { Input } from '../ui/input';

// Dummy data for samples and styles
const sampleProducts = [
    { id: 1, name: "Water Bottle", image: "🍶", category: "beverage" },
    { id: 2, name: "Sneakers", image: "👟", category: "fashion" },
    { id: 3, name: "Coffee Mug", image: "☕", category: "kitchenware" },
    { id: 4, name: "Laptop", image: "💻", category: "tech" },
    { id: 5, name: "Headphones", image: "🎧", category: "tech" },
    { id: 6, name: "Perfume", image: "🧴", category: "beauty" },
];

const imageStyles = [
    "Modern & Clean",
    "Vintage & Retro",
    "Minimalist",
    "Luxury & Premium",
    "Colorful & Vibrant",
    "Natural & Organic"
];

interface FormInput {
    file?: File;
    imageUrl?: string;
    description: string;
    size?: string;
}

interface Image {
    _id:string,
    imageId: string,
    imageUrl: string,
    fileName: string,
    fileSize: number,
    productName: string,
    style: string,
    size: string,
    description: string,
    generatedAt: string,
    status?: "generating" | "completed" | "failed",
    generationError?: string,
    userId?: string,
    userEmail?: string,
    videoPrompt:string
}

const ImageGenerationInterface = ({ onClick }: { onClick: () => void }) => {
    const { user } = useUser();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedStyle, setSelectedStyle] = useState('');
    const [description, setDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState<Image | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [generatedImages, setGeneratedImages] = useState<Image>();

    // Reference to the hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        const formData = new FormData();

        // Check if a file exists before appending it
        if (file) {
            formData.append('file', file);
        }

        // Append other data as strings
        formData.append('userId', user?.id as string)
        formData.append('description', description);
        formData.append('selectedProduct', "T-shirt"); // Stringify non-file objects
        formData.append('selectedStyle', selectedStyle);
        try {
            const result = await axios.post('/api/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(result.data);
            setGeneratedResult(result.data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    // Correctly handle the click on the upload box to trigger the hidden file input
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className='flex'>
            <div className='w-full md:w-1/3'>
                <div className='flex gap-6 items-center p-4'>
                    <div onClick={onClick} className='flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-500 font-medium'>
                        <ArrowLeft className='h-6 w-6' />
                        <h3>Back</h3>
                    </div>
                    <h1 className='text-2xl font-bold'>Image Generator</h1>
                </div>
                <div className='border dark:border-gray-800/30 rounded-lg p-4 m-1'>
                    <Card className="my-1 dark:bg-[#1a1f2d] border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload Product
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                                onClick={handleUploadClick}
                            >
                                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop your product image or click to upload
                                </p>
                            </div>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                name="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e) => {
                                    const selectedFile = e.target.files ? e.target.files[0] : null;
                                    setFile(selectedFile);
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Sample Products */}
                    {/* <Card className="my-2 bg-[#1a1f2d] border-none">
                        <CardHeader>
                            <CardTitle>Or Choose a Sample</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-3">
                                {sampleProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary ${selectedProduct?.id === product.id ? 'border-primary bg-primary/10' : 'border-gray-500/20'
                                            }`}
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            // Clear the file input when a sample is selected
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                    >
                                        <div className="text-2xl text-center mb-1">{product.image}</div>
                                        <p className="text-xs text-center text-muted-foreground">{product.name}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card> */}

                    {/* Settings */}
                    <Card className="my-2 dark:bg-[#1a1f2d] border-none">
                        <CardHeader>
                            <CardTitle>Generation Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Product Category</label>
                                <Input
                                    name="selectedProduct" // Add a name attribute
                                    placeholder="e.g; T-shirt, Sport Shoes..."
                                    value={selectedProduct}
                                    className='dark:bg-[#11131c]'
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Product Description</label>
                                <Textarea
                                    name="productDescription" // Add a name attribute
                                    placeholder="Describe your product and desired scene..."
                                    value={description}
                                    className='dark:bg-[#11131c]'
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="w-full text-sm font-medium mb-2 block">Style</label>
                                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                                    <SelectTrigger   className='dark:bg-[#11131c] w-full'>
                                        <SelectValue placeholder="Choose style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {imageStyles.map((style) => (
                                            <SelectItem key={style} value={style}>{style}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full btn-hero"
                                onClick={handleGenerate}
                                disabled={isGenerating || (!selectedProduct && !file && !description)}
                            >
                                {isGenerating ? (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Generate Images
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className='w-full md:w-2/3 rounded-lg dark:border dark:border-gray-800/30 m-1'>
                <div className='flex flex-col gap-2 items-start py-4 px-5'>
                    <h1 className='text-2xl font-bold'>Generated Results :</h1>
                    <hr className='w-full border '/>
                </div>
                <div className='my-2 '>
                      <GeneratedImagesList userId={user?.id} generatedResult={generatedResult}/>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerationInterface;