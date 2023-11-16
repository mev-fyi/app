import { getSession, GetSessionParams } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';

export const auth = async (context: GetServerSidePropsContext) => {
  const session = await getSession({ req: context.req } as GetSessionParams);

  // You can add any additional checks or manipulations here
  // For example, if you want to enforce certain conditions based on the session

  return session;
};
