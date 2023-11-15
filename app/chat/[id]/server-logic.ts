import { parseCookies, parseServerSideCookies, nanoid } from '@/lib/utils';
import { getChat } from '@/app/actions';
import { type Metadata } from 'next';
import { type ChatPageProps } from 'lib/types'
import { GetServerSideProps } from 'next';


export const runtime = 'edge';
export const preferredRegion = 'home';

export async function generateMetadata({
    params,
    req,
  }: ChatPageProps): Promise<Metadata> {
    const cookies = parseCookies(req);
    const sessionId = cookies.get('session_id') || nanoid();
  
    const chat = await getChat(params.id, sessionId);
    return {
      title: chat?.title?.toString().slice(0, 50) ?? 'Chat',
    };
  }
  
  
