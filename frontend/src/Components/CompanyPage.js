import React, {useEffect, useRef, useState} from 'react';
import "../styles/companyPage.css"
import {useParams} from "react-router-dom";
import CompanyRequests from "../Requests/CompanyRequests";
import EventRequests from "../Requests/EventRequests";
import EventShortCut from "./EventShortCut";
import {AdvancedMarker, APIProvider, Map} from "@vis.gl/react-google-maps";
import {useLoadScript} from "@react-google-maps/api";
import {getGeocode, getLatLng} from "use-places-autocomplete";
import {Switch} from "@mui/material";
import UserRequests from "../Requests/UserRequests";
import PlacesAutocomplete from "./PlacesAutocomplete";
import Avatar from "@mui/material/Avatar";

function CompanyPage(props) {
    const fileInputRef = useRef(null);
    const {companyId} = useParams();
    const [company, setCompany] = useState(null);
    const [eventsArray, setEventsArray] = useState([]);
    const [editing, setEditing] = useState(false);
    const [inputs, setInputs] = useState();
    const [isOwner, setOwner] = useState(false);
    const [position, setPosition] = useState(null);
    const [center, setCenter] = useState(null);
    const [zoom, setZoom] = useState(10);
    const [companySubscription, setCompanySubscription] = useState(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: ['places']
    })
    useEffect(() => {
        fetchData();
    }, [isLoaded]);
    const fetchData = async () => {
     try{
         if(!isLoaded) return;
         const response = await CompanyRequests.getCompany(companyId);
         setCompany(response.data.company)
         setOwner(response.data.isOwner);
         setInputs(values => ({...values, ['poster']: response.data.company.poster}))
         setInputs(values => ({...values, ['id']: response.data.company.id}))
         const eventsResponse = await EventRequests.getEventsByCompany(companyId)
         setEventsArray(eventsResponse.data)
         if(JSON.parse(localStorage.getItem('signedIn')) === true){
             const subscriptionResp = await UserRequests.getCompanySubscription(companyId);
             setCompanySubscription(subscriptionResp.data);
         }
         const address = response.data.company.location;
         const results = await getGeocode({address});
         const {lat, lng} = await getLatLng(results[0]);
         setPosition({lat: lat, lng: lng})
         setCenter({lat: lat, lng: lng})
     }
     catch(e){}
    }
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
    const handleEditToggle = () => {
        setEditing(!editing);
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs({...inputs, [name]: value})
    }

    const handleSave = async () => {
        try{
            if(!inputs.location || inputs.location === '' || inputs.email === '' ||  inputs.name === '') return;
            const updateResponse = await CompanyRequests.editCompany(inputs);
            const response = await CompanyRequests.getCompany(companyId);
            setOwner(response.data.isOwner);
            setCompany(response.data.company)
            setEditing(!editing);
        }
        catch(e){}
    }
    const handleClickAvatar = () => {
        fileInputRef.current.click();
    };
    const handleMapCenterChange = (newCenter) => {
        setCenter(newCenter.detail.center);
    };
    const handleZoomChanged = (newZoom) => {
        setZoom(newZoom.detail.zoom);
    };
    const handleSubscriptionChange = async (event, checked) => {
        try{
            const resp = await UserRequests.subscribeToCompany({companyId: companyId, id: companySubscription ? companySubscription.id : null,checked: checked});
            if(checked) setCompanySubscription(resp.data.data);
            else setCompanySubscription(null);
        }
        catch (e) {}
    };

    return (
        <div className={'flex-container company-info-container'}>
            {company && !editing &&
                <div className="company-info">

                    <div className={'image-box'} style={{display: 'flex', justifyContent: 'center', width: '600px', height: '400px',overflow:'hidden'}}>
                        <Avatar
                            src={`https://localhost:3001${company.poster}`}
                            sx={{ width: 300, height: 300 }}>
                        </Avatar>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems:'center'}}>
                        <h2 style={{width: '100%',backgroundColor: '#007bff',textAlign: 'center'}}>Company Profile</h2>
                        {localStorage.getItem('signedIn') === 'true' &&
                            <p style={{color: 'whitesmoke', fontWeight:'bold',fontSize: '20px'}}>
                                Subscription:
                                <Switch
                                    checked={companySubscription !== null}
                                    color="warning"
                                    onChange={(event, checked) => handleSubscriptionChange(event, checked)}/></p>}
                    </div>
                    <div  style={{marginBottom : '20px',color: 'whitesmoke'}}>
                        <label style={{color: 'whitesmoke'}}>Name: {company.name}</label>
                    </div>
                    <div style={{marginBottom : '20px',color: 'whitesmoke'}}>
                        <label style={{color: 'whitesmoke'}}>Email: {company.email}</label>
                    </div>
                    <div>
                        {isLoaded && company &&
                            <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
                                <div style={{ width: '400px', height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
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

                    {isOwner &&<button className={'company-page-btn'} onClick={handleEditToggle}>Edit Company</button>}
                </div>}
            {company && isOwner && editing && (
                <div className="company-info">
                    <h2>Edit Company</h2>
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
                    <div>
                        <label>Name: <input type="text" required name={'name'} defaultValue={company.name} onChange={handleChange}/></label>
                    </div>
                    <div>
                        <label>Email: <input type="email" required name={'email'} defaultValue={company.email} onChange={handleChange}/></label>
                    </div>
                    <div>
                        {isLoaded && company &&
                            <APIProvider apiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
                                <PlacesAutocomplete oldValue={company.location} setCenter={setCenter} setSelected={setPosition} setInputs={setInputs}/>
                                <div style={{ width: '400px', height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
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
                <button className={'company-page-btn'} onClick={handleEditToggle}>Cancel</button>
                <button className={'company-page-btn'} onClick={handleSave}>Save Changes</button>
            </div>
        )}

            {isOwner && <button className={'company-page-btn'} onClick={() => window.location.replace(`/companies/${companyId}/event-creator`)}>Create Event</button>}
            <div className={'events-container'}>
                <div className={'grid-container'}>
                {eventsArray.map(eventElement => (
                    <EventShortCut eventElement={eventElement}/>
                ))}
                </div>
            </div>
        </div>
    );
}

export default CompanyPage;