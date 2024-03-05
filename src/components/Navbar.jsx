import React, { useState } from "react";
import styled from "styled-components";
import Nav from "react-bootstrap/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

const StyledNavbar = styled.main`
    top: 0;
    position: fixed;
    width: 100vw;
    background-color: black;

    .triviaLogo {
        width: 40px;
        height: 40px;
    }
    .nav {
        display: flex;
        align-items: center;
    }
    .link {
        background-image: linear-gradient(45deg, #f3ec78, crimson);
        -webkit-background-clip: text;
        -moz-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-text-fill-color: transparent;
    }
    .link:hover {
        background-image: linear-gradient(45deg, gainsboro, #f3ec78);
        -webkit-background-clip: text;
        -moz-background-clip: text;
        -webkit-text-fill-color: transparent;
        -moz-text-fill-color: transparent;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 999;
    }

    .modal-content {
        position: absolute;
        width: 80%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        color: black;
        text-align: center;
        display: flex;
        z-index: 999;
    }
    .modal-content button {
        margin: 0 auto;
        width: 200px;
    }
    .modal.hidden {
    display: block;
    }
`;

function Navbar({ isHidden, toggleVisibility }) {
    return(
        <StyledNavbar>
            <Nav className="nav">
                <Nav.Item>
                    <Nav.Link>

                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link className="link" onClick={toggleVisibility}>
                        About Us
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="link" onClick={toggleVisibility}>
                    How to Use
                </Nav.Item>
            </Nav>
        </StyledNavbar>
    );
}

export default Navbar;