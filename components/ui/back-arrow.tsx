"use client"
import { ArrowLeft } from 'lucide-react'
import React from 'react'

const BackArrow = () => {
  return (
    <ArrowLeft className='hover:cursor-pointer' onClick={() => window.history.back()}/>
  )
}

export default BackArrow