import { FormEvent, useState, useEffect, useCallback, useRef } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import aiHandler from "../scripts/aiHandler"

import { FaArrowUp } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";

import PageContext from "../util/PageContext"

export default function Chat() {
  const promptInputRef = useRef<HTMLInputElement>(null)
  const chatBottom = useRef<HTMLDivElement>(null);
  const [bubbles, setBubbles] = useState<React.ReactNode[]>()

  interface BubbleProps {
    content: string
  }

  const SendBar = () => {
    async function onSubmit(e: FormEvent) {
      e.preventDefault();

      // call gemini, generate response
      if (promptInputRef.current) {
        const prompt = promptInputRef.current.value

        // ignore empty prompt
        if (prompt == "") {
          return;
        }

        // prompt the ai
        aiHandler.promptAI(prompt)
      }
    }

    return (
      <div className="flex-grow flex items-end">
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full bg-leather text-brown text-lg font-inter p-4 rounded-t-3xl self-end shadow-xl shadow-black/100">
          <input
            type="text"
            ref={(me) => { promptInputRef.current = me }}
            placeholder={"What's on your mind...?"}
            className="w-full placeholder:text-brown placeholder:opacity-70 focus:outline-none focus:ring-0"
          />
          <div className="flex self-end gap-3 text-cream text-xl text-center">
            <button className="bg-brown p-3 aspect-square w-12 rounded-full">
              <FaCamera className="m-auto" />
            </button>
            <button type="submit" className="bg-brown p-3 aspect-square w-12 rounded-full">
              <FaArrowUp className="m-auto" />
            </button>
          </div>
        </form>
      </div>
    )
  }

  const updateBubbles = useCallback((updateType: string) => {
    const UserBubble = ({ content }: BubbleProps) => {
      return (
        <div className="bg-dark-cream text-lead rounded-2xl p-3 font-inter font-normal text-lg self-end max-w-1/2">
          {content}
        </div>
      )
    }

    const ModelBubble = ({ content }: BubbleProps) => {
      return (
        <div className="prose prose-invert prose-headings:h1 bg-lead rounded-2xl p-3 font-inter text-lg self-start max-w-1/2">
          <Markdown remarkPlugins={[remarkGfm]}>
            {content}
          </Markdown>
        </div>
      )
    }


    setBubbles(() => {
      const prevBubbles = aiHandler.conversationHistory.map((entry, index) => {
        if (entry.role == "user") {
          return (
            <UserBubble
              key={index}
              content={entry.parts.text}
            />
          )
        } else {
          return (
            <ModelBubble
              key={index}
              content={entry.parts.text}
            />
          )
        }
      })

      if (updateType === "convo") {
        return prevBubbles;
      } else if (updateType === "buffer") {
        prevBubbles.push(
          <ModelBubble content={aiHandler.buffer.join("")} />
        )

        return prevBubbles;
      }
    })
  }, [])

  useEffect(() => {
    // on update, regenerate convo bubbles
    aiHandler.on("convo", () => { updateBubbles("convo") })
    aiHandler.on("buffer", () => { updateBubbles("buffer") })
  })

  // autoscroll chat bottom into view when messages exceed space 
  useEffect(() => {
    chatBottom.current?.scrollIntoView({ behavior: "smooth" })
  })

  return (
    <PageContext homeButton>
      <div className="flex-grow flex flex-col justify-start p-6 gap-4 overflow-y-scroll">
        {bubbles}
        <div ref={(me) => { chatBottom.current = me }} />
      </div>
      <SendBar />
    </PageContext>
  )
}
