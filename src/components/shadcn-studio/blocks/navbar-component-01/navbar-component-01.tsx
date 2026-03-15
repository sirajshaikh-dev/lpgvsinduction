import { MenuIcon, SearchIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import Logo from '@/components/shadcn-studio/logo'

type NavigationItem = {
  title: string
  href: string
}[]

const Navbar = ({ navigationData }: { navigationData: NavigationItem }) => {
  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-background'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6'>
        <div className='text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16'>
          <a href='#' className='hover:text-primary max-md:hidden'>
            Home
          </a>
          <a href='#' className='hover:text-primary max-md:hidden'>
            Products
          </a>
          <a href='#'>
            <Logo className='text-foreground gap-3' />
          </a>
          <a href='#' className='hover:text-primary max-md:hidden'>
            About Us
          </a>
          <Popover>
            <PopoverTrigger asChild>
              <a className='hover:text-primary max-md:hidden cursor-pointer'>
                Contacts
              </a>
            </PopoverTrigger>
            <PopoverContent>
              <div className='space-y-2'>
                <p><strong>Contact:</strong> +91 9898194074</p>
                <p><strong>Address:</strong> Shop no.03, Sai shakti apartment, sai mohan gate2, Bhestan.</p>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className='flex items-center gap-6'>
          <Button variant='ghost' size='icon'>
            <SearchIcon />
            <span className='sr-only'>Search</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className='md:hidden' asChild>
              <Button variant='outline' size='icon'>
                <MenuIcon />
                <span className='sr-only'>Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end'>
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    {item.title === 'Contacts' ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <span className='cursor-pointer'>{item.title}</span>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className='space-y-2'>
                            <p><strong>Contact:</strong> +91 9898194074</p>
                            <p><strong>Address:</strong> Shop no.03, Sai shakti apartment, sai mohan gate2, Bhestan.</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <a href={item.href}>{item.title}</a>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Navbar
