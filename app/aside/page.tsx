import Header from '@/components/header'
import Sidebar from '@/components/side-bar'
import React from 'react'

const sleep = async (ms:number) => {
  return new Promise((res) => setTimeout(res,ms))
}

const Page = async () => {
  await sleep(5000)
  return (

<main className="w-full lg:ps-64">
  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
    Hello World
  </div>
</main>

  )
}

export default Page