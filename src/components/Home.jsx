import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import bgImg from "../images/bg_image.jpeg";

const StyledHome = styled.main`
    body {
        margin: 0;
        padding: 0;
    }

    box-sizing: border-box;
    background: url(${bgImg});
    background-attachment: fixed;
    height: 100vh;
    width: 100vw;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden; /* Hide overflow content */

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .button_container {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .signup,
    .login {
        padding: 10px;
        color: white;
        margin: 5px;
        background-color: black;
        width: 300px;
        text-align: center;
        border-radius: 5px;
    }

    .signup:hover {
        background-color: white;
        color: black;
        transition: all 0.5s ease;
    }
    
    .login:hover {
        background-color: white;
        color: black;
        transition: all 0.5s ease;
    }
    
    h1 {
        color: white;
        margin-bottom: 20px;
    }
`;

function Home({ isHidden }) {
    return(
        <StyledHome isHidden={isHidden}>
            <h1>Food Search</h1>
            <div className="button_container">
                <Link to ="/register" className="signup">
                    Sign up
                </Link>
                <Link to ="/login" className="login">
                    Already a user?
                </Link>
            </div>
        </StyledHome>
    )
}

export default Home;