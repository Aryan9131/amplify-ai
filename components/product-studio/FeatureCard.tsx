import React from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { Feature } from '@/app/(pages)/product-studio/page'
import { ImageIcon, VideoIcon } from 'lucide-react'
import { Button } from '../ui/button'

const FeatureCard = ({ feature, onClick }: { feature: Feature; onClick:(feature:string | undefined)=>void }) => {
    return (
        <Card onClick={()=>onClick(feature?.type)} className={`group cursor-pointer bg-gradient-to-br from-[#030918] to-gray-600/20 min-h-[50vh] ${feature.type === 'Image' ? 'border hover:border-[#675ad4]' : 'border hover:border-yellow-400'}`}>
            <CardHeader className='flex items-center gap-3'>
                <feature.icon className={`h-10 w-10 p-2 rounded-lg ${feature.type === 'Image' ? 'text-[#675ad4] bg-[#675ad4]/20' : 'text-yellow-500 bg-yellow-500/20'}`} />
                <div className='flex flex-col justify-center'>
                    <CardTitle className={`text-lg font-semibold group-hover:transition-colors ${feature.type === 'Image' ? 'group-hover:text-[#675ad4]' : 'group-hover:text-yellow-400'}`}>{feature.title}</CardTitle>
                    <CardDescription className='text-md text-muted-foreground'>{feature.description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className='grid grid-cols-3 gap-3'>
                <div className='flex justify-center items-center h-28 w-26 bg-gradient-to-br from-[#1a1d35] to-muted/20 rounded-lg'>
                    {
                        feature.type == 'Image' ?
                            <ImageIcon className='h-8 w-8 text-[#675ad4]' />
                            :
                            <VideoIcon className='h-8 w-8 text-[#675ad4]' />

                    }
                </div>
                <div className='flex justify-center items-center h-28 w-26 bg-gradient-to-br from-[#1a1d35] to-muted/20 rounded-lg'>
                    {
                        feature.type == 'Image' ?
                            <ImageIcon className='h-8 w-8 text-[#675ad4]' />
                            :
                            <VideoIcon className='h-8 w-8 text-[#675ad4]' />
                    }
                </div>
                <div className='flex justify-center items-center h-28 w-26 bg-gradient-to-br from-[#1a1d35] to-muted/20 rounded-lg'>
                    {
                        feature.type == 'Image' ?
                            <ImageIcon className='h-8 w-8 text-[#675ad4]' />
                            :
                            <VideoIcon className='h-8 w-8 text-[#675ad4]' />
                    }
                </div>
            </CardContent>
            <CardFooter>
                <Button className={'w-full cursor-pointer ' + (feature.type === 'Image' ? 'bg-[#7264f1] hover:bg-[#7264f1]' : 'bg-[#e6b009] hover:bg-[#e6b009]')}>Create {feature.type}</Button>
            </CardFooter>
        </Card>
    )
}

export default FeatureCard