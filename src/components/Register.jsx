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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faTimes,
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

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

//Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        const match = pwd === matchPwd;
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
        <>
        {success ? (
            <styledRegister isHidden={isHidden}>
                <div className="register-success">
                    <h1>Successfully registered!</h1>
                    <Link to="/login" className="register-sucess-member member">
                        Login in
                    </Link>
                </div>
            </styledRegister>
        ) : (
            <StyledRegister>
            <div className="logo_container">
                <h1>Foogle</h1>
                <p
                    ref = {errRef}
                    className = {errMsg ? "errmsg" : "offscreen"}
                    aria-live = "assertive"
                >
                    {errMsg}
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="username_input">
                        <label htmlFor="username">Enter an Username:
                            <span className = {validUserName ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validUserName || !user ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <br></br>
                        <input
                            required
                            id="username"
                            autoComplete="off"
                            placeholder="Please enter username"
                            type = "text"
                            ref = {userRef}
                            value = {user}
                            aria-invalid={validUserName ? "fasle" : "true"}
                            aria-describedby="uidnote"
                            onChange = {(e) => setUser(e.target.value)}
                            onFocus = {() => setUserFocus(true)}
                            onBlur = {() => setUserFocus(false)}
                        />
                        <p
                            id="uidnote"
                            className={
                                userFocus && user && !validUserName
                                    ? "instructions"
                                    : "offscreen"
                            }
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className="infoCircle" />
                            4 to 24 characters.
                            <br />
                            Must begin with a letter. <br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
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
                    <div className="password_input">
                        <label htmlFor="password">Enter a Password:
                            <span className={validPwd ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <br></br>
                            <input
                                required
                                type = "password"
                                id="password"
                                placeholder="Please enter password"
                                value = {pwd}
                                onChange = {(e) => setPwd(e.target.value)}
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus = {() => setPwdFocus(true)}
                                onBlur = {() => setPwdFocus(false)}
                            />
                            <p
                                id="pwdnote"
                                className={
                                    pwdFocus && !validPwd ? "instructions" : "offscreen"
                                }
                            >
                                <FontAwesomeIcon icon={faInfoCircle} className="infoCircle" />
                                8 to 24 characters.
                                <br />
                                Must include uppercase and lowercase letters, a number and a special character. <br />
                                Allowed spechial characters: {" "}
                                <span aria-label="exclamation-mark">!</span>
                                <span aria-label="at symbol">@</span>
                                <span aria-label="dollar sign">$</span>
                                <span aria-label="percent">%</span>
                            </p>
                    </div>
                    <div className="confirm_password_input">
                        <label htmlFor="confirmPassword">Confirm Password:
                            <span className={validMatch && matchPwd ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span
                                className={validMatch || !matchPwd ? "hide" : "invalid"}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <br></br>
                        <input
                            required
                            type = "password"
                            id="confirm_pwd"
                            placeholder="Please enter password again"
                            value = {matchPwd}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p
                            id="confirmnote"
                            className={
                                matchFocus && !validMatch ? "instructions" : "offscreen"
                            }
                        >
                            <FontAwesomeIcon icon={faInfoCircle} className="infoCircle" />
                            Must match the first password input field
                        </p>
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
                        <button
                            type="submit"
                            disabled={
                                !validUserName || !validPwd || !validMatch ? true : false
                            }
                        >
                            Create Account
                        </button>
                    </div>
                    <p className="MemberText"><Link to="/login">Already a Member?</Link></p>
                </form>
            </div>
        </StyledRegister>
        )}
        </>
    );
}

export default Register;
