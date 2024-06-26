import React, {useEffect, useState} from 'react';
import "../styles/ticketCreator.css"
import {useParams} from "react-router-dom";
import CompanyRequests from "../Requests/CompanyRequests";
import EventRequests from "../Requests/EventRequests";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import {Button, TextField} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";


function TicketsCreator(props) {
    const { eventId } = useParams();
    const [inputs, setInputs] = useState({EventId: eventId});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await EventRequests.addTicket(inputs);
            window.location.href = `/events/${eventId}`;
        }
        catch(e){}
    };

    return (
        <div className={'ticket-creator-container'}>
            <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px' }}>
                    <TextField
                        type="text"
                        name={'type'}
                        label={'Type'}
                        required
                        value={inputs.type || ''}
                        onChange={handleChange}
                        style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <TextField
                        type="number"
                        name={'price'}
                        label={'Price'}
                        required
                        inputProps={{
                            min: 1,
                            step: 0.1
                        }}
                        value={inputs.price || 1}
                        onChange={handleChange}
                        style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <TextField
                        type="number"
                        name={'quantity'}
                        value={inputs.quantity || 1}
                        required
                        onChange={handleChange}
                        label="Quantity"
                        inputProps={{
                            min: 1
                        }}
                        style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Button
                        endIcon={<SendIcon />}
                        variant={'contained'}
                        type="submit"
                        style={{ width: '100%' }}>
                        Add
                    </Button>
                </div>
            </form>
        </div>

    );
}

export default TicketsCreator;