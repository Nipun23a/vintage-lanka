const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const stripe = require('stripe')('sk_test_51RJoQe2c3BXHFyvA042j3reTMRrZ5Iz1sL5pokgv4xB78PYAEQNG6ssw9pZMf2KmegUXcZ6jf6woVgkYlyNkObDm00qMHsDGMV');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/products',productRoutes);
app.use('/api/category',categoryRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.post('/create-payment-intent', async (req, res) => {
    try {
      const { amount } = req.body;
      
      // Validate amount
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }
      
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        // Optional: Add metadata about the order
        metadata: {
          integration_check: 'accept_a_payment',
        },
      });
  
      // Send the client secret to the client
      res.json({
        clientSecret: paymentIntent.client_secret
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: error.message });
    }
  });

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
  
    try {
      // Verify the webhook signature
      const endpointSecret = 'whsec_Jn7hyKCkKiJIO4FH2QzI7qjHH3kcITeW'; // Replace with your webhook secret
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        // Update your database here
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id, failedPayment.last_payment_error?.message);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    res.json({received: true});
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));