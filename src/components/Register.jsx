import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from "../api/axios";

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

//must start with a lower or an uppercase letter and it must be folloed by anywhere from 3 to 23 characters
const USER_REGEX = /^[a-zA-Z][a-zA-z0-9-_]{3,23}$/;

//password requres at least one lowercase, one uppercase letter, one digit, and one special character range 8-24
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/register";

function Register({isHidden}) {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [validUserName, setValidUserName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user)
        setValidUserName(result);
    }, [user]);

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user)
        setValidUserName(result);
    }, [user]);

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd)
        setValidPwd(result);
        const match = pwd === match.pwd;
        setValidMatch(match);
    }, [pwd, matchPwd]);

    useEffect(() => {
        const result = (email);
        console.log(result);
        console.log(email)
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        setErrMsg("");
    }, [user, email, pwd, matchPwd]);

    const [state, setState] = useState({
        Vegan: false,
        Vegitarian: false,
        Kosher: false,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });

        const selectedDietaryRestrictions = { ...state, [event.target.name]: event.target.checked };
        axios.post(REGISTER_URL, { dietaryRestrictions: selectedDietaryRestrictions })
            .then(response => {
                console.log(response.data); // Log the response from the server
            })
            .catch(error => {
                console.error('Error sending dietary restrictions to the server:', error);
            });
    };

    const { Vegan, Vegitarian, Kosher } = state;
    const error = [Vegan, Vegitarian, Kosher].filter((v) => v).length !== 2;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if(!v1 || !v2){
            setErrMsg("Invalid Entry");
            return;
        }
        try{
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({username:user, password: pwd, email: email, dietaryRestrictions: diet,}),
                {
                    headers: {"Content-type": "application/json"},
                }
            );
            console.log(response.data);
            console.log(response.accessToken);
            console.log(JSON.stringify(response));
            setSuccess(true);
        }
        catch(err){
            if(!err?.response){
                setErrMsg("No server Response");
            }
            else if(err.response?.status == 409){
                setErrMsg("Username Taken");
            }
            else{
                setErrMsg("Registration Failed");
            }
            errRef.current.focus();
        }
    };

    return (
        <StyledRegister>
            <div className="logo_container">
                <h1>Foogle</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Enter an Username:
                            <input
                                required
                                type = "text"
                                ref = {userRef}
                                value = {user}
                                onChange = {(e) => setUser(e.target.value)}
                                onFocus = {() => setUserFocus(true)}
                                onBlur = {() => setUserFocus(false)}
                            />
                        </label>
                        {userFocus && !validUserName && <span>Invalid Username</span>}
                        <br />
                    </div>
                    <div>
                        <label htmlFor="username">Enter an Email:
                            <input
                                required
                                type = "email"
                                value ={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus = {() => setEmailFocus(true)}
                                onBlur = {() => setEmailFocus(false)}
                            />
                        </label>
                        <br />
                    </div>
                    <div>
                        <label htmlFor="password">Enter a Password:
                            <input
                                required
                                type = "password"
                                value = {pwd}
                                onChange = {(e) => setPwd(e.target.value)}
                                onFocus = {() => setPwdFocus(true)}
                                onBlur = {() => setPwdFocus(false)}
                            />
                        </label>
                        <br />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password:
                            <input
                                required
                                type = "password"
                                value = {matchPwd}
                                onChange={(e) => setMatchPwd(e.target.value)}
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                            />
                        </label>
                        <br />
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
