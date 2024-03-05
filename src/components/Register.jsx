import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledRegister = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        color: white;
        margin-bottom: 20px;
    }

    .button_container {
        margin-top: 30px;
        display: flex;
        flex-direction: column;
    }

    .MemberText {
        text-align: center;
        margin-top: 40px;
    }
`;

function Register() {
    return(
        <StyledRegister>
            <div className="logo_container">
                <h1>Food Search</h1>
                <form>
                    <div>
                        <label htmlFor = "username" id = "UserText">Enter a Username:</label>
                        <br></br>
                        <input type = "text" id = "username" name = "username" required />
                    </div>
                    <div>
                        <label htmlFor = "password" id = "PasswordText">Enter a Password:</label>
                        <br></br>
                        <input type = "text" id = "password" name = "password" required />
                    </div>
                    <div className = "button_container">
                        <button>Create Account</button>
                    </div>
                    <p className = "MemberText"><Link to = "/login">Aleardy a Member?</Link></p>
                </form>
            </div>
        </StyledRegister>
    );
}

export default Register;