import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextApiRequest, NextApiResponse } from 'next';


/**
 * The authentication options object containing the providers and session strategy configuration.
 * 
 * @type {NextAuthOptions}
 */
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || 'missing google client id',
      clientSecret: process.env.GOOGLE_SECRET || 'missing google client secret',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};

/**
 * The main NextAuth handler function that manages auth requests and responses.
 * This is the default export for this module.
 *
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 * @returns {Promise<void>} - The NextAuth response handling promise.
 */
const nextAuthHandler = (req: NextApiRequest, res: NextApiResponse): Promise<void> => NextAuth(req, res, authOptions);

export default nextAuthHandler;
