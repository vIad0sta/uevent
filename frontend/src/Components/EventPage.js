import React, {useEffect, useState} from 'react';
import "../styles/eventPage.css"
import Select from "@mui/material/Select";
import EventRequests from "../Requests/EventRequests";
import {useParams} from "react-router-dom";
import CompanyRequests from "../Requests/CompanyRequests";
import CartRequests from "../Requests/CartRequests";
import UserRequests from "../Requests/UserRequests";
import {useTheme} from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import {TextField} from "@mui/material";
import EventShortCut from "./EventShortCut";
import {AdvancedMarker, APIProvider, Map} from "@vis.gl/react-google-maps";
import {useLoadScript} from "@react-google-maps/api";
import {getGeocode, getLatLng} from "use-places-autocomplete";
import Pagination from "@mui/material/Pagination";
import {css} from "@emotion/react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const paginationStyles = css`
      .MuiPaginationItem-root {
        color: white;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .Mui-selected {
        color: #111111;
      }
    `;
function getStyles(filterElementName, filterElements, filterElement) {
    return {
        fontWeight:
            filterElements.indexOf(filterElementName) === -1
                ? filterElement.typography.fontWeightRegular
                : filterElement.typography.fontWeightMedium,
    };
}
function EventPage(props) {
    const [event, setEvent] = useState({})
    const [organizer, setOrganizer] = useState(null)
    const { eventId } = useParams();
    const pageSize = 10;
    const [pagesCount, setPagesCount] = useState(1);
    const [isOwner, setOwner] = useState(false);
    const [otherEvents, setOtherEvents] = useState([])
    const [similarEvents, setSimilarEvents] = useState([])
    const [attendees, setAttendees] = useState([])
    const [tickets, setTickets] = useState(null)
    const [position, setPosition]=useState(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [commentBody, setCommentBody] = useState({
        EventId: eventId
    });
    const [center, setCenter] = useState(null);
    const [zoom, setZoom] = useState(10);
    const [comments, setComments] = useState([]);
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false); // State to track loading state
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: ['places']
    })
    useEffect(() => {
        fetchData();
    },[isLoaded])

    useEffect(() => {
        getComments();
    }, [isLoaded, currentPage])
    const fetchData = async () => {
      try{
          if(!isLoaded) return
          setIsLoading(true);
          const eventResponse = await EventRequests.getEvent(eventId)
          setEvent(eventResponse.data)

          const address = eventResponse.data.location;
          const results = await getGeocode({address});
          const {lat, lng} = await getLatLng(results[0]);
          setPosition({lat: lat, lng: lng})
          setCenter({lat: lat, lng: lng});

          const organizerResponse = await CompanyRequests.getCompany(eventResponse.data.CompanyId)
          setOrganizer(organizerResponse.data.company)
          setOwner(organizerResponse.data.isOwner);

          const otherEventsResponse = await EventRequests.getEventsByCompany(eventResponse.data.CompanyId)
          setOtherEvents(otherEventsResponse.data)

          const similarEventsResponse = await EventRequests.getSimilarEvents(eventResponse.data.EventThemeId)
          setSimilarEvents(similarEventsResponse.data)

          const ticketsResponse = await EventRequests.getTickets(eventResponse.data.id)
          setTickets(ticketsResponse.data)

          if(eventResponse.data.attendeesVisibility || localStorage.getItem('signedIn')) {
              const attendeesResponse = await EventRequests.getAttendeesByEvent(eventId);
              setAttendees(attendeesResponse.data.eventAttendees);
          }
          if(JSON.parse(localStorage.getItem('signedIn')) === true){
              const response = await UserRequests.getCart();
              props.setCart(response.data)
              const getResponse = await CartRequests.getCartTickets(response.data.id);
              props.setTickets(getResponse.data.cartTickets)
          }

          setIsLoading(false);
      }
      catch (e) {}
    }
    const getComments = async ()  => {
        const params = {
            page: currentPage,
            pageSize: pageSize
        }
        const resp = await EventRequests.getCommentsByEvent(eventId, params);
        setPagesCount(Math.ceil(resp.data.commentCount / pageSize))
        setComments(resp.data.comments);
    }
    const handleCommentChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setCommentBody(values => ({ ...values, [name]: value }));
        setCommentBody(values => ({ ...values, ['creationTime']: new Date().toISOString() }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault()
        const response = await EventRequests.addComment(eventId, commentBody);
        await getComments();

    };
    const onPageChange = (event, value) => {
        event.preventDefault()
        setCurrentPage(value)
    }
    const handleMapCenterChange = (newCenter) => {
        setCenter(newCenter.detail.center);
    };
    const handleZoomChanged = (newZoom) => {
        setZoom(newZoom.detail.zoom);
    };
    const handleChange = async (event) => {
       try{
           const {
               target: { value },
           } = event;
           let response;
           if(value.length < props.cartTickets.length) {
               const differentElements = props.cartTickets.filter(item => !value.includes(item));
               await CartRequests.deleteCartTicket(props.cart.id, differentElements[0].id)
           }
           else
               await CartRequests.addCartTicket({CartId: props.cart.id, TicketId: value[value.length - 1], quantity: 1})

           const getResponse = await CartRequests.getCartTickets(props.cart.id);
           props.setTickets(getResponse.data.cartTickets)
       }
       catch (e) {}
    };

    return (
        <>
        {isLoading && (
            <div className="loading-overlay">
                <div className="loading-spinner">
                </div>
            </div>
        )}
            <div className={'container'}>
            <div className={'img-time-container'}>
                <div className={'image-box'}>
                    <img
                        src={`https://localhost:3001${event.poster}`}
                        alt="Blog image">
                    </img>
                </div>
                <div className={'event-time-box'}>
                    <div className={'time-box'}>
                    <svg   viewBox="0 0 50 50" width="50px" height="50px"><path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 37.039062 10.990234 A 1.0001 1.0001 0 0 0 36.265625 11.322266 L 26.183594 22.244141 A 3 3 0 0 0 25 22 A 3 3 0 0 0 22 25 A 3 3 0 0 0 25 28 A 3 3 0 0 0 25.5 27.958984 L 29.125 34.486328 A 1.0010694 1.0010694 0 1 0 30.875 33.513672 L 27.246094 26.984375 A 3 3 0 0 0 28 25 A 3 3 0 0 0 27.652344 23.599609 L 37.734375 12.677734 A 1.0001 1.0001 0 0 0 37.039062 10.990234 z"/></svg>
                        {new Date(event.startTime).toLocaleTimeString([], {day: '2-digit',month: '2-digit', hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], {day: '2-digit',month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {tickets && props.cartTickets &&
                        <FormControl sx={{ m: 1, alignSelf: 'center', width: '90%'}}>
                        <InputLabel id="demo-multiple-chip-label">Ticket types</InputLabel>
                        <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={props.cartTickets.map(ticket => ticket.id)}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-chip" label={'Ticket types'}/>}
                            renderValue={(selected) => (
                                <Box
                                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <>{tickets.find(ticket => ticket.id === value) && <Chip
                                            key={value} label={tickets.find(ticket => ticket.id === value).type}
                                        />}</>
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {tickets && tickets.map(currentTicket => (
                                <MenuItem
                                    key={currentTicket.id}
                                    value={currentTicket.id}
                                    style={getStyles(currentTicket.type, props.cartTickets, theme)}
                                >
                                    {currentTicket.type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    }
                    {isOwner && <button onClick={() => window.location.href = `/events/${eventId}/tickets`} className={'buy-button'}>Add ticket</button>}
                    {JSON.parse(localStorage.getItem('signedIn')) === true &&
                        <button onClick={() => window.location.href = `/payments/confirmation/${props.cart.id}`} className={'buy-button'}>Buy tickets</button>}
                </div>
            </div>
                <div className={'event-title'}>
                    {event.title}
                </div>
                <div className={'description-location-container'}>
                    <div className={'description-box'}>
                        <div style={{fontWeight:'bold', fontSize: 25}}>
                        Event description
                        </div>
                        <div>
                        {event.description}
                        </div>
                    </div>
                    <div className={'location-box'}>
                        {isLoaded && event &&
                            <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                                    <Map mapContainerClassName={'map-container'}
                                         zoom={zoom} center={center}
                                         mapId={process.env.REACT_APP_MAP_ID}
                                         onCenterChanged={handleMapCenterChange}
                                         onZoomChanged={handleZoomChanged}
                                    >
                                       <AdvancedMarker position={position}></AdvancedMarker>
                                    </Map>
                                </div>
                            </APIProvider>
                        }
                    </div>
                </div>
                <div className={'comments-container'}>
                    {JSON.parse(localStorage.getItem('signedIn')) === true &&
                        <Box
                        component="form"
                        sx={{
                            width: '60%',
                            marginTop: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            '& .MuiTextField-root': {
                                width: '100%',
                                borderRadius: '10px'
                            },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            id="filled-multiline-static"
                            label="Leave a comment"
                            multiline
                            rows={4}
                            variant="filled"
                            onChange={handleCommentChange}
                            name={'text'}
                        />
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderBottomLeftRadius: '10px',
                            borderBottomRightRadius: '10px',
                            cursor: 'pointer',
                        }} type="submit">Submit</button>
                    </Box>}
                    <div style={{marginTop: 10,width: '60%'}}>
                    {comments.map((comment, index) => (
                        <div key={comment.id} style={{width: '100%'}} className="one-comment-container">
                            <div className="dialogbox">
                                <div className="body">
                                    <span className="tip tip-up"></span>
                                    <div className="message">
                                        <span>{comment.text}</span>
                                        <div style={{position:'absolute',alignSelf:'flex-end',right:0,bottom:0,marginRight: 5}}>{comment.creationTime}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div className={'pagination'}>
                        <Pagination
                            onChange={onPageChange}
                            sx={paginationStyles}
                            color={'secondary'}
                            count={pagesCount}
                            size="large"
                            defaultPage={1}
                        />
                    </div>
                </div>
                <div className={'events-container'}>
                    {organizer && <h1>
                    Other by <span style={{cursor: 'pointer'}} onClick={() => window.location.href = `/companies/${organizer.id}`}>{organizer.name}</span> :
                    </h1>}
                    <div className={'grid-container'}>
                        {otherEvents.map(eventElement => (
                            <EventShortCut key={eventElement.id} eventElement={eventElement}/>
                        ))}
                    </div>
                </div>
                <div className={'events-container'}>
                    <h1>Similar events: </h1>
                    <div className={'grid-container'}>
                        {similarEvents.map(eventElement => (
                            <EventShortCut key={eventElement.id} eventElement={eventElement}/>
                        ))}
                    </div>
                </div>
            </div>
        </>
        )
}

export default EventPage;