import React, { useState, useRef, useEffect, useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "../api/axios";


const StyledLogin = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        color: Black;
        margin-bottom: 5px;
    }

    form {
        margin-bottom: 200px; 
    }

    label {
        margin-bottom: 10px; 
        color: Black;
    }

    input {
        margin-bottom: 20px;
        padding: 5px;
        border-radius: 5px;
        border: none;
    }

    .button_container {
        margin-bottom: 30px;
        display: flex;
        flex-direction: column;
    }   

`;

const LOGIN_URL = "/login";

function Login({isHidden}) {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post(
                LOGIN_URL,
                JSON.stringify({username: user, password: pwd}),
                {
                    headers: {"Content-Type": "application/json"},
                }
            );
            console.log(JSON.stringify(response.data));
            setUser(response.data.data.Username);
            setPwd(response.data.data.Pass);

            if(resposne.data.status === "failure"){
                setErrMsg("Invalid Username or Password");
            }
            else{
                setSuccess(true);
            }
        }
        catch(err){
            if(!err?.response){
                setErrMsg("Invalid Username or Password");
            }
            else if(err.response?.status === 400){
                setErrMsg("Missing Username or Password");
            }
            else if(err.response?.status === 401){
                setErrMsg("Unauthorized");
            }
            else{
                setErrMsg("Login Failed");
            }
            errRef.current.focus();
        }
    };

    return(
        <>
        {success ? (
            <StyledLogin isHidden={isHidden}>
                <div className="login-success">
                    <h1>
                        Welcom <span className="username_display">{user}</span>
                    </h1>
                    <Link to="/home" className="login-success-member member">
                        Start Search
                    </Link>
                </div>
            </StyledLogin>
        ) : (
            <StyledLogin>
            <div className = "logo_container">
                <h1>Food Search</h1>
                <form>
                    <div>
                        <label htmlFor = "username" id = "UserText">Username:
                            <input
                                required
                                type = "text"
                                id = "username"
                                name = "username"
                                ref = {userRef}
                                autoComplete = "off"
                                placeholder = "Please enter username"
                                onChange = {(e) => setUser(e.target.value)}
                                value = {user}
                            />
                        </label>
                        <br></br>
                    </div>
                    <div>
                        <label htmlFor = "password" id = "PasswordText">Password:
                            <input
                                required
                                type = "password"
                                id = "password"
                                name = "password"
                                placeholder = "Please enter password"
                                onChange = {(e) => setPwd(e.target.value)}
                                value = {pwd}                                
                            />
                        </label>
                        <br></br>
                    </div>
                    <div className="button_container">
                        <button type="submit">Sign In</button>
                        <Link to="/register" className="member">
                            No Account?
                        </Link>
                    </div>
                </form>
            </div>
        </StyledLogin>
        )}
        </ >
    );
}

export default Login;