import React, {useEffect, useState} from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import '../styles/paymentPage.css';
import UserRequests from "../Requests/UserRequests"; // Import the CSS file
import TicketRequests from "../Requests/TicketRequests";
import {useParams} from "react-router-dom"; // Import the CSS file

function PaymentPage() {
    const {cartId} = useParams();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
        fetchClientSecret();
    }, []);
    const fetchUser = async () => {
        const response = await UserRequests.getUser()
        if (response.status === 200) {
            setUser(response.data)
        }
    };
    const fetchClientSecret = async () => {
       try{
           const response = await fetch('https://localhost:3001/api/payments/create-payment-intent', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({ amount: 100}),
           });
           const data = await response.json();
           setClientSecret(data.clientSecret);
       }
       catch (e) {}
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       try{
           setLoading(true);
           const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
               payment_method: {
                   card: elements.getElement(CardElement),
                   billing_details: {
                       name: user.firstName
                   },
               },
           });
           setLoading(false);
           if (paymentIntent.status === 'succeeded') {
               if(!user) return
               const ticketResponse = await TicketRequests.createAndSendTicket(cartId, user)
               const saveResponse = await TicketRequests.saveBoughtTicket(cartId, {visible: true});
               localStorage.setItem('ticketBought','true')
               window.location.href = '/'

           } else if (error) {
               console.log('biba')
           }
       }
       catch (e) {}
    };
    return (
        <div className="payment-container">
            <form className="payment-form" onSubmit={handleSubmit}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '18px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                <button className="payment-button" type="submit" disabled={!stripe || loading}>
                    Pay
                </button>
            </form>
        </div>
    );
}

export default PaymentPage;
