import React from 'react';
import { Container, Typography, Alert } from '@mui/material';

const ErrorPage = ({ status }) => {
    const queryParams = new URLSearchParams(window.location.search);
    const error = queryParams.get('error');
    return (
        <Container maxWidth="sm">
            <Alert severity="error">
                {error}
            </Alert>
        </Container>
    );
};

export default ErrorPage;