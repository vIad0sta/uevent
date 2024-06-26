import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import "../styles/companyCreator.css"
import {useParams} from "react-router-dom";
import CompanyRequests from "../Requests/CompanyRequests";
import 'react-datepicker/dist/react-datepicker.css'
import {Button, TextField} from "@mui/material";
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import usePlacesAutocomplete,{getGeocode, getLatLng} from 'use-places-autocomplete';
import {Combobox, ComboboxInput, ComboboxList, ComboboxOption, ComboboxPopover} from '@reach/combobox'
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api";
import '@reach/combobox/styles.css'
import PlacesAutocomplete from "./PlacesAutocomplete";
import Avatar from "@mui/material/Avatar";
import EventRequests from "../Requests/EventRequests";
import SendIcon from '@mui/icons-material/Send';

function CompanyCreator(props) {
    const fileInputRef = useRef(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: ['places']
    })
    const [selected, setSelected] = useState(null);
    const { userId } = useParams();
    const [inputs, setInputs] = useState({UserId: userId, poster: '/static/images/poster.avif'});
    const [center, setCenter] = useState({ lat: 53.54, lng: 10 });
    const [zoom, setZoom] = useState(10);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            setCenter({lat: lat, lng: lng})
        });
    }, []);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(!inputs.location) return;
            const response = await CompanyRequests.addCompany(inputs);
            if (response.status === 201) window.location.href = '/profile';
        }
        catch(e){}
    };
    const handleMapCenterChange = (newCenter) => {
        setCenter(newCenter.detail.center);
    };
    const handleZoomChanged = (newZoom) => {
        setZoom(newZoom.detail.zoom);
    };
    const handleClickAvatar = () => {
        fileInputRef.current.click();
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

    return (
        <div className={'company-creator-container'}>
            <form onSubmit={handleSubmit} className="company-form">
                <div className="avatar-container">
                    <label htmlFor="profileImage">
                        <Avatar
                            src={`https://localhost:3001${inputs.poster}`}
                            onClick={handleClickAvatar}
                            sx={{ cursor: 'pointer', width: 200, height: 200 }}
                        />
                        <input
                            type="file"
                            id={'profileImage'}
                            ref={fileInputRef}
                            name={'poster'}
                            onChange={handleAvatarChange}
                            style={{display: 'none'}}
                        />
                    </label>
                </div>
                <TextField
                    required
                    type="text"
                    name={'name'}
                    label={'Name'}
                    value={inputs.name || ''}
                    onChange={handleChange}
                    style={{ width: '250px',maxHeight:'80px',marginBottom: '10px'}} /> {/* Adjust the width as needed */}
                <TextField
                    required
                    type="email"
                    name={'email'}
                    label={'Email'}
                    value={inputs.email || ''}
                    onChange={handleChange}
                    style={{ width: '250px',maxHeight:'80px',marginBottom: '10px' }} /> {/* Adjust the width as needed */}

                {isLoaded &&
                    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
                        <PlacesAutocomplete setCenter={setCenter} setSelected={setSelected} setInputs={setInputs}/>
                        <div className="map-container">
                            <Map
                                mapContainerClassName={'map'}
                                zoom={zoom} center={center}
                                mapId={process.env.REACT_APP_MAP_ID}
                                onCenterChanged={handleMapCenterChange}
                                onZoomChanged={handleZoomChanged}
                            >
                                {selected && <AdvancedMarker position={selected}></AdvancedMarker>}
                            </Map>
                        </div>
                    </APIProvider>
                }
                <Button type={'submit'} variant="contained" endIcon={<SendIcon />} className="submit-button">Create</Button>
            </form>
        </div>

    );
}

export default CompanyCreator;