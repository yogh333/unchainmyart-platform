import React, { useState, useEffect, useReducer } from 'react';
import { getEthrDid } from '../../services/getEthrDid';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import axios from 'axios'

function userReducer(state, event) {
    console.log(event);
    return {
        ...state, 
        [event.name]:event.value
    };
}
function DecentralizedID(props){
    
    //const [did, setDid] = useState({});
    const [user, setUser] = useReducer(userReducer, {});   

    useEffect(() => {
        let mounted = true;
        axios.get('http://localhost:4000/user/me', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
        .then(function (response) {
            if(response.status !== 200){
              redirectToLogin()
            }
            if (mounted){
                setUser({
                    name: 'name',
                    value: response.data.firstname + ' ' + response.data.lastname 
                });
            }
        })
        .catch(function (error) {
          redirectToLogin()
        });
        return () => {
            mounted = false;
        }
    }, []);

    function redirectToLogin() {
        props.history.push('/login');
    }

    useEffect(() => {
        let mounted = true;
        getEthrDid().then(data => {
            if (mounted){
                setUser({
                    name: 'did',
                    value: data.did
                });
            }
        });
        return () => {
            mounted = false;
        }
    }, []);
    
    return (
        <div className="mt-2">
            <div>Welcome back {user.name} ! </div>
            <div>Your DiD is {user.did}</div>
        </div>
    )
}

export default withRouter(DecentralizedID);
