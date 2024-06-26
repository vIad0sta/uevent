import React from 'react';
import "../styles/eventShortCut.css"
function EventShortCut(props) {
    return (
        <div className="card">
            <div className="card-img-holder">
                <img
                    src={`https://localhost:3001${props.eventElement.poster}`}
                    alt="Blog image">
                </img>
            </div>
            <h3 className="blog-title">
                {props.eventElement.title}
            </h3>
            <span className="blog-time">
                start: {new Date(props.eventElement.startTime).toLocaleTimeString([], {day: '2-digit',month: '2-digit', hour: '2-digit', minute: '2-digit' })} end: {new Date(props.eventElement.endTime).toLocaleTimeString([], {day: '2-digit',month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
            <p className="description">
                {props.eventElement.description}
            </p>
            <div className="options">
    <span>
    </span>
                {JSON.parse(localStorage.getItem('signedIn')) === true &&
                    <button  onClick={() => window.location.href = `/events/${props.eventElement.id}/tickets`} className="btn">Add tickets</button>}
                <button  onClick={() => window.location.href = `/events/${props.eventElement.id}`} className="btn">To the event</button>
            </div>
        </div>
    );
}

export default EventShortCut;