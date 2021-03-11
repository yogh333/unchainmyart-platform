import React, { useState, useEffect } from 'react';
import { getEthrDid } from '../../services/getEthrDid';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import axios from 'axios'

function DecentralizedID(props){
    
    const [did, setDid] = useState({});

    useEffect(() => {
        axios.get('http://localhost:4000/user/me', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
        .then(function (response) {
            if(response.status !== 200){
              redirectToLogin()
            }
        })
        .catch(function (error) {
          redirectToLogin()
        });
    })

    function redirectToLogin() {
        props.history.push('/login');
    }

    async function getDid() {
        const data = await getEthrDid();
        setDid(data);
    }

    useEffect(() => {getDid()}, []);
    
    return (
        <div className="mt-2">
            <div>Your DiD is {did.did}</div>
        </div>
    )
}

export default withRouter(DecentralizedID);
