import Stripe from 'stripe';
import packageJson from '../../package.json';

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Ignews',
    version: packageJson.version,
  },
});
