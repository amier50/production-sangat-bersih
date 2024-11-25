// const express = require('express');
// const bodyParser = require("body-parser");
// const cors = require("cors");

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Stripe from 'stripe';
import exphbs from 'express-handlebars'; 

// const stripe = Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

const PORT = process.env.PORT || 8080;

const app = express();

const stripe = Stripe('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');

app.use(cors());

app.use(bodyParser.json());

app.post('/payment-sheet', async (req, res) => {
    
    const amount = req.body.amount;
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customer.id},
      {apiVersion: '2024-10-28.acacia'}
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'myr',
      customer: customer.id,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter
      // is optional because Stripe enables its functionality by default.
    //   automatic_payment_methods: {
    //     enabled: true,
    //   },
      payment_method_types: [
        'card',
        'fpx',
        'grabpay'
      ]
    });
  
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: 'pk_live_51QNAcdADybCsiviU1MyGisZXdaHihAMIRt3njBhdPt3Q1U0k4wUdqO97EdPPrZkKp7H96SIhDc8f0jQvL6PWa6Gu00redthzen'
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
})

//exports.app = functions.https.onRequest(app);