import { UseChatHelpers } from 'ai/react'
import { QuestionList } from './questions-list'
import { QuestionsOverlay, QuestionsOverlayProps } from './question-overlay';

//   <QuestionList setInput={setInput} />

export function EmptyScreen({setInput}: QuestionsOverlayProps) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8 text-left">
        <h1 className="mb-2 text-lg font-semibold text-white">
          Welcome to the mev.fyi Chatbot!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          mev.fyi is the Maximal Extractable Value (MEV) research chatbot.
        </p>
        <p className="mb-4 leading-normal text-muted-foreground">
          mev.fyi onboards you to the latest MEV-related research, 
          across mechanism design, auctions, information privacy, from research papers and YouTube videos.
        </p>
      </div>
      <QuestionsOverlay setInput={setInput} />
    </div>
  );
}