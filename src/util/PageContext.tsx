import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom"

export default function PageContext({ children, homeButton }: { children?: React.ReactNode, homeButton?: boolean }) {
  return (
    <div className="w-screen h-screen flex flex-col bg-page">
      <div className="relative text-center text-white font-serif font-bold text-5xl bg-blue z-10 p-4 shadow-lg shadow-blue/20">
        journal.ai
        <div>
          {homeButton &&
            <Link to="/home">
              <FaHome className="text-3xl text-darkblue absolute top-auto inset-6 ml-auto" />
            </Link>
          }
        </div>
      </div>
      {children}
    </div>
  )
}
