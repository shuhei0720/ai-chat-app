import React from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const Navbar = () => {
  return (
    <div className='flex items-center p-4'>
      <Button variant="ghost" size="icon" className='lg:hidden hover:bg-transparent'>
        <Menu />
      </Button>
      <div className='w-full flex justify-end'>UserIcon</div>
    </div>
  )
}

export default Navbar