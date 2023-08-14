import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect} from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/router";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

const API_URL = 'localhost:5000/api';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey);

export default function Home() {

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      // let data = {customerID:""};
      // data.email = email;
      // data.customerID = sessionId;
      // console.log(data.customerID);
      // const res = axios.post(API_URL+'customers', data);
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  const router = useRouter();
  const { status } = router.query;

  const [loading, setLoading] = useState(false);

  const [item, setItem] = useState({
    name: "Apple AirPods",
    description: "Latest Apple AirPods.",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80",
    quantity: 0,
    price: 999,
  });

  const changeQuantity = (value) => {
    // Don't allow the quantity less than 0, if the quantity is greater than value entered by user then the user entered quantity is used, else 0
    setItem({ ...item, quantity: Math.max(0, value) });
  };

  const onInputChange = (e) => {
    changeQuantity(parseInt(e.target.value));
  };

  const onQuantityPlus = () => {
    changeQuantity(item.quantity + 1);
  };

  const onQuantityMinus = () => {
    changeQuantity(item.quantity - 1);
  };


  const createCheckOutSession = async () => {
    setLoading(true);
    const stripe = await stripePromise;
    
    const checkoutSession = await axios.post("/api/create-stripe-session", {'item': item}, {headers:{"Content-Type":"application/json"}});
    //  const checkoutSession = await axios.fetch("/api/create-stripe-session", {'item': item}, {headers:{"Content-Type":"application/json"}});
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
      
    });
    if (result.error) {
      alert(result.error.message);
    }
    setLoading(false);
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Stripe Checkout with Next.js</title>
        <meta
          name="description"
          content="Complete Step By Step Tutorial for integrating Stripe Checkout with Next.js"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {status && status === "success" && (
          <div className="bg-green-100 text-green-700 p-2 rounded border mb-2 border-green-700">
            Payment Successful
          </div>
        )}
        {status && status === "cancel" && (
          <div className="bg-red-100 text-red-700 p-2 rounded border mb-2 border-red-700">
            Payment Unsuccessful
          </div>
        )}





    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/pencil.png"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            JETSTREAM PREMIER
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ float: 'right' }}>
            $999
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{ float: 'right' }}>
        <Button size="small" color="primary" onClick={createCheckOutSession} >
        {loading ? "Processing..." : "Buy"}
        </Button>
      </CardActions>
    </Card>


        {/* <div className="shadow-lg border rounded p-2 ">
          <Image src={item.image} width={300} height={150} alt={item.name} />
          <h2 className="text-2xl">$ {item.price}</h2>
          <h3 className="text-xl">{item.name}</h3>
          <p className="text-gray-500">{item.description}</p>
          <p className="text-sm text-gray-600 mt-1">Quantity:</p>
          <div className="border rounded">
            <button
              onClick={onQuantityMinus}
              className="bg-blue-500 py-2 px-4 text-white rounded hover:bg-blue-600"
            >
              -
            </button>
            <input
              type="number"
              className="p-2"
              onChange={onInputChange}
              value={item.quantity}
            />
            <button
              onClick={onQuantityPlus}
              className="bg-blue-500 py-2 px-4 text-white rounded hover:bg-blue-600"
            >
              +
            </button>
          </div>
          <p>Total: ${item.quantity * item.price}</p>
          
          <button
            disabled={item.quantity === 0 || loading}
            onClick={createCheckOutSession}
            className="bg-blue-500 hover:bg-blue-600 text-white block w-full py-2 rounded mt-2 disabled:cursor-not-allowed disabled:bg-blue-100"
          >
            {loading ? "Processing..." : "Buy"}
          </button>
        </div> */}
        <a
          className="block text-blue-500 mt-4"
          href="https://cb-ashik.hashnode.dev/stripe-checkout-with-nextjs"
        >
          Read Blog
        </a>
        <div className="bg-yellow-100 text-yellow-700 p-2 mt-2 rounded border mb-2 border-yellow-700">
          Use test card for testing.
          <p>Card Number: 4242 4242 4242 4242</p>
        </div>
      </main>
    </div>
  );
}
