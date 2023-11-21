import { type Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface ParsedMetadataEntry {
  index: number;
  title: string;
  link: string;
  extraInfo: string;
  extraInfoType: string;
  publishedDate: Date;
  publishedDateString: string;
}

// Extend the Message type to include structured_metadata
export interface ExtendedMessage extends Message {
  structured_metadata?: ParsedMetadataEntry[]; // Use the correct metadata type here
}
