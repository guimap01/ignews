// ~/utils/prismicHelpers.js
import Prismic from '@prismicio/client';
import { NextApiRequest } from 'next';
import Link from 'next/link';
import {
  apiEndpoint,
  accessToken,
  linkResolver,
} from 'config/prismicConfiguration';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

// Helper function to convert Prismic Rich Text links to Next/Link components
export const customLink = (
  element: { data: any },
  content: any,
  index: any
) => (
  <Link key={index} href={linkResolver(element.data)}>
    <a>{content}</a>
  </Link>
);

// -- @prismicio/client initialisation
// Initialises the Prismic Client that's used for querying the API and passes it any query options.
export const Client = (
  req:
    | (IncomingMessage & {
        cookies: NextApiRequestCookies;
      })
    | NextApiRequest
    | null = null
) => Prismic.client(apiEndpoint, createClientOptions(req, accessToken));

// Options to be passed to the Client
const createClientOptions = (
  req:
    | (IncomingMessage & {
        cookies: NextApiRequestCookies;
      })
    | NextApiRequest
    | null = null,
  prismicAccessToken: string | null = null
) => {
  const reqOption = req ? { req } : {};
  const accessTokenOption = prismicAccessToken
    ? { accessToken: prismicAccessToken }
    : {};
  return {
    ...reqOption,
    ...accessTokenOption,
  };
};

export default Client;
