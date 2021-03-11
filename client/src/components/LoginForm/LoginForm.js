import React, { useState, useReducer } from "react";
import './LoginForm.css';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import {ACCESS_TOKEN_NAME} from '../../constants/apiConstants';

function formReducer(state, event) {
    if (event.reset === true){
        return {
            email: '',
            password: ''
        }
    }
    return {
        ...state, 
        [event.name]:event.value
    };
}
function LoginForm(props) {

    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    
    const handleSubmit = event => {
        event.preventDefault();
        //setSubmitting(true);

        const payload = {
            "email":formData.email,
            "password":formData.password,
        }
        console.log(payload);
        axios.post('http://localhost:4000/user/login', payload)
            .then(function (response) {
                if(response.status === 200){
                    localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                    redirectToHome();
                    props.showError(null)
                } 
                else {
                    props.showError("Username and password do not match");
                }
            })
            .catch(function (error) {
                props.showError("Username and password do not match");
                console.log(error);
            });
        //setSubmitting(false);
        setFormData({
            reset: true
        }) 
    }

    const handleChange = event => {
        setFormData({
            name:event.target.name,
            value: event.target.value
        })
    }

    const redirectToRegister = () => {
        props.updateTitle('Register')
        props.history.push('/register'); 
    }

    const redirectToHome = () => {
        props.updateTitle('Home')
        props.history.push('/home');
    }

    return (
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <h1>User Information</h1>
            <form onSubmit={handleSubmit}>
                <fieldset disabled={submitting}>
                <div className="form-group text-left">
                    <label>
                        <p>E-mail</p>
                        <input name="email" onChange={handleChange} value={formData['email'] || ''} />
                    </label>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group text-left">
                    <label>
                        <p>Password</p>
                        <input name="password" onChange={handleChange} value={formData['password'] || ''} />
                    </label>
                </div>
                </fieldset>
                <button type="submit" disabled={submitting}>Login</button>
            </form>
            <div className="mt-2">
                <span>Don't have an account? </span>
                <span className="loginText" onClick={() => redirectToRegister()}>Register Here</span> 
            </div>
        </div>
    );  
}

export default withRouter(LoginForm);