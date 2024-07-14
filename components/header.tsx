import React from 'react'
import { ModeToggle } from './darkmode-toggle'

const Header = () => {
  return (
    <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white text-sm py-2.5 sm:py-4 lg:ps-64 dark:bg-bgSecondaryDark dark:border-neutral-700">
    <nav className="flex basis-full items-center w-full mx-auto px-4 sm:px-6" aria-label="Global">
      <div className="me-5 lg:me-0 lg:hidden w-full">
        {/* <!-- Logo --> */}
        <a className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80" href="../templates/admin/index.html" aria-label="Nathan">
          Oracle Aggregator
        </a>
        {/* <!-- End Logo --> */}
      </div>
  
      <div className="flex items-center justify-end ms-auto sm:gap-x-3 sm:order-3">
        <div className="flex flex-row items-center justify-end gap-2">
          <ModeToggle />
          {/* <!-- Sidebar --> */}
          <button type="button" className="py-2 px-3 flex justify-center items-center gap-x-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:text-gray-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 lg:hidden" data-hs-overlay="#application-sidebar" aria-controls="application-sidebar" aria-label="Sidebar">
            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13"/></svg>
            <span className="sr-only">Sidebar</span>
          </button>
          {/* <!-- End Sidebar --> */}
        </div>
      </div>
    </nav>
  </header>
  )
}

export default Header