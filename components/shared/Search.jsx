"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'

const Search = ({ placeholder = "Search title..." }) => {
  const [query, setQuery] = useState('')
  const searchParams = useParams()
  const router = useRouter()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = ''
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: query
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['query']
        })
      }

      router.push(newUrl, { scroll: false })

    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query, searchParams, router])

  useEffect(() => {
    // Function to handle keydown event
    const handleKeyDown = (event) => {
      // Check if the Esc key is pressed
      if (event.key === 'Escape') {
        setQuery('') // Clear the search query
      }
    }

    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className='flex-center min-h-[54px] w-full overflow-hidden px-4 py-2'>
      <Image src="/assets/icons/search.svg" alt="search bar" width={24} height={24} />
      <Input
        type="text"
        placeholder={placeholder}
        className="rounded-full bg-gray-50 outline-offset-0 placeholder:text-gray-500 focus:border-0 focus-visible:ring-offset-0"
        onChange={(e) => setQuery(e.target.value)}
        value={query} // Ensure the input reflects the state
      />
    </div>
  )
}

export default Search
