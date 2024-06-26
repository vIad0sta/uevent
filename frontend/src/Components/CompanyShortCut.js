import React from 'react';

function CompanyShortCut(props) {
    return (
        <div className="card" >
            <div className="card-img-holder">
                <img
                    src={`https://localhost:3001${props.company.poster}`}
                    alt="Blog image">

                </img>
            </div>
            <h3 className="blog-title">
                {props.company.name}
            </h3>
            <span className="blog-time">
                {props.company.email}
            </span>
            <p className="description">
                {props.company.location}
            </p>
            <div className="options">
    <span>
    </span>
                <button  onClick={() => window.location.href = `/companies/${props.company.id}`} className="btn">To the Company</button>
            </div>
        </div>
    );
}

export default CompanyShortCut;