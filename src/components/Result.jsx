import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledResult = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        color: Black;
        margin-bottom: 5px;
    }

    table {
        border-collapse: collapse;
        width: 80%;
        margin-bottom: 20px;
    }

    th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f2f2f2;
    }
`;

function Result() {
    return(
        <StyledResult>
            <h1>Recipe Results</h1>
            <table>
                <thead>
                    <tr>
                        <th>Recipe</th>
                        <th>Prep Time</th>
                        <th>Cook Time</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Recipe Name</td>
                        <td>Prep Time</td>
                        <td>Cook Time</td>
                        <td>Description</td>
                    </tr>
                    
                </tbody>
            </table>
            <Link to="/">Go Back</Link>
        </StyledResult>
    );
}

export default Result;
