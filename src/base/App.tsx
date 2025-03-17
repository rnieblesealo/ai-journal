import { FormEvent, useState, useEffect, useCallback, useRef } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import aiHandler from "../scripts/aiHandler"

function App() {
  const promptInputRef = useRef<HTMLInputElement>(null)
  const [bubbles, setBubbles] = useState<React.ReactNode[]>()

  type BubbleProps = {
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
          className="flex w-full text-white bg-lead font-inter p-4 rounded-lg self-end">
          <input
            type="text"
            ref={(me) => { promptInputRef.current = me }}
            placeholder="Tell me anything..."
            className="w-full focus:outline-none focus:ring-0"
          />
          <button type="submit" className="bg-aqua p-3 h-full rounded-2xl">Send!</button>
        </form>
      </div>
    )
  }

  const updateBubbles = useCallback((updateType: string) => {
    const UserBubble = ({ content }: BubbleProps) => {
      return (
        <div className="bg-aqua text-white rounded-2xl p-3 font-inter font-normal text-sm self-end max-w-1/2">
          {content}
        </div>
      )
    }

    const ModelBubble = ({ content }: BubbleProps) => {
      return (
        <div className="prose prose-invert prose-headings:h1 bg-charcoal rounded-2xl p-3 font-inter text-sm self-start max-w-1/2">
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

  return (
    <div className="w-screen h-screen flex flex-col bg-peach">
      <h1 className="text-center p-4 text-charcoal font-serif font-bold text-5xl shadow-xl shadow-peach/50 z-10">lalal.ai</h1>
      <div className="flex-grow flex flex-col justify-start p-6 gap-4 overflow-y-scroll">
        {bubbles}
      </div>
      <SendBar />
    </div>
  )
}

export default App
