'use client'
import { ArrowLeft, CircleDot, Sparkles, Upload } from 'lucide-react'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import productStudioHero from "@/assets/product-studio-hero.jpg";

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

const videoStyles = [
    "3D Product Rotation",
    "Slideshow Transition",
    "Zoom & Focus Effect",
    "Floating Animation",
    "Split Screen Showcase"
];

const ImageGenerationInterface = () => {
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedStyle, setSelectedStyle] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResults, setGeneratedResults] = useState<any[]>([]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate generation process
        setTimeout(() => {
            setGeneratedResults([
                { id: 1, type: 'image', url: productStudioHero, style: selectedStyle },
                { id: 2, type: 'image', url: productStudioHero, style: selectedStyle },
                { id: 3, type: 'image', url: productStudioHero, style: selectedStyle },
                { id: 4, type: 'image', url: productStudioHero, style: selectedStyle },
            ]);
            setIsGenerating(false);
        }, 3000);
    };

    return (
        <div className='flex'>
            <div className='w-full md:w-1/3'>
                <div className='flex gap-6 items-center p-4'>
                    <div className='flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700 font-medium'>
                        <ArrowLeft className='h-6 w-6' />
                        <h3>Back</h3>
                    </div>
                    <h1 className='text-2xl font-bold'>Image Generator</h1>
                </div>
                <div className='border border-gray-800 rounded-lg p-4 m-1'>
                    <Card className="my-1 bg-[#1a1f2d] border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload Product
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop your product image or click to upload
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sample Products */}
                    <Card className="my-2 bg-[#1a1f2d] border-none">
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
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        <div className="text-2xl text-center mb-1">{product.image}</div>
                                        <p className="text-xs text-center text-muted-foreground">{product.name}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card className="my-2 bg-[#1a1f2d] border-none">
                        <CardHeader>
                            <CardTitle>Generation Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Product Description</label>
                                <Textarea
                                    placeholder="Describe your product and desired scene..."
                                    value={productDescription}
                                    style={{
                                        backgroundColor:'#11131c'
                                    }}
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div >
                                <label className="w-full text-sm font-medium mb-2 block">Style</label>
                                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                                    <SelectTrigger style={{
                                        backgroundColor:'#11131c',
                                        width:'100%'
                                    }}>
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
                                disabled={isGenerating || (!selectedProduct && !productDescription)}
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
            <div className='w-full md:w-2/3 border border-gray-800 rounded-lg m-1'>
                <div className='flex gap-6 items-center py-4 px-5'>
                    <h1 className='text-2xl font-bold'>Generated Results</h1>
                </div>
            </div>
        </div>
    )
}

export default ImageGenerationInterface