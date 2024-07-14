import Spinner from '@/components/ui/spinner'
import React from 'react'

const loading = () => {
  return (
    <main className="w-full lg:ps-64">
    <div className="p-2 py-4 sm:p-4 md:p-6 space-y-4 sm:space-y-6 flex flex-col justify-center items-center h-screen -mt-16">
      <Spinner />
    </div>
  </main>
  )
}

export default loading