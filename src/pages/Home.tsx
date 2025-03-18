import PageContext from "../util/PageContext"

import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom"

export default function Home() {
  interface EntryProps {
    date: Date
    imgSrc?: string
  }

  const Entry = ({ date, imgSrc }: EntryProps) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="grid grid-cols-2 ml-6 mr-6">
        <div className="relative aspect-square rounded-4xl overflow-hidden shadow-2xl">
          <img
            src={imgSrc}
          />
          <p className="absolute bg-lead bottom-0 text-center text-white font-serif w-full p-2">{formattedDate}</p>
        </div>
      </div>
    )
  }

  return (
    <PageContext>
      <h1 className="font-serif text-3xl text-lead m-6">Your Entries</h1>
      <Entry date={new Date("August 28 2003")} imgSrc="miranda-isa.png" />
      <Link to="/chat" className="fixed bottom-10 right-10 bg-blue rounded-full aspect-square p-2 text-5xl text-white">
        <GoPlus />
      </Link>
    </PageContext>
  )
}
