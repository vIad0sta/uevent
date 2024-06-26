import React, { useState } from 'react';
import "../styles/navigationBar.css";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CartOverlay from "./CartOverlay";
import Collapse from "@mui/material/Collapse";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from '@mui/icons-material/Check';
import UserRequests from "../Requests/UserRequests";
import AuthRequests from "../Requests/AuthRequests";
import {SvgIcon} from "@mui/material";

function NavigationBar(props) {
    const [activeLink, setActiveLink] = useState("Home");
    const [currentPathName, setCurrentPathName] = useState(window.location.pathname);
    const [cartOpen, setCartOpen] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleOpenCart = () => {
        setCartOpen(true);
    };

    const handleCloseCart = () => {
        setCartOpen(false);
    };
    const handleConfirmation = () => {
        setOpen(true)
    };
    const handleConfirmLogout = async () => {
        setOpen(false)
        const response = await AuthRequests.logout()
        localStorage.clear();
        window.location.href = '/sign-in'
    }

    return (
        <>
        <div className="navbar">
            <Box
                display="flex"
                alignItems="center"
                mr={2}
            >
                <div
                    style={{
                        alignContent:'center',
                        background: 'linear-gradient(to bottom, #5BA199 30%, #E5E3E4)',
                        height: 50,
                        width: 'fit-content',
                        borderRadius: 5,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 24,
                        letterSpacing: 2,
                        paddingLeft: 20,
                        paddingRight: 20,
                    }}
                >
                    Uevent
                </div>
            </Box>
            <a href="/" className={currentPathName === "/" ? "active" : ""}>
                <SvgIcon sx={{fontSize: 30}}>
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </SvgIcon>
            </a>
            {localStorage.getItem('signedIn') !== 'true' && <a href="/sign-up" className={currentPathName === "/sign-up" ? "active" : ""}>
                <SvgIcon viewBox="0 0 100 125" enable-background="new 0 0 100 100" sx={{fontSize: 30}}>
                    <path fill="#ffffff" d="M95.266,63H80V47.264C80,47.129,79.483,47,79.35,47H68.105C67.973,47,68,47.129,68,47.264V63H52.188  C52.056,63,52,63.049,52,63.182v11.243C52,74.558,52.056,75,52.188,75H68v15.343C68,90.476,67.973,91,68.105,91H79.35  c0.134,0,0.65-0.524,0.65-0.657V75h15.266C95.401,75,96,74.558,96,74.425V63.182C96,63.049,95.401,63,95.266,63z"/>
                    <path fill="#ffffff" d="M52.188,77C50.953,77,50,75.66,50,74.425V63.182C50,61.946,50.953,61,52.188,61H66v-9.745  c-3.917-4.638-9.15-8.166-15.157-9.99c6.024-3.312,10.108-9.683,10.108-17.002c0-10.727-8.763-19.422-19.57-19.422  c-10.807,0-19.568,8.696-19.568,19.422c0,7.32,4.082,13.691,10.109,17.002C18.876,45.225,9.4,57.154,9.4,71.261  c0,17.339,14.318,20.323,31.98,20.323c9.903,0,18.753-0.939,24.619-4.819V77H52.188z"/>
                </SvgIcon>
            </a>}
            {localStorage.getItem('signedIn') !== 'true' && <a href="/sign-in" className={currentPathName === "/sign-in" ? "active" : ""}>
                <SvgIcon fill="#000000"  viewBox="0 0 296.999 296.999" sx={{fontSize: 30}}>
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <g>
                            <g>
                                <g>
                                    <path d="M146.603,0c-31.527,0-61.649,9.762-87.11,28.232c-4.377,3.176-5.567,9.188-2.73,13.791l23.329,37.845 c1.509,2.449,3.971,4.158,6.793,4.716c2.82,0.559,5.748-0.084,8.077-1.773c13.897-10.081,30.343-15.41,47.56-15.41 c44.718,0,81.098,36.38,81.098,81.098c0,44.718-36.38,81.098-81.098,81.098c-17.217,0-33.663-5.329-47.56-15.41 c-2.329-1.689-5.255-2.331-8.077-1.773c-2.821,0.558-5.283,2.267-6.793,4.716l-23.329,37.846 c-2.838,4.603-1.647,10.615,2.73,13.791c25.46,18.47,55.583,28.232,87.11,28.232c81.883,0,148.5-66.617,148.5-148.5 S228.486,0,146.603,0z M146.603,276.326c-23.925,0-46.906-6.529-67.024-18.965l12.579-20.407 c15.288,8.741,32.497,13.317,50.364,13.317c56.117,0,101.771-45.655,101.771-101.771c0-56.116-45.655-101.771-101.771-101.771 c-17.866,0-35.076,4.576-50.364,13.317L79.579,39.638c20.117-12.435,43.099-18.965,67.024-18.965 c70.483,0,127.826,57.343,127.826,127.826S217.087,276.326,146.603,276.326z"></path>
                                    <path d="M105.966,193.934c-2.115,3.172-2.312,7.25-0.513,10.611c1.799,3.36,5.302,5.459,9.113,5.459h45.482 c3.456,0,6.684-1.727,8.601-4.603l34.112-51.167c2.315-3.472,2.315-7.996,0-11.467L168.65,91.599 c-1.917-2.876-5.144-4.603-8.601-4.603h-45.482c-3.812,0-7.315,2.099-9.113,5.459c-1.799,3.361-1.602,7.44,0.513,10.611 l12.027,18.041H29.288c-15.104,0-27.393,12.288-27.393,27.393s12.288,27.393,27.393,27.393h88.705L105.966,193.934z M29.288,155.219c-3.705,0-6.719-3.014-6.719-6.719c0-3.705,3.014-6.719,6.719-6.719h108.02c3.812,0,7.315-2.099,9.113-5.459 c1.799-3.361,1.602-7.44-0.513-10.611l-12.027-18.041h20.635l27.22,40.83l-27.22,40.83h-20.635l12.027-18.041 c2.115-3.172,2.312-7.25,0.513-10.611c-1.799-3.36-5.302-5.459-9.113-5.459H29.288z"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                    </SvgIcon>
            </a>}
            {localStorage.getItem('signedIn') === 'true' && <a href="/profile" className={currentPathName === "/profile" ? "active" : ""}>
                <SvgIcon fill="#000000" viewBox="0 0 45.532 45.532" sx={{fontSize: 30}}>
                        <g>
                            <path d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765   S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53   c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012   c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592   c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"/>
                        </g>
                </SvgIcon>
            </a>}
            {localStorage.getItem('signedIn') === 'true' && <a  onClick={handleConfirmation}>
                <SvgIcon fill="#000000" viewBox="0 0 320.002 320.002" sx={{fontSize: 30}}>
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <g id="XMLID_6_">
                            <path id="XMLID_7_" d="M51.213,175.001h173.785c8.284,0,15-6.716,15-15c0-8.284-6.716-15-15-15H51.213l19.394-19.394 c5.858-5.858,5.858-15.355,0-21.213c-5.857-5.858-15.355-5.858-21.213,0L4.396,149.393c-0.351,0.351-0.683,0.719-0.997,1.103 c-0.137,0.167-0.256,0.344-0.385,0.515c-0.165,0.22-0.335,0.435-0.488,0.664c-0.14,0.209-0.261,0.426-0.389,0.64 c-0.123,0.206-0.252,0.407-0.365,0.619c-0.118,0.22-0.217,0.446-0.323,0.67c-0.104,0.219-0.213,0.435-0.306,0.659 c-0.09,0.219-0.164,0.442-0.243,0.664c-0.087,0.24-0.179,0.477-0.253,0.722c-0.067,0.222-0.116,0.447-0.172,0.672 c-0.063,0.249-0.133,0.497-0.183,0.751c-0.051,0.259-0.082,0.521-0.119,0.782c-0.032,0.223-0.075,0.443-0.097,0.669 c-0.048,0.484-0.073,0.971-0.074,1.457c0,0.007-0.001,0.015-0.001,0.022c0,0.007,0.001,0.015,0.001,0.022 c0.001,0.487,0.026,0.973,0.074,1.458c0.022,0.223,0.064,0.44,0.095,0.661c0.038,0.264,0.069,0.528,0.121,0.79 c0.05,0.252,0.119,0.496,0.182,0.743c0.057,0.227,0.107,0.456,0.175,0.681c0.073,0.241,0.164,0.474,0.248,0.71 c0.081,0.226,0.155,0.453,0.247,0.675c0.091,0.22,0.198,0.431,0.3,0.646c0.108,0.229,0.21,0.46,0.33,0.685 c0.11,0.205,0.235,0.4,0.354,0.599c0.131,0.221,0.256,0.444,0.4,0.659c0.146,0.219,0.309,0.424,0.466,0.635 c0.136,0.181,0.262,0.368,0.407,0.544c0.299,0.364,0.616,0.713,0.947,1.048c0.016,0.016,0.029,0.034,0.045,0.05l45,45.001 c2.93,2.929,6.768,4.394,10.607,4.394c3.838-0.001,7.678-1.465,10.606-4.393c5.858-5.858,5.858-15.355,0.001-21.213L51.213,175.001 z"></path>
                            <path id="XMLID_8_" d="M305.002,25h-190c-8.284,0-15,6.716-15,15v60c0,8.284,6.716,15,15,15s15-6.716,15-15V55h160v210.001h-160 v-45.001c0-8.284-6.716-15-15-15s-15,6.716-15,15v60.001c0,8.284,6.716,15,15,15h190c8.284,0,15-6.716,15-15V40 C320.002,31.716,313.286,25,305.002,25z"></path>
                        </g>
                    </g>
                </SvgIcon>
            </a>}
            {localStorage.getItem('signedIn') === 'true' && !cartOpen && <svg className={'cart-btn'} onClick={handleOpenCart} fill="#000000"  width="50px" height="50px" viewBox="-90.29 -90.29 1083.44 1083.44" stroke="#000000" stroke-width="0.009028600000000001">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="5.41716"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <g>
                            <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"></path>
                            <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"></path>
                        </g>
                    </g>
                </g>
            </svg>}
            {localStorage.getItem('signedIn') === 'true' && cartOpen && (
                <CartOverlay cart={props.cart} cartTickets={props.cartTickets || []} setCart={props.setCart} setTickets={props.setTickets} onClose={handleCloseCart}>
                    <h2 style={{textAlign: 'center'}}>Your cart</h2>
                </CartOverlay>
            )}
        </div>
    <Box sx={{ width: '100%' }}>
        <Collapse in={open}>
            <Alert
                severity="info"
                action={
                    <>
                        <IconButton
                            aria-label="confirm"
                            color="inherit"
                            size="small"
                            onClick={handleConfirmLogout}
                        >
                            <CheckIcon fontSize="inherit" /> {/* Use the confirmation icon */}
                        </IconButton>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    </>

                }
                sx={{ mb: 2 }}
            >
                Are you sure?
            </Alert>
        </Collapse>

    </Box>
        </>
    );
}

export default NavigationBar;
