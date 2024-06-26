import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import TicketRequests from "../Requests/TicketRequests";
import CartRequests from "../Requests/CartRequests";
import "../styles/buyConfirmationPage.css"
const ConfirmationPage = () => {
    const { cartId } = useParams();
    const [cartTickets, setCartTickets] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const response = await CartRequests.getCartTicketsAndEvents(cartId);
            setCartTickets(response.data.cartTickets);
        }
        catch(e){}

    }

    return (
        <div style={{display: 'flex',alignItems: 'center', height: '100vh',justifyContent: 'center'}}>
        <div className="confirmation-page">
            <h2>Tickets info</h2>
            {cartTickets.length > 0 ? (
                <>
                    <ul>
                        {cartTickets.map(ticket => (
                            <li key={ticket.id}>
                                <h3>Ticket</h3>
                                <p>Type: {ticket.type}</p>
                                <p>Price: {ticket.price}</p>
                                <h3>Event</h3>
                                <p>Title: {ticket.Event.title}</p>
                                <p>Description: {ticket.Event.description}</p>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => window.location.href = `/payments/buy-ticket/${cartId}`} className="confirm-button">Confirm order</button> {/* Apply class name here */}
                </>

            ) : (
                <p>Cart is empty</p>
            )}
        </div>
        </div>
    );

};

export default ConfirmationPage;