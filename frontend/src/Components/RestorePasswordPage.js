import React, {useState} from 'react';
import '../styles/restorePasswordPage.css';
import UserRequests from "../Requests/UserRequests";

function RestorePasswordPage(props) {
    const [email, setEmail] = useState('');

    const handleChange = (e) => {
        setEmail(e.target. value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await UserRequests.sendRestoringPasswordEmail(email)
        }
        catch(e){}
    };

    return (
        <div className={'container-restore'} style={{display:'flex',height: '100vh', justifyContent:'center',alignItems:'center'}}>
        <div className="restore-password-form-container">
            <h2>Restore Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={handleChange} />
                </div>
                <button className={'restore-password-button'} type="submit">Submit</button>
            </form>
        </div>
        </div>
    );
}

export default RestorePasswordPage;