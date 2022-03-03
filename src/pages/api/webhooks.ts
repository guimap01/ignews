import { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from 'services/stripe';
import Stripe from 'stripe';
import { convertReadableStream } from 'utils/convertReadableStream';
import { saveSubscription } from './_lib/manageSubscription';

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  const buf = await convertReadableStream(req);
  const secret = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      secret as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            const subscription = event.data.object as Stripe.Subscription;

            await saveSubscription(
              subscription.id,
              subscription.customer.toString()
            );

            break;
          case 'checkout.session.completed':
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription!.toString(),
              checkoutSession.customer!.toString(),
              true
            );
            break;

          default:
            throw new Error('Unhandled event.');
        }
      } catch (error) {
        return res.json({ error: 'Webhook handler failed' });
      }
    }
    return res.json({ received: true });
  } catch (error: any) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
};
