import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

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
    const [state, setState] = useState({
        Vegan: false,
        Vegitarian: false,
        Kosher: false,
    });

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    const { Vegan, Vegitarian, Kosher } = state;
    const error = [Vegan, Vegitarian, Kosher].filter((v) => v).length !== 2;

    return (
        <StyledRegister>
            <div className="logo_container">
                <h1>Foogle</h1>
                <form>
                    <div>
                        <label htmlFor="email">Enter an Email:</label>
                        <br />
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div>
                        <label htmlFor="username">Enter a Username:</label>
                        <br />
                        <input type="text" id="username" name="username" required />
                    </div>
                    <div>
                        <label htmlFor="password">Enter a Password:</label>
                        <br />
                        <input type="password" id="password" name="password" required />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <br />
                        <input type="password" id="confirmPassword" name="confirmPassword" required />
                    </div>
                    <Box sx={{ display: 'flex' }}>
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Dietary Restrictions</FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={Vegan} onChange={handleChange} name="Vegan" />
                                    }
                                    label="Vegan"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={Vegitarian} onChange={handleChange} name="Vegitarian" />
                                    }
                                    label="Vegitarian"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={Kosher} onChange={handleChange} name="Kosher" />
                                    }
                                    label="Kosher"
                                />
                            </FormGroup>
                            <FormHelperText>Select your Diet!</FormHelperText>
                        </FormControl>
                    </Box>
                    <div className="button_container">
                        <Link to="/">
                            <button>
                                Create Account
                            </button>
                        </Link>
                    </div>
                    <p className="MemberText"><Link to="/login">Already a Member?</Link></p>
                </form>
            </div>
        </StyledRegister>
    );
}

export default Register;
