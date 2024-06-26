import './App.css';
import React, {useEffect, useState} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Profile from "./Components/Profile";
import NavigationBar from "./Components/NavigationBar";
import EventPage from "./Components/EventPage";
import CompanyPage from "./Components/CompanyPage";
import EventCreator from "./Components/EventCreator";
import CompanyCreator from "./Components/CompanyCreator";
import TicketsCreator from "./Components/TicketsCreator";
import PaymentPage from "./Components/PaymentPage";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ErrorPage from "./Components/ErrorPage";
import UserRequests from "./Requests/UserRequests";
import ConfirmationPage from "./Components/ConfirmationPage";
import RestorePasswordPage from "./Components/RestorePasswordPage";
import CreateNewPasswordPage from "./Components/CreateNewPasswordPage";
const REACT_APP_STRIPE_PUBLISHABLE_KEY = 'pk_test_51P4RqnFFsE5TFYGdVQAhzsfkwJwJPXwwffko0rNpwy10rMtLZb1XFy4xyppz3Y8J11SWYpyZD5MWzVs1klQLHXYm00RLOLXVON'
const stripePromise = loadStripe(REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
    const [cart, setCart] = useState(null);
    const [tickets, setTickets] = useState(null);

    return (
        <>
            <BrowserRouter>
                <NavigationBar cart={cart} cartTickets={tickets} setCart={setCart} setTickets={setTickets}/>
                <Elements stripe={stripePromise}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/error" element={<ErrorPage />} />
                        <Route path="/events/:eventId" element={<EventPage cart={cart} cartTickets={tickets} setCart={setCart} setTickets={setTickets}/>} />
                        <Route path="/events/:eventId/tickets" element={<TicketsCreator />} />
                        <Route path="/companies/:companyId/event-creator" element={<EventCreator />} />
                        <Route path="/companies/:companyId" element={<CompanyPage />} />
                        <Route path="/users/:userId/company-creator" element={<CompanyCreator />} />
                        <Route path="/payments/confirmation/:cartId" cart={cart} cartTickets={tickets} setCart={setCart} setTickets={setTickets} element={<ConfirmationPage />} />
                        <Route path="/payments/buy-ticket/:cartId" element={<PaymentPage />} />
                        <Route path="/restore-password" element={<RestorePasswordPage />} />
                        <Route path="/restore-password/new-password" element={<CreateNewPasswordPage />} />
                    </Routes>
                </Elements>
            </BrowserRouter>
        </>
    )
}

export default App;
