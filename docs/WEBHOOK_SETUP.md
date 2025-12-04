# Stripe Webhook Setup for Local Development

## Problem
Stripe webhooks cannot reach `localhost` directly. The webhook needs to be forwarded from Stripe's servers to your local backend.

## Solution: Stripe CLI Webhook Forwarding

### 1. Install Stripe CLI

**Windows:**
- Download from: https://github.com/stripe/stripe-cli/releases/latest
- Or use Scoop: `scoop install stripe`

**Mac/Linux:**
- Use Homebrew: `brew install stripe/stripe-cli/stripe`

### 2. Login to Stripe CLI

```bash
stripe login
```

This opens your browser to authorize the CLI with your Stripe account.

### 3. Forward Webhooks to Local Backend

Open a **new terminal window** and run:

```bash
stripe listen --forward-to localhost:8001/api/webhooks/stripe
```

This command:
- Listens for all webhook events from your Stripe account
- Forwards them to your local backend at `http://localhost:8001/api/webhooks/stripe`
- Prints each event as it arrives

**IMPORTANT:** Keep this terminal window open while testing. If you close it, webhooks will stop working.

### 4. Update Backend with Webhook Signing Secret

The `stripe listen` command will output a webhook signing secret that looks like:

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxx
```

**Copy this secret** and update your `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

Then **restart your backend** for the change to take effect.

### 5. Test the Webhook

Now make a test purchase:
1. Go to paywall page
2. Select a plan
3. Use test card: `4242 4242 4242 4242`, any future date, any CVC
4. Complete payment

You should see webhook events appear in the Stripe CLI terminal:
```
2025-12-03 15:30:21   --> checkout.session.completed [evt_xxxxx]
2025-12-03 15:30:22   --> customer.subscription.created [evt_xxxxx]
```

And your backend logs should show the webhook was processed successfully.

### 6. Verify Subscription Updated

After payment:
- Check sidebar - should show your purchased tier (not "Free Tier")
- Try creating a new conversation - should work without hitting paywall
- Go to Settings - should show "Update Payment Method" button working

## Troubleshooting

### "Webhook signature verification failed"
- Make sure you updated `STRIPE_WEBHOOK_SECRET` in `.env`
- Restart the backend after updating `.env`
- The secret from `stripe listen` is different from your Stripe Dashboard webhook secret

### "Webhooks not arriving"
- Check that `stripe listen` is still running
- Verify the forward URL is correct: `localhost:8001/api/webhooks/stripe`
- Check backend is running on port 8001

### "Backend not receiving webhooks"
- Check backend logs for errors
- Verify the endpoint path: `/api/webhooks/stripe`
- Test webhook manually: `stripe trigger checkout.session.completed`

## For Production Deployment

When deploying to production, you'll need to:
1. Set up a real webhook endpoint in Stripe Dashboard
2. Use your production webhook signing secret (not the CLI one)
3. Update `STRIPE_WEBHOOK_SECRET` in your production environment variables

The Stripe CLI is **only for local development**. Production webhooks go directly from Stripe servers to your deployed backend.
