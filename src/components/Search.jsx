import React, { useState } from "react";
import styled from "styled-components";
import Popup from "reactjs-popup";

const StyledSearch = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        color: black;
        margin-bottom: 5px;
    }

    form {
        margin-bottom: 200px; 
    }

    label {
        margin-bottom: 10px; 
        color: black;
    }

    input {
        margin-bottom: 5px;
        padding: 5px;
        border-radius: 5px;
        border: none;
    }

    button {
        padding: 10px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
    }
    
    .popup-content {
        
    }

    thead {
        padding: 10px;
    }
`;

const Search = () => {
    const [searchInput, setSearchInput] = useState("");

    //Example stuff
    const countries = [
        { name: "Belgium", continent: "Europe" },
        { name: "India", continent: "Asia" },
    ];

    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    let filteredCountries = countries.filter((country) => {
        return country.name.toLowerCase().includes(searchInput.toLowerCase());
    });

    return (
        <StyledSearch>
            <div className="logo_container">
                <h1>Food Search</h1>
                <input
                    type="text"
                    placeholder="Search here"
                    onChange={handleChange}
                    value={searchInput}
                />
                <br></br>
                <Popup trigger={<button>Search</button>} modal nested>
                    {close => (
                        <div className="modal">
                            <div className="popup-content">
                                INGREDIENTS:
                            </div>
                            <div>
                                <button onClick={() => close()}>Exit</button>
                            </div>
                        </div>
                    )}
                </Popup>
                <table className="searchExample">
                    <thead>
                        <tr>
                            <th>Country</th>
                            <th>Continent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCountries.map((country, index) => {
                            return (
                                <tr key={index}>
                                    <td>{country.name}</td>
                                    <td>{country.continent}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </StyledSearch>
    );
};

export default Search;

