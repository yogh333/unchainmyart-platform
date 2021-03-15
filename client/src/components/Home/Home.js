import React,{ useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../../constants/apiConstants';
import axios from 'axios'
function Home(props) {

    const [user, setUser] = useState({});

    useEffect(() => {
        axios.get('http://localhost:4000/user/me', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) }})
        .then(function (response) {
            if(response.status !== 200){
              redirectToLogin()
            }
            console.log(response.data);
            setUser({
              firstname: response.data.firstname,
              lastname: response.data.lastname
            });
        })
        .catch(function (error) {
          redirectToLogin()
        });
      })
    function redirectToLogin() {
        props.history.push('/login');
    }
    return(
        <div className="mt-2">
            Welcome back {user?.firstname} {user?.lastname} !
        </div>
    )
}

export default withRouter(Home);