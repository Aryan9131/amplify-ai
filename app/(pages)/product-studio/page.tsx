'use client'
import { ArrowLeft, CircleDot, Sparkles, ImageIcon, Video, Download, Eye } from 'lucide-react'
import React, { useState } from 'react'

import FeatureCard from '@/components/product-studio/FeatureCard';
import StatCard from '@/components/product-studio/StatCard';
import ImageGenerationInterface from '@/components/product-studio/ImageGenerationInterface';

export interface Feature {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    type?: string;
}

const features: Feature[] = [
    {
        id: 'Product Images',
        title: 'Product Images',
        description: 'AI generated product images',
        icon: ImageIcon,
        type: "Image"
    },
    {
        id: 'Promotional Videos',
        title: 'Promotional Videos',
        description: 'AI-generated promotional videos',
        icon: Video,
        type: "Video"
    }
];

const page = () => {
    const [clickedFeature, setClickedFeature] = useState<string | undefined>(undefined);
    return (
        !clickedFeature
            ?
            <div>
                <div className='flex justify-between items-center p-4 border-b'>
                    <div className='flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700 font-medium'>
                        <ArrowLeft className='h-6 w-6' />
                        <h3>Back to Dashboard</h3>
                    </div>
                    <span className='flex items-center gap-1 text-sm font-medium text-green-400 border border-green-400/20 bg-green-400/10 px-3 py-1 rounded-md'>
                        <CircleDot className='h-4 w-4' />
                        <span>Online</span>
                    </span>
                </div>
                <div className='p-4 my-5 flex flex-col gap-4 justify-center items-center'>
                    <h5 className='text-md flex items-center gap-2 font-semibold bg-[#1a1d35] text-[#675ad4] rounded-xl px-3 py-1'> <Sparkles className='h-4 w-4' /> Product Studio</h5>
                    <h1 className=' text-2xl md:text-4xl text-[#8f64f1] font-bold'>AI-Powered Product Content</h1>
                    <p className='text-xl text-gray-500'>Create professional product visuals with advanced AI technology</p>
                </div>
                <div className='w-full flex flex-wrap'>
                    <div className='w-[70%] grid grid-cols-1 md:grid-cols-2 p-4 gap-4'>
                        {features.map((feature) => (
                            <FeatureCard key={feature.id} feature={feature} onClick={(feature:string | undefined)=>setClickedFeature(feature)} />
                        ))}
                    </div>
                    <div className='w-[30%] grid grid-cols-1 p-4 gap-4'>
                        <StatCard />
                    </div>
                    {/* Features Row */}
                    <div className="w-full grid md:grid-cols-3 gap-6 px-3 py-8 border-t border-border/50 ">
                        {[
                            { icon: Sparkles, title: "AI-Powered", desc: "Advanced generation algorithms" },
                            { icon: Download, title: "High Quality", desc: "Professional-grade output" },
                            { icon: Eye, title: "Multiple Formats", desc: "Images, videos & animations" }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-lg hover:bg-blue-50/10 transition-colors">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <feature.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm">{feature.title}</h5>
                                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            :
            <ImageGenerationInterface />
    )
}

export default page