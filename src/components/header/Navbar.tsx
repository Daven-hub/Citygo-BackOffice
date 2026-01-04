import { Menu } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import UserMenu from '../UserMenu'
import { useAuth } from '@/context/use-auth'

function Navbar () {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { isLoading } = useAuth()

  return (
    <nav className='w-full sticky top-0 bg-white z-[2] flex items-center justify-between px-4 py-3.5 max-md:px-[4%] max-md:py-2.5 border-b'>
      <div className='flex relative items-center gap-3'>
        <div className='flex items-center gap-20'>
          <div className='cursor-pointer flex-shrink-0 btn-menu'>
            <Menu size={30} />
          </div>
        </div>
      </div>
      <div className='flex gap-4 items-center'>
        <div className='pl-4 border-l border-gray-200'>
          {isLoading ? (
            <div className='flex items-center gap-2 animate-pulse'>
              <div className='flex flex-col gap-1'>
                <div className='w-24 h-3 bg-gray-300/60 rounded'></div>
                <div className='w-16 h-3 bg-gray-300/50 rounded'></div>
              </div>
              <div className='w-10 h-10 rounded-full bg-gray-300/70' />
            </div>
          ) : (
            <UserMenu isAdmin={false} />
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
