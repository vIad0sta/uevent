import React from 'react';
import CompanyShortCut from "./CompanyShortCut";
import {SvgIcon} from "@mui/material";

function ProfileCompanies(props) {
    return (
        <div >
            <div className={'companies-header'}>
            <button
                style={{margin: '10px'}}
                className={'profile-button'}
                onClick={() => window.location.replace(`/users/${props.user.id}/company-creator`)}>Add company</button>
        </div>
            {props.companies &&
                <div className="grid-container-companies" >
                    {props.companies.map(element => (
                        <CompanyShortCut company={element}/>
                    ))}
                </div>}
            {props.companies.length === 0 &&
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
        </div>
    );
}

export default ProfileCompanies;