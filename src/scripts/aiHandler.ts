import { GoogleGenerativeAI } from "@google/generative-ai"
import { EventEmitter } from "eventemitter3"

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" })

class AIHandler extends EventEmitter {
  // keep context; have to handle yourself
  conversationHistory: any[] = []
  buffer: string[] = []

  async promptAI(prompt: string) {
    // add prompt to conversation
    this.conversationHistory.push({ role: "user", parts: { text: prompt } })

    this.emit("convo")

    // assemble push response to add to convo again
    let fullResponse = ""

    await model.generateContentStream({ contents: this.conversationHistory })
      .then(async (result) => {
        for await (const chunk of result.stream) {
          const text = chunk.text()
          if (text) {
            // append text to buffer
            this.buffer.push(text)

            // update in buffer mode, adding temp bubble with stream
            this.emit("buffer")

            // append to full response...
            fullResponse += text;
          }
        }

        // push full response to convo
        this.conversationHistory.push({ role: "model", parts: { text: fullResponse } })

        // tell react to update conversation
        this.emit("convo")

        // clean up buffer
        this.buffer.splice(0, this.buffer.length)
      })
      .catch((error) => {
        console.error("Error: ", error)
      })
  }
}

const aiHandler = new AIHandler()

export default aiHandler;
