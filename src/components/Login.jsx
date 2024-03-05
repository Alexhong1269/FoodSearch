import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

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

function Login() {
    return(
        <StyledLogin>
            <div className = "logo_container">
                <h1>Food Search</h1>
                <form>
                    <div>
                        <label htmlFor = "username" id = "UserText">Username:</label>
                        <br></br>
                        <input type = "text" id = "username" name = "username" required />
                    </div>
                    <div>
                        <label htmlFor = "password" id = "PasswordText">Password:</label>
                        <br></br>
                        <input type = "password" id = "password" name = "password" required />
                    </div>
                    <div className="button_container">
                        <Link to="/search">
                            <button>Login</button>
                        </Link>
                    </div>
                </form>
            </div>
        </StyledLogin>
    );
}

export default Login;