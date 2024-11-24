// const express = require('express');
// const bodyParser = require("body-parser");
// const cors = require("cors");

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Stripe from 'stripe';
import exphbs from 'express-handlebars'; 

const stripe = Stripe('sk_test_51QNAcdADybCsiviUKEGor6qSHevqb5Np7mHjDwrhYrjTcPMWoyu8Bfis196HBj0KD9dNzvxSJpC1nEsEtF6Bc7oL00nmHIXZRx');

const PORT = process.env.PORT || 8080;

const app = express();

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
      publishableKey: 'pk_test_51QNAcdADybCsiviUzmvqbpcFJL94q5Kt5z22fPxT20caX6TiTWGYbQ8TxEqJ6qoFVuIlhfid7ubuX2tcofcPBYFb00sRhlQP7t'
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
})

//exports.app = functions.https.onRequest(app);