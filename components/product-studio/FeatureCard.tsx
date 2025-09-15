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

const FeatureCard = ({ feature, onClick }: { feature: Feature; onClick: (feature: string | undefined) => void }) => {
    return (
  <Card
  onClick={() => onClick(feature?.type)}
  className={`group cursor-pointer bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-[#030918] dark:via-[#030918] dark:to-gray-600/20 min-h-[50vh] shadow-sm dark:shadow-gray-900/50 hover:shadow-md dark:hover:shadow-gray-700/70 transition-shadow duration-300 ${
    feature.type === 'Image' ? 'border border-gray-200 dark:border-gray-700 hover:border-[#675ad4]' : 'border border-gray-200 dark:border-gray-700 hover:border-yellow-400'
  }`}
>
  <CardHeader className='flex items-center gap-3 p-4'>
    <feature.icon className={`h-10 w-10 p-2 rounded-lg ${feature.type === 'Image' ? 'text-[#675ad4] bg-[#675ad4]/10 dark:bg-[#675ad4]/20' : 'text-yellow-500 bg-yellow-500/10 dark:bg-yellow-500/20'}`} />
    <div className='flex flex-col justify-center'>
      <CardTitle className={`text-lg font-semibold group-hover:transition-colors ${feature.type === 'Image' ? 'group-hover:text-[#675ad4]' : 'group-hover:text-yellow-400'}`}>{feature.title}</CardTitle>
      <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>{feature.description}</CardDescription>
    </div>
  </CardHeader>
  <CardContent className='grid grid-cols-3 gap-4 p-4'>
    <div className='flex justify-center items-center h-28 w-28 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100 dark:from-[#131950] dark:via-[#030918] dark:to-gray-600/20 rounded-lg hover:scale-105 transition-transform duration-200'>
      {feature.type === 'Image' ? <ImageIcon className='h-8 w-8 text-[#675ad4]' /> : <VideoIcon className='h-8 w-8 text-yellow-500' />}
    </div>
    <div className='flex justify-center items-center h-28 w-28 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100  dark:from-[#131950] dark:via-[#030918] dark:to-gray-600/20 rounded-lg hover:scale-105 transition-transform duration-200'>
      {feature.type === 'Image' ? <ImageIcon className='h-8 w-8 text-[#675ad4]' /> : <VideoIcon className='h-8 w-8 text-yellow-500' />}
    </div>
    <div className='flex justify-center items-center h-28 w-28 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-100  dark:from-[#131950] dark:via-[#030918] dark:to-gray-600/20 rounded-lg hover:scale-105 transition-transform duration-200'>
      {feature.type === 'Image' ? <ImageIcon className='h-8 w-8 text-[#675ad4]' /> : <VideoIcon className='h-8 w-8 text-yellow-500' />}
    </div>
  </CardContent>
  <CardFooter className='p-4'>
    <Button className={`w-full cursor-pointer ${feature.type === 'Image' ? 'bg-[#675ad4] hover:bg-[#5a4ec4]' : 'bg-yellow-500 hover:bg-yellow-400'} text-white font-medium transition-colors duration-200`}>
      Create {feature.type}
    </Button>
  </CardFooter>
</Card>
    )
}

export default FeatureCard