import React, {useRef, useState} from 'react';
import "../styles/signInSignUp.css"
import AuthRequests from "../Requests/AuthRequests";
import {Button, TextField} from "@mui/material";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

function SignIn(props) {
    const [inputs, setInputs] = useState({});
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [isVerificationInputEnabled,setIsVerificationInputEnabled] = useState(false)
    const [verificationCode, setVerificationCode] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const recaptchaRef = useRef(null);
    const [error, setError]= useState(false);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
       try{
           let body = {
               username: inputs.username,
               code: verificationCode
           }
           const response = await AuthRequests.sendVerificationCode(body)
           if (response.status === 200) {
               localStorage.setItem('expiredAt', response.data.expiredAt)
               localStorage.setItem('signedIn', true);
               window.location.href = '/'
           }
           setVerificationCode('');
           setIsVerificationInputEnabled(false)
       }
       catch(e){}
    };

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setVerificationCode(value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (failedAttempts >= 5) {
            if (!recaptchaValue) {
                alert("Please complete the CAPTCHA.");
                return;
            }
        }
        try {
            const response = await AuthRequests.login(inputs);
            if (response.status === 403) {
                setIsVerificationInputEnabled(true)
                const verificationResponse = await AuthRequests.getVerificationCode(inputs)
            }
            else if (response.status === 200){
                localStorage.setItem('expiredAt', response.data.expiredAt)
                localStorage.setItem('signedIn', true);
                window.location.href = '/'
            }
        }
        catch (e) {
            setError(true);
            if (failedAttempts >= 5)
                recaptchaRef.current.reset();
            setFailedAttempts(prevAttempts => prevAttempts + 1);
        }
    };

    return (
        <div className={'flex-container sign-in-container'}>
            <form onSubmit={handleSubmit}>
                <TextField
                    type={'text'}
                    required
                    label={'Username'}
                    value={inputs.username || ''}
                    name={'username'}
                    onChange={handleChange}
                    error={error}

                    style={{marginBottom: 10, width: '100%'}}/>

                    <TextField
                        type={'password'}
                        label={'Password'}
                        required
                        value={inputs.password || ''}
                        name={'password'}
                        onChange={handleChange}
                        style={{marginBottom: 10, width: '100%'}}
                        error={error}
                        helperText={error && "Invalid login credentials"}
                    />

                {failedAttempts >= 5 &&
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY}
                    onChange={(value) => setRecaptchaValue(value)}
                />}

                {!isVerificationInputEnabled && <Button
                    style={{ width: '100%'}}
                    variant="contained" color="primary" type="submit">Login</Button>}
                {isVerificationInputEnabled &&
                    <>
                        <TextField
                            type="text"
                            label="Verification code"
                            variant="outlined"
                            value={verificationCode}
                            onChange={handleCodeChange}
                            inputProps={{ maxLength: 6 }}
                        />
                        <Button type="submit" variant="contained" color="primary" onClick={handleCodeSubmit}>
                            Submit
                        </Button>
                    </>
                }
                <Link to="/restore-password" className="restore-password-link">
                    Restore password
                </Link>
            </form>

        </div>
    );
}

export default SignIn;
