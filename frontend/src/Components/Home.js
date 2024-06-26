import React, { useEffect, useState } from 'react';
import "../styles/home.css"
import EventShortCut from "./EventShortCut";
import Toolbar from "./Toolbar";
import EventRequests from "../Requests/EventRequests";
import Pagination from '@mui/material/Pagination';
import { css } from "@emotion/react";
import queryString from 'query-string';
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {SvgIcon} from "@mui/material";

function Home(props) {
    const [eventsArray, setEventsArray] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 9
    const [pagesCount, setPagesCount] = useState(1)
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [themes, setThemes] = useState([])
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [formats, setFormats] = useState([])
    const [showToolbar, setShowToolbar] = useState(false); // State to track toolbar visibility
    const [isRotated, setIsRotated] = useState(false); // State to track rotation
    const [sortOption, setSortOption] = useState('none');
    const [sortDirection, setSortDirection] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State to track loading state
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if(localStorage.getItem('ticketBought') === 'true')
            setOpen(true)
        fetchData();
    }, [currentPage])

    const fetchData = async () => {
        try{
            const query = {
                page: currentPage,
                pageSize: pageSize,
                filterThemes: selectedThemes,
                filterFormats: selectedFormats,
                sortOption: sortOption,
                sortDirection: sortDirection
            }

            const eventsResponse = await EventRequests.getEvents(query)
            setEventsArray(eventsResponse.data.events)
            setPagesCount(Math.ceil(eventsResponse.data.eventsCount / pageSize))

            const themesResponse = await EventRequests.getEventThemes()
            setThemes(themesResponse.data.themes)

            const formatsResponse = await EventRequests.getEventFormats()
            setFormats(formatsResponse.data.formats)
        }catch (e) {

        }
    }

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

    const onPageChange = (event, value) => {
        event.preventDefault()
        setCurrentPage(value)
    }

    const toggleToolbar = () => {
        setShowToolbar(!showToolbar);
        if (showToolbar)
            setIsRotated(true);
        else
            setIsRotated(!isRotated);
    };

    return (
        <div>
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">
                    </div>
                </div>
            )}
            <Box sx={{ width: '100%' }}>
                <Collapse in={open}>
                    <Alert
                        severity="success"
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    localStorage.removeItem('ticketBought')
                                    setOpen(false)
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        Ticket successfully bought!!
                    </Alert>
                </Collapse>

            </Box>
           <div style={{display:'flex',width: "100%",alignItems: 'center',justifyContent:'center'}}>
            <svg
                style={{ cursor: 'pointer' }}
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                    toggleToolbar();
                }}
                viewBox="0 0 50 50"
                width="50px"
                height="50px"
                className={isRotated ? 'rotate-close' : 'rotate'}
            >
                <path d="M 22.205078 2 A 1.0001 1.0001 0 0 0 21.21875 2.8378906 L 20.246094 8.7929688 C 19.076509 9.1331971 17.961243 9.5922728 16.910156 10.164062 L 11.996094 6.6542969 A 1.0001 1.0001 0 0 0 10.708984 6.7597656 L 6.8183594 10.646484 A 1.0001 1.0001 0 0 0 6.7070312 11.927734 L 10.164062 16.873047 C 9.583454 17.930271 9.1142098 19.051824 8.765625 20.232422 L 2.8359375 21.21875 A 1.0001 1.0001 0 0 0 2.0019531 22.205078 L 2.0019531 27.705078 A 1.0001 1.0001 0 0 0 2.8261719 28.691406 L 8.7597656 29.742188 C 9.1064607 30.920739 9.5727226 32.043065 10.154297 33.101562 L 6.6542969 37.998047 A 1.0001 1.0001 0 0 0 6.7597656 39.285156 L 10.648438 43.175781 A 1.0001 1.0001 0 0 0 11.927734 43.289062 L 16.882812 39.820312 C 17.936999 40.39548 19.054994 40.857928 20.228516 41.201172 L 21.21875 47.164062 A 1.0001 1.0001 0 0 0 22.205078 48 L 27.705078 48 A 1.0001 1.0001 0 0 0 28.691406 47.173828 L 29.751953 41.1875 C 30.920633 40.838997 32.033372 40.369697 33.082031 39.791016 L 38.070312 43.291016 A 1.0001 1.0001 0 0 0 39.351562 43.179688 L 43.240234 39.287109 A 1.0001 1.0001 0 0 0 43.34375 37.996094 L 39.787109 33.058594 C 40.355783 32.014958 40.813915 30.908875 41.154297 29.748047 L 47.171875 28.693359 A 1.0001 1.0001 0 0 0 47.998047 27.707031 L 47.998047 22.207031 A 1.0001 1.0001 0 0 0 47.160156 21.220703 L 41.152344 20.238281 C 40.80968 19.078827 40.350281 17.974723 39.78125 16.931641 L 43.289062 11.933594 A 1.0001 1.0001 0 0 0 43.177734 10.652344 L 39.287109 6.7636719 A 1.0001 1.0001 0 0 0 37.996094 6.6601562 L 33.072266 10.201172 C 32.023186 9.6248101 30.909713 9.1579916 29.738281 8.8125 L 28.691406 2.828125 A 1.0001 1.0001 0 0 0 27.705078 2 L 22.205078 2 z M 23.056641 4 L 26.865234 4 L 27.861328 9.6855469 A 1.0001 1.0001 0 0 0 28.603516 10.484375 C 30.066026 10.848832 31.439607 11.426549 32.693359 12.185547 A 1.0001 1.0001 0 0 0 33.794922 12.142578 L 38.474609 8.7792969 L 41.167969 11.472656 L 37.835938 16.220703 A 1.0001 1.0001 0 0 0 37.796875 17.310547 C 38.548366 18.561471 39.118333 19.926379 39.482422 21.380859 A 1.0001 1.0001 0 0 0 40.291016 22.125 L 45.998047 23.058594 L 45.998047 26.867188 L 40.279297 27.871094 A 1.0001 1.0001 0 0 0 39.482422 28.617188 C 39.122545 30.069817 38.552234 31.434687 37.800781 32.685547 A 1.0001 1.0001 0 0 0 37.845703 33.785156 L 41.224609 38.474609 L 38.53125 41.169922 L 33.791016 37.84375 A 1.0001 1.0001 0 0 0 32.697266 37.808594 C 31.44975 38.567585 30.074755 39.148028 28.617188 39.517578 A 1.0001 1.0001 0 0 0 27.876953 40.3125 L 26.867188 46 L 23.052734 46 L 22.111328 40.337891 A 1.0001 1.0001 0 0 0 21.365234 39.53125 C 19.90185 39.170557 18.522094 38.59371 17.259766 37.835938 A 1.0001 1.0001 0 0 0 16.171875 37.875 L 11.46875 41.169922 L 8.7734375 38.470703 L 12.097656 33.824219 A 1.0001 1.0001 0 0 0 12.138672 32.724609 C 11.372652 31.458855 10.793319 30.079213 10.427734 28.609375 A 1.0001 1.0001 0 0 0 9.6328125 27.867188 L 4.0019531 26.867188 L 4.0019531 23.052734 L 9.6289062 22.117188 A 1.0001 1.0001 0 0 0 10.435547 21.373047 C 10.804273 19.898143 11.383325 18.518729 12.146484 17.255859 A 1.0001 1.0001 0 0 0 12.111328 16.164062 L 8.8261719 11.46875 L 11.523438 8.7734375 L 16.185547 12.105469 A 1.0001 1.0001 0 0 0 17.28125 12.148438 C 18.536908 11.394293 19.919867 10.822081 21.384766 10.462891 A 1.0001 1.0001 0 0 0 22.132812 9.6523438 L 23.056641 4 z M 25 17 C 20.593567 17 17 20.593567 17 25 C 17 29.406433 20.593567 33 25 33 C 29.406433 33 33 29.406433 33 25 C 33 20.593567 29.406433 17 25 17 z M 25 19 C 28.325553 19 31 21.674447 31 25 C 31 28.325553 28.325553 31 25 31 C 21.674447 31 19 28.325553 19 25 C 19 21.674447 21.674447 19 25 19 z"/>
            </svg>
            </div>
          <div className={`toolbar-container ${showToolbar ? 'show' : ''}`}>
                    <Toolbar
                        themes={themes}
                        selectedThemes={selectedThemes}
                        setSelectedThemes={setSelectedThemes}
                        fetchData={fetchData}
                        formats={formats}
                        selectedFormats={selectedFormats}
                        setSelectedFormats={setSelectedFormats}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                        sortDirection={sortDirection}
                        setSortDirection={setSortDirection}
                    />
                </div>
            {eventsArray.length === 0 &&
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
            <div className={'events-container'}>
                <div key={sortDirection} className="grid-container">
                    {eventsArray.map(eventElement => (
                        <EventShortCut eventElement={eventElement} key={eventElement.id} />
                    ))}
                </div>
                {eventsArray.length !== 0 &&<div className={'pagination'}>
                    <Pagination
                        onChange={onPageChange}
                        sx={paginationStyles}
                        color={'secondary'}
                        count={pagesCount}
                        size="large"
                        defaultPage={1}
                    />
                </div>}
            </div>
        </div>
    );
}

export default Home;
