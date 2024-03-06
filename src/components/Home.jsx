import React, { useState } from "react";
import styled from "styled-components";
import Popup from "reactjs-popup";
import bgImg from "../images/bg_image.jpeg";

const StyledHome = styled.main`

    box-sizing: border-box;
    background: url(${bgImg});
    background-attachment: fixed;
    height: 100vh;
    width: 100vw;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    h1 {
        color: white;
        margin-bottom: 20px;
    }
`;

const StyledSearch = styled.div`
    .searchExample{
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
    }
`;

const Search = () => {
    const [searchInput, setSearchInput] = useState("");

    // Example data
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
                <h1>Foogle</h1>
                <input
                    type="text"
                    placeholder="Search here"
                    onChange={handleChange}
                    value={searchInput}
                />
                <br />
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
                            <th>Country </th>
                            <th>Continent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCountries.map((country, index) => (
                            <tr key={index}>
                                <td>{country.name}</td>
                                <td>{country.continent}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </StyledSearch>
    );
};

function Home({ isHidden }) {
    return (
        <StyledHome isHidden={isHidden}>
            <Search />
        </StyledHome>
    );
}

export default Home;
