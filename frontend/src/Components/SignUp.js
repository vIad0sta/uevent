import React, { useState } from 'react';
import "../styles/signInSignUp.css"
import AuthRequests from "../Requests/AuthRequests";
import {Button, TextField} from "@mui/material";

function SignUp(props) {
    const [inputs, setInputs] = useState({ role: 'user' });
    const [errors, setErrors] = useState({
        firstNameError: false,
        lastNameError: false,
        usernameError: false,
        emailError: false,
        passwordError: false
    });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));

        // Validate input based on its name
        validateInput(name, value);
    }

    const validateInput = (name, value) => {
        // Define regex patterns for validation
        const regexPatterns = {
            firstName: /^[a-zA-Z-' ]{1,50}$/,
            lastName: /^[a-zA-Z-' ]{1,50}$/,
            username: /^[a-zA-Z0-9_]{3,16}$/,
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            password: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
        };

        // Check if the input value matches the regex pattern
        const isValid = regexPatterns[name].test(value);

        // Update error state based on the validation result
        setErrors(prevErrors => ({ ...prevErrors, [`${name}Error`]: !isValid }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       try{
           const response = await AuthRequests.registration(inputs);
           window.location.href = '/sign-in';
       }
       catch(e){}
    };

    return (
        <div className={'sign-up-container'} >
            <form onSubmit={handleSubmit}>
                    <TextField
                        type="text"
                        name={'firstName'}
                        label={'Firstname'}
                        required
                        value={inputs.firstName || ''}
                        onChange={handleChange}
                        error={errors.firstNameError}
                        helperText={errors.firstNameError && "Please use only letters and spaces (1-50 characters)"}
                        style={{ marginTop: 10,marginBottom: 10, width: '80%'}}                    />
                    <TextField
                        type="text"
                        name="lastName"
                        label={'Lastname'}
                        required
                        value={inputs.lastName || ''}
                        onChange={handleChange}
                        error={errors.lastNameError}
                        helperText={errors.lastNameError && "Please use only letters and spaces (1-50 characters)"}
                        style={{ marginBottom: 10, width: '80%'}}                    />

                    <TextField
                        type="text"
                        name={'username'}
                        label={'Username'}
                        required
                        value={inputs.username || ''}
                        onChange={handleChange}
                        error={errors.usernameError}
                        helperText={errors.usernameError && "Please use only letters, numbers, and underscores (3-16 characters)"}
                        style={{marginBottom: 10, width: '80%'}}                    />

                    <TextField
                        type="email"
                        name={'email'}
                        label={'Email'}
                        required
                        value={inputs.email || ''}
                        onChange={handleChange}
                        error={errors.emailError}
                        helperText={errors.emailError && "Please enter a valid email address"}
                        style={{ marginBottom: 10, width: '80%'}}                    />

                    <TextField
                        type="password"
                        name={'password'}
                        label={'Password'}
                        required
                        value={inputs.password || ''}
                        onChange={handleChange}
                        error={errors.passwordError}
                        helperText={errors.passwordError && "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"}
                        style={{ marginBottom: 10, width: '80%'}}
                    />
                <Button style={{ width: '80%'}} type="submit" variant="contained" color="primary">Register</Button>
            </form>
        </div>
    );
}

export default SignUp;
