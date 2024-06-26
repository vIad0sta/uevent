import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import CompanyRequests from "../Requests/CompanyRequests";
import EventRequests from "../Requests/EventRequests";
import dayjs, {Dayjs} from 'dayjs';
import 'react-datepicker/dist/react-datepicker.css'
import {Autocomplete, Button, Switch, TextField} from "@mui/material";
import {AdvancedMarker, APIProvider, Map} from "@vis.gl/react-google-maps";
import {useLoadScript} from "@react-google-maps/api";
import PlacesAutocomplete from "./PlacesAutocomplete";
import Avatar from "@mui/material/Avatar";
import SendIcon from "@mui/icons-material/Send";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider, renderTimeViewClock} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/uk';
import '../styles/eventCreator.css';

function EventCreator(props) {
    const fileInputRef = useRef(null);
    const { companyId } = useParams();
    const [inputs, setInputs] = useState({poster: '/static/images/poster.avif'});
    const [selected, setSelected] = useState(null);
    const [company, setCompany] = useState(null);
    const [formats, setFormats] = useState([]);
    const [themes, setThemes] = useState([]);
    const [center, setCenter] = useState({ lat: 53.54, lng: 10 });
    const [zoom, setZoom] = useState(10);
    const [value, setValue] = useState(dayjs('2022-04-17T15:30'));
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: ['places']
    })
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            setCenter({lat: lat, lng: lng})
        });
            fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const response = await CompanyRequests.getCompany(companyId);
            setInputs(values => ({ ...values, ['CompanyId']: Number(companyId) }))
            setCompany(response.data.company);
            const formatsResponse = await EventRequests.getEventFormats();
            setFormats(formatsResponse.data.formats)
            const themesResponse = await EventRequests.getEventThemes();
            setThemes(themesResponse.data.themes)
        }
        catch(e){}
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };
    const handleAvatarChange = async (event) => {
        const avatarInput = document.getElementById('profileImage');
        const selectedFile = avatarInput.files[0];
        const formData = new FormData();
        if(selectedFile){
            formData.append('photo', selectedFile);
            const response = await EventRequests.savePoster(formData);
            setInputs(values => ({ ...values, [event.target.name]: `/static/images/${avatarInput.files[0].name}` }));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(!inputs.location) return;
            const inputsWithUTC = { ...inputs, startTime: new Date(inputs.startTime).toISOString(), endTime: new Date(inputs.endTime).toISOString() };
            const response = await EventRequests.addEvent(inputsWithUTC);
            window.location.href = '/';
        }
        catch (e) {}
    };
    const handleMapCenterChange = (newCenter) => {
        setCenter(newCenter.detail.center);
    };
    const handleClickAvatar = () => {
        fileInputRef.current.click();
    };
    const handleZoomChanged = (newZoom) => {
        setZoom(newZoom.detail.zoom);
    };

    return (
        <div className="flex-container event-creator-container">
            <form className="event-form" onSubmit={handleSubmit}>
                <div className="avatar-container" style={{ marginBottom: '10px'}}>
                    <Avatar
                        src={`https://localhost:3001${inputs.poster}`}
                        onClick={handleClickAvatar}
                        style={{height:'200px',width:'200px'}}
                    />
                    <input
                        type="file"
                        className="file-input"
                        id="profileImage"
                        ref={fileInputRef}
                        name="poster"
                        onChange={handleAvatarChange}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <TextField
                        className="text-input"
                        required
                        type="text"
                        name="title"
                        label="Title"
                        value={inputs.title || ""}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <TextField
                        className="text-input"
                        type="text"
                        name="description"
                        required
                        label="Description"
                        value={inputs.description || ""}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            name="startTime"
                            label="Start time"
                            required
                            onChange={(value) => setInputs({ ...inputs, startTime: value })}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                            ampm={false}
                        />
                    </LocalizationProvider>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            name="endTime"
                            label="End time"
                            required
                            onChange={(value) => setInputs({ ...inputs, endTime: value })}
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                            ampm={false}
                        />
                    </LocalizationProvider>
                </div>
                {isLoaded && (
                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
                        <PlacesAutocomplete
                            setCenter={setCenter}
                            setSelected={setSelected}
                            setInputs={setInputs}
                        />
                        <div className="map-container" style={{ marginBottom: '10px' }}>
                            <Map
                                zoom={zoom}
                                center={center}
                                mapId={process.env.REACT_APP_MAP_ID}
                                onCenterChanged={handleMapCenterChange}
                                onZoomChanged={handleZoomChanged}
                            >
                                {selected && <AdvancedMarker position={selected}></AdvancedMarker>}
                            </Map>
                        </div>
                    </APIProvider>
                )}
                <div style={{ marginBottom: '10px' }}>
                    <Autocomplete
                        disablePortal
                        name="EventFormatId"
                        id="combo-box-demo"
                        options={formats.map((item) => ({ label: item.name, id: item.id }))}
                        sx={{ width: 350 }}
                        onChange={(event, value, reason, details) => {
                            if (!value) {
                                setInputs({ ...inputs, EventFormatId: null });
                            }
                            else setInputs({...inputs, EventFormatId: value.id});
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField required {...params} label="Formats" />}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <Autocomplete
                        disablePortal
                        name="EventThemeId"
                        id="combo-box-demo"
                        options={themes.map((item) => ({ label: item.name, id: item.id }))}
                        sx={{ width: 350 }}
                        onChange={(event, value, reason, details) => {
                            if (!value) {
                                setInputs({ ...inputs, EventThemeId: null });
                            }
                            else setInputs({ ...inputs, EventThemeId: value.id });
                        }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField required {...params} label="Themes" />}
                    />
                </div>
                <div className="switch-container" style={{ marginBottom: '10px' }}>
                    <span className="switch-label">Attendees visible for all</span>
                    <Switch
                        defaultChecked
                        color="warning"
                        onChange={(event, checked) => {
                            setInputs((values) => ({ ...values, attendeesVisibility: checked }));
                        }}
                    />
                </div>
                <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                    Create
                </Button>
            </form>
        </div>
    );


}

export default EventCreator;