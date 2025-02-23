import Image from 'next/image'
import React from 'react'

const Panel = ({chatType}: {chatType: string}) => {
    console.log(chatType);    
  return (
    <div className="h-full flex flex-col items-center justify-center">
        <div className="relative h-72 w-72">
        <Image
            alt="Empty" 
            fill 
            // src={imageUrl} 
        />
        </div>
        <p className="text-muted-foreground text-sm text-center">{"message"}</p>
    </div>
  )
}

export default Panel