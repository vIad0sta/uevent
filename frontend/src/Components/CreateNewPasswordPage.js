import React, { useEffect, useState } from 'react';
import '../styles/createNewPasswordPage.css';
import UserRequests from "../Requests/UserRequests";
import { TextField } from "@mui/material";
import AuthRequests from "../Requests/AuthRequests"; // Import CSS file

function CreateNewPasswordPage(props) {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({
        passwordError: false,
        confirmPasswordError: false
    });
    const [email, setEmail] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInputs(values => ({ ...values, [name]: value }));

        validateInput(name, value);
    }

    const validateInput = (name, value) => {
        const regexPatterns = {
            password: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
            confirmPassword: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
        };

        const isValid = regexPatterns[name].test(value);

        setErrors(prevErrors => ({ ...prevErrors, [`${name}Error`]: !isValid }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            setIsSubmitting(true);
            const response = await UserRequests.updateUserPassword({ password: inputs.password, email: email });
            if (response.status === 200)
                window.location.href = '/sign-in';
            setIsSubmitting(false); // Reset submitting state
        }
        catch(e){}

    };

    const isFormValid = !errors.passwordError && !errors.confirmPasswordError && inputs.password && inputs.confirmPassword;

    return (
        <div className={'flex-container sign-up-container'}>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField
                        required
                        type="password"
                        name={'password'}
                        label={'Password'}
                        value={inputs.password || ''}
                        onChange={handleChange}
                        error={errors.passwordError}
                        helperText={errors.passwordError && "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"}
                        style={{ marginBottom: 10, width: 240, maxWidth: 240 }}
                    />
                </div>
                <div>
                    <TextField
                        required
                        type="password"
                        name={'confirmPassword'}
                        label={'Confirm password'}
                        value={inputs.confirmPassword || ''}
                        onChange={handleChange}
                        error={errors.confirmPasswordError}
                        helperText={errors.confirmPasswordError && "Passwords do not match"}
                        style={{ marginBottom: 10, width: 240, maxWidth: 240 }}
                    />
                </div>
                <button type="submit" disabled={!isFormValid || isSubmitting}>Change password</button>
            </form>
        </div>
    );
}

export default CreateNewPasswordPage;
