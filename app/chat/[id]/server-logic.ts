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
  
  
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params || {};

    if (typeof id !== 'string') {
      return { notFound: true }; // or redirect to an error page or handle as needed
    }
  
    const cookies = parseServerSideCookies(context.req);
    let sessionId = cookies.get('session_id') || nanoid();

    if (cookies.get('session_id')) {
        context.res.setHeader('Set-Cookie', `session_id=${sessionId}; Path=/; Max-Age=2592000; Secure; SameSite=Lax`);
    }

    const chatData = await getChat(id, sessionId);

    return { props: { chatData } };
};
