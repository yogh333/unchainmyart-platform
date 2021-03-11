import React, { useState, useReducer } from "react";
import './RegistrationForm.css';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import {ACCESS_TOKEN_NAME} from '../../constants/apiConstants';

function formReducer(state, event) {
    if (event.reset === true){
        return {
            firstname: '',
            lastname: '',
            birthdate: '',
            email: '',
            password: ''
        }
    }
    return {
        ...state, 
        [event.name]:event.value
    };
}
function RegistrationForm(props) {

    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useReducer(formReducer, {});
    
    const handleSubmit = event => {
        event.preventDefault();
        setSubmitting(true);

        const payload = {
            "firstname":formData.firstname,
            "lastname":formData.lastname,
            "birthdate":formData.birthdate+'T12:00:00',
            "email":formData.email,
            "password":formData.password,
        }
        axios.post('http://localhost:4000/user/signup', payload)
            .then(function (response) {
                if(response.status === 200){
                    setSubmitting(false);
                    setFormData({
                        reset: true
                    })
                    localStorage.setItem(ACCESS_TOKEN_NAME,response.data.token);
                    redirectToHome();
                    props.showError(null)
                } else{
                    props.showError("Some error ocurred");
                }
            })
            .catch(function (error) {
                console.log(error);
            }); 
    }

    const handleChange = event => {
        setFormData({
            name:event.target.name,
            value: event.target.value
        })
    }

    const redirectToLogin = () => {
        props.updateTitle('Login')
        props.history.push('/login'); 
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
                        <p>First Name</p>
                        <input name="firstname" onChange={handleChange} value={formData['firstname'] || ''}/>
                    </label>
                </div>
                <div className="form-group text-left">
                    <label>
                        <p>Last Name</p>
                        <input name="lastname" onChange={handleChange} value={formData['lastname'] || ''}/>
                    </label>
                </div>
                <div className="form-group text-left">
                    <label>
                        <p>Date of birth</p>
                        <input type="date" name="birthdate" onChange={handleChange} value={formData['birthdate'] || ''}/>
                    </label>
                </div>
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
                <button type="submit" disabled={submitting}>Register</button>
            </form>
            <div className="mt-2">
                <span>Already have an account? </span>
                <span className="loginText" onClick={() => redirectToLogin()}>Login here</span> 
            </div>
        </div>
    );  
}

export default withRouter(RegistrationForm);