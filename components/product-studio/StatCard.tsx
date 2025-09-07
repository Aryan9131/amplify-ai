import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Wand2 } from 'lucide-react'
const StatCard = () => {
    return (
        <>
            <Card className='bg-gradient-to-br from-[#030918] to-gray-600/20 h-45 gap-2'>
                <CardHeader >
                    <h3 className='text-lg font-semibold'>Studio Stats</h3>
                </CardHeader>
                <CardContent className='text-gray-400 '>
                    <div className='flex w-full justify-between'>
                        <span>Images Created</span>
                        <span className='font-bold text-md'>1,247</span>
                    </div>
                    <div className='flex w-full justify-between my-3'>
                        <span>Videos Generated</span>
                        <span className='font-bold text-md'>89</span>
                    </div>
                    <div className='flex w-full justify-between'>
                        <span>Success Rate</span>
                        <span className='text-green-600 font-bold text-md'>89.5%</span>
                    </div>
                </CardContent>
            </Card>
            <Card className='bg-gradient-to-br from-[#030918] to-gray-600/20 h-45 gap-2'>
                <CardHeader className='flex gap-2 items-center'>
                    <Wand2 className='w-5 h-5 text-[#675ad4]' />
                    <h3 className='text-lg font-semibold'>Quick Tips</h3>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground gap-3">
                        <li>• Use high-resolution product photos</li>
                        <li>• Clear backgrounds work best</li>
                        <li>• Try different lighting styles</li>
                    </ul>
                </CardContent>
            </Card>
        </>
    )
}

export default StatCard