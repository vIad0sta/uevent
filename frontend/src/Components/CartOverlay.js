import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import '../styles/cartOverlay.css';
import UserRequests from "../Requests/UserRequests";
import {SvgIcon, TextField} from "@mui/material";
import CartRequests from "../Requests/CartRequests";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';

const CartOverlay = ({ onClose, children, setCart, setTickets, cart, cartTickets }) => {

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try{
            const response = await UserRequests.getCart();
            setCart(response.data)
            setTickets(response.data.Tickets)
        }
        catch (e) {}
    }
    const onQuantityChange = (ticketId, newQuantity) => {
        const ticketIndex =  cartTickets.findIndex(ticket => ticket.id === ticketId);

        if (ticketIndex !== -1) {
            const updatedTickets = [...cartTickets];
            const ticketToUpdate = updatedTickets[ticketIndex];
            ticketToUpdate.CartTicket.quantity = newQuantity;
            setTickets(updatedTickets);
        }
        try{
            const response = CartRequests.updateCartTicket(cart.id, ticketId, {quantity: newQuantity});
        }
        catch(e){}
    }
    const onClearCart = async () => {
        try{
            const response = await CartRequests.clearCart(cart.id);
            setCart(response.data);
            setTickets([]);
        }
        catch(e){}
    }
    const handleDeleteFromCart = async (ticketId) => {
        try{
            const response = await CartRequests.deleteCartTicket(cart.id, ticketId)
            const cartResp = await UserRequests.getCart();
            setTickets(cartResp.data.Tickets)
        }
        catch(e){}
    };
    return ReactDOM.createPortal(
        <div className="cart-overlay">
            <div className="cart-container">
                <svg className="close-button" onClick={onClose} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 24 24">
                    <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M16.7,15.3c0.4,0.4,0.4,1,0,1.4C16.5,16.9,16.3,17,16,17	s-0.5-0.1-0.7-0.3L12,13.4l-3.3,3.3C8.5,16.9,8.3,17,8,17s-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l3.3-3.3L7.3,8.7	c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l3.3,3.3l3.3-3.3c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4L13.4,12L16.7,15.3z"></path>
                </svg>
                {children}
                {cartTickets.length === 0 &&
                    <h1 style={{textAlign: 'center'}}>
                        <SvgIcon viewBox="0 0 100 125" enable-background="new 0 0 100 100" sx={{fontSize: 200}}>
                            <g>
                                <path d="M63.895,61.776c0,3.209,2.603,5.813,5.813,5.813c3.212,0,5.813-2.603,5.813-5.813c0-5.138-3.558-7.097-5.813-11.116   C67.454,54.68,63.895,56.639,63.895,61.776z"/>
                                <path d="M51.498,7.502C27.7,7.502,8.339,26.863,8.339,50.661C8.339,74.46,27.7,93.82,51.498,93.82s43.159-19.36,43.159-43.159   C94.657,26.863,75.296,7.502,51.498,7.502z M51.498,86.064c-19.521,0-35.403-15.881-35.403-35.403   c0-19.521,15.882-35.403,35.403-35.403c19.522,0,35.404,15.882,35.404,35.403C86.902,70.184,71.021,86.064,51.498,86.064z"/>
                                <circle cx="34.046" cy="43.453" r="6.57"/>
                                <circle cx="68.949" cy="43.453" r="6.57"/>
                                <path d="M63.452,68.761c-7.791-2.244-16.117-2.244-23.908,0c-2.059,0.592-3.246,2.741-2.653,4.8   c0.592,2.058,2.74,3.245,4.799,2.653c6.396-1.842,13.22-1.842,19.618,0c0.357,0.103,0.719,0.151,1.074,0.151   c1.685,0,3.235-1.105,3.724-2.805C66.699,71.502,65.512,69.353,63.452,68.761z"/></g>
                        </SvgIcon>
                    </h1>
                }
                <ul style={{width: '100%'}}>
                    {cart && cartTickets.map(ticket => (
                        <li key={ticket.id} style={{display: 'flex', flexDirection: "row", gap: '20px', alignItems: "center"}}>
                            <span>
                                <p>Type: {ticket.type}</p>
                                <p>Price: {ticket.price}</p>
                            </span>
                            <TextField
                                type="number"
                                value={ticket.CartTicket.quantity}
                                onChange={e => onQuantityChange(ticket.id, parseInt(e.target.value))}
                                label="Quantity"
                                inputProps={{
                                    max: 5 || ticket.quantity,
                                    min: 1
                                }}
                                sx={{width: "50%"}}
                            />
                            <IconButton aria-label="delete" size="large" onClick={() => handleDeleteFromCart(ticket.id)}>
                                <DeleteIcon />
                            </IconButton>
                            {/*<button onClick={() => handleDeleteFromCart(ticket.id)}>Видалити з кошика</button>*/}
                        </li>
                    ))}
                </ul>
                {cartTickets && cartTickets.length !== 0 &&
                    <span style={{display: "flex", flexDirection: 'row', alignItems: "center"}}>
                       <SvgIcon onClick={onClearCart} viewBox="0 0 100 125" enable-background="new 0 0 100 100" sx={{fontSize: 70, cursor: 'pointer',  transition: 'transform 0.3s ease-in-out',
                           ':hover': {
                               transform: 'scale(1.1)',
                           }}}>
                           <g>
                               <circle cx="32.124" cy="78.303" r="5.854"/>
                               <circle cx="67.739" cy="78.303" r="5.854"/>
                               <path d="M73.106,63.91H33.362l1.704-3.175l34.894-0.24c1.596-0.01,3.003-1.055,3.473-2.581l2.592-8.399   c-0.998,0.172-2.022,0.266-3.07,0.266c-1.69,0-3.324-0.238-4.876-0.676v3.459c0,1.011-0.818,1.829-1.829,1.829   s-1.829-0.818-1.829-1.829v-4.94c-1.342-0.729-2.578-1.626-3.686-2.659V55.13c0,1.01-0.819,1.829-1.83,1.829   c-1.01,0-1.829-0.819-1.829-1.829V40.173c-1.307-2.487-2.049-5.316-2.049-8.32c0-1.163,0.113-2.299,0.326-3.398l-29.097-2.391   l-1.63-5c-0.489-1.507-1.895-2.525-3.479-2.525h-5.854c-2.021,0-3.659,1.638-3.659,3.659c0,2.021,1.639,3.659,3.659,3.659h3.198   l5.779,17.73l4.383,13.622l-4.633,8.63c-0.608,1.134-0.576,2.505,0.085,3.609c0.662,1.104,1.854,1.78,3.14,1.78h45.861   c2.021,0,3.659-1.638,3.659-3.659C76.766,65.549,75.128,63.91,73.106,63.91z M49.729,33.418c0-1.011,0.819-1.829,1.83-1.829   c1.01,0,1.829,0.818,1.829,1.829V55.13c0,1.01-0.819,1.829-1.829,1.829c-1.011,0-1.83-0.819-1.83-1.829V33.418z M42.383,32.931   c0-1.012,0.819-1.831,1.829-1.831c1.012,0,1.83,0.819,1.83,1.831V55.13c0,1.01-0.818,1.829-1.83,1.829   c-1.01,0-1.829-0.819-1.829-1.829V32.931z M35.038,32.577c0-1.01,0.819-1.828,1.831-1.828c1.01,0,1.829,0.818,1.829,1.828v17.292   c0,1.011-0.819,1.829-1.829,1.829c-1.012,0-1.831-0.818-1.831-1.829V32.577z M31.353,40.188c0,1.011-0.819,1.831-1.83,1.831   c-1.01,0-1.829-0.82-1.829-1.831v-8.232c0-1.011,0.819-1.829,1.829-1.829c1.011,0,1.83,0.818,1.83,1.829V40.188z"/>
                           </g>
                           <path d="M72.954,17.582c-7.881,0-14.269,6.39-14.269,14.271s6.388,14.27,14.269,14.27s14.27-6.389,14.27-14.27  S80.835,17.582,72.954,17.582z M79.39,38.288c-0.476,0.476-1.1,0.715-1.724,0.715c-0.625,0-1.249-0.239-1.727-0.715l-2.803-2.803  l-2.803,2.803c-0.475,0.476-1.1,0.715-1.724,0.715s-1.249-0.239-1.726-0.715c-0.952-0.953-0.952-2.498,0-3.451l2.803-2.803  l-2.803-2.801c-0.952-0.953-0.952-2.498,0-3.45c0.954-0.954,2.497-0.954,3.449,0l2.803,2.802l2.803-2.802  c0.954-0.954,2.498-0.954,3.45,0c0.952,0.952,0.952,2.497,0,3.45l-2.803,2.803l2.803,2.801C80.344,35.79,80.344,37.335,79.39,38.288  z"/>
                       </SvgIcon>
                       <SvgIcon onClick={() => window.location.href = `/payments/confirmation/${cart.id}`}
                                viewBox="0 0 64.000000 64.000000"
                                preserveAspectRatio="xMidYMid meet"
                                sx={{fontSize: 40, cursor: 'pointer', marginBottom: '10px',   transition: 'transform 0.3s ease-in-out',
                                    ':hover': {
                                        transform: 'scale(1.1)',
                                    }}}>
                           <g transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
                              fill="#000000" stroke="none">
                               <path d="M234 620 c-36 -14 -64 -59 -64 -101 l0 -39 -45 0 c-25 0 -45 -1 -46
                                -2 -8 -21 -32 -362 -26 -373 6 -12 32 -15 122 -15 l115 0 -6 44 c-9 59 10 108 56 150 27 24 52 37 85 42 l46 6 -7 67 c-3 36 -8 69 -11 74 -2 4 -24 7 -49 7
                                l-44 0 0 41 c0 53 -14 78 -55 95 -39 16 -42 16 -71 4z m76 -38 c13 -11 23 -33
                                27 -60 3 -23 10 -42 14 -42 5 0 9 -11 9 -25 0 -14 -4 -25 -10 -25 -5 0 -10 11
                                -10 25 0 24 -2 25 -69 25 -67 0 -70 -1 -73 -25 -4 -33 -22 -33 -26 0 -2 17 1
                                25 12 25 12 0 16 10 16 40 0 69 59 103 110 62z"/>
                               <path d="M391 282 c-100 -50 -106 -190 -11 -246 94 -55 212 10 212 117 0 57
                                    -24 99 -72 126 -46 26 -84 27 -129 3z m133 -81 c7 -10 -73 -91 -88 -91 -12 0
                                    -56 41 -56 52 0 13 22 9 40 -7 15 -13 20 -11 50 20 35 37 45 41 54 26z"/>
                           </g>
                       </SvgIcon>
                    </span>
                }

            </div>
        </div>,
        document.body
    );
};

export default CartOverlay;