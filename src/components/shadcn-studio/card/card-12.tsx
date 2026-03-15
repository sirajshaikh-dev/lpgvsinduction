'use client'

import { useState } from 'react'

import { HeartIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardDescription, CardTitle, CardFooter, CardContent } from '@/components/ui/card'
import { ImageSlider } from '@/components/ui/image-slider'
import { PRODUCTS } from '../../../lib/product'
import { cn } from '@/lib/utils'

const CardProductDemo = () => {
  const [liked, setLiked] = useState<boolean>(false)

  return (
    <div className='relative mx-auto w-full max-w-xl rounded-xl bg-gradient-to-r from-neutral-600 to-violet-300 pt-0 shadow-lg'>
      <div className='flex h-60 w-full items-center justify-center'>
        <div className='w-full max-w-md'>
          <ImageSlider images={PRODUCTS[0].images} />
        </div>
      </div>
      <Button
        size='icon'
        onClick={() => setLiked(!liked)}
        className='bg-primary/10 hover:bg-primary/20 absolute top-4 right-4 rounded-full'
      >
        <HeartIcon className={cn(liked ? 'fill-destructive stroke-destructive' : 'stroke-white')} />
        <span className='sr-only'>Like</span>
      </Button>
      <Card className='border-none'>
        <CardHeader className='p-0 space-y-0'>
          <CardTitle>Nike Jordan Air Rev</CardTitle>
          <CardDescription className='flex items-center gap-2'>
            <Badge variant='outline' className='rounded-sm'>
              EU38
            </Badge>
            <Badge variant='outline' className='rounded-sm'>
              Black and White
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <p>
            Crossing hardwood comfort with off-court flair. &apos;80s-Inspired construction, bold details and
            nothin&apos;-but-net style.
          </p>
        </CardContent>
        <CardFooter className='p-0 pt-0 justify-between gap-3 max-sm:flex-col max-sm:items-stretch'>
          <div className='flex flex-col'>
            <span className='text-sm font-medium uppercase'>Price</span>
            <span className='text-xl font-semibold'>$69.99</span>
          </div>
          <Button size='lg'>Add to cart</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CardProductDemo