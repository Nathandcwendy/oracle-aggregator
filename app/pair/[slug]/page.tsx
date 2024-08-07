import BackArrow from "@/components/ui/back-arrow";
import Card from "@/components/ui/card";
import CardExpanded from "@/components/ui/card-expanded";
import { getSinglePairData } from "@/lib/prepareData"
import { ArrowLeft, CircleAlert } from "lucide-react";
import Link from "next/link";


export default async function Page({ params }: { params: { slug: string } }) {
  const pairSlug = params.slug;
  const getPairString = (slug: string) => {
    const splitSlug = pairSlug.split("_");
    if (splitSlug.length > 1) {
      return splitSlug.join("/")
    } else {
      return slug
    }
  } 
  const data = await getSinglePairData(getPairString(pairSlug))
  if (typeof data != "string") {
    return (
      <main className="w-full lg:ps-64">
  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <BackArrow />
  <div>
      <CardExpanded data={data} />
    </div>
  </div>
</main>
    )
  } else {
    return (<main className="w-full lg:ps-64">
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
    <div className="-mt-16 h-screen flex flex-col w-full items-center justify-center gap-7">
      <span className="py-2 px-4 inline-flex items-center gap-x-1 text-2xl lg:text-3xl font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
      <CircleAlert className="w-6 h-6 mr-2" color="#c21e1e" />
        {data}
      </span>
      <Link className="py-2 px-4 inline-flex items-center gap-x-1 text-2xl lg:text-3xl font-medium bg-green-100 text-green-800 rounded-full dark:bg-green-500/10 dark:text-green-500" href="/">
      <ArrowLeft />
        
        Go 
      Back</Link>
    </div>
    </div>
  </main>)
  }
}