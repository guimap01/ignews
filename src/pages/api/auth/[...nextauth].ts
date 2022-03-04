import { query as q } from 'faunadb';
import addDays from 'date-fns/addDays';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { fauna } from 'services/fauna';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const expires = addDays(new Date(), 30).toISOString();

      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user!.email as string)
                    )
                  )
                )
              ),
              q.Match(q.Index('subscription_by_status'), 'active'),
            ])
          )
        );
        return {
          ...session,
          token,
          activeSubscription: userActiveSubscription,
          expires,
        };
      } catch {
        return {
          ...session,
          token,
          activeSubscription: null,
          expires,
        };
      }
    },
    async signIn({ user: { email } }) {
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index('user_by_email'), q.Casefold(email as string))
              )
            ),
            q.Create(q.Collection('users'), { data: { email } }),
            q.Get(
              q.Match(q.Index('user_by_email'), q.Casefold(email as string))
            )
          )
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});
