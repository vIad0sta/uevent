import React, {useEffect, useRef, useState} from 'react';
import "../styles/profile.css"
import UserRequests from "../Requests/UserRequests";
import CompanyRequests from "../Requests/CompanyRequests";
import Avatar from '@mui/material/Avatar';
import CompanyShortCut from "./CompanyShortCut";
import {Switch, TextField} from "@mui/material";
import ProfileTickets from "./ProfileTickets";
import ProfileInfo from "./ProfileInfo";
import ProfileEvents from "./ProfileEvents";
import ProfileCompanies from "./ProfileCompanies";

function Profile(props) {
    const [user, setUser] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [events, setEvents] = useState([]);
    const [tickets, setTickets] = useState([]);
    const fileInputRef = useRef(null);
    const [avatar, setAvatar] = useState('');
    const [activeContainer, setActiveContainer] = useState('info');

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
       try{
           const response = await UserRequests.getUser();
           setUser(response.data)
           setAvatar(response.data.avatar)
           const companiesResponse = await CompanyRequests.getCompaniesByUser(response.data.id);
           setCompanies(companiesResponse.data.companies)
           const eventsResponse = await UserRequests.getEvents();
           setEvents(eventsResponse.data.eventsArray);
           const ticketsResponse = await UserRequests.getTickets();
           setTickets(ticketsResponse.data.tickets);
       }
       catch (e) {
       }
    }


    const handleClickAvatar = () => {
            fileInputRef.current.click();
    };

    const handleAvatarChange = async () => {
        const avatarInput = document.getElementById('profileImage');
        const selectedFile = avatarInput.files[0];
        const formData = new FormData();
        if(selectedFile){
            formData.append('photo', selectedFile);
            const response = await UserRequests.updateUserAvatar(formData);
            setAvatar(`/static/images/${selectedFile.name}`)
        }
    }

    const switchContainer = (containerName) => {
        setActiveContainer(containerName);
    };
    return (
        <div className="profile-container">
            {user && (
                    <div className="user-info-bar">
                        <div className="user-info-background" style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            backgroundSize: 'cover',
                            filter: 'blur(50px)',
                            WebkitFilter: 'blur(50px)',
                            backdropFilter: 'blur(50px)',
                            backgroundImage: `url(https://localhost:3001${avatar})`
                        }}>

                        </div>
                        <div style={{position:'absolute', width:'100%',height: '100%'}}>
                            <Avatar
                            src={`https://localhost:3001${avatar}`}
                            onClick={handleClickAvatar}
                            sx={{  cursor: 'pointer', left: '5%',  top: '50%', transform: 'translateY(-50%)', width: 200, height: 200 }}

                        />
                        <input
                            type="file"
                            id={'profileImage'}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                        />
                        <div className={'user-titles'}>
                            {user.firstName} {user.lastName}
                        </div>
                        </div>
                    </div>

                )}
            <div className={'page-navigation'}>
                <button onClick={() => switchContainer('tickets')}>My tickets</button>
                <button onClick={() => switchContainer('info')}>My info</button>
                <button onClick={() => switchContainer('events')}>My events</button>
                <button onClick={() => switchContainer('companies')}>My companies</button>
            </div>

            {activeContainer === 'tickets' && <ProfileTickets tickets={tickets}/>}
            {activeContainer === 'info' && <ProfileInfo user={user} setUser={setUser}/>}
            {activeContainer === 'events' && <ProfileEvents events={events} />}
            {activeContainer === 'companies' && <ProfileCompanies companies={companies} user={user}/>}

        </div>
    );
}

export default Profile;