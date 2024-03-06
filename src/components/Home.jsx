import React, { useState } from "react";
import styled from "styled-components";
import Popup from "reactjs-popup";
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import 'reactjs-popup/dist/index.css';
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

    .popup-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
`;

const StyledSearch = styled.div`
    .searchExample {
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
    const [Vegan, setVegan] = useState(false);
    const [Vegitarian, setVegitarian] = useState(false);
    const [Kosher, setKosher] = useState(false);

    // Example data
    const countries = [
        { name: "Belgium", continent: "Europe" },
        { name: "India", continent: "Asia" },
    ];

    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

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
                                <button onClick={close}>Exit</button>
                            </div>
                        </div>
                    )}
                </Popup>
                <Popup trigger={<button>Advance Filter</button>} modal nested>
                    {close => (
                        <div className="modal">
                            <div className="popup-content">
                                Dietary Restrictions:
                                <Box sx={{ display: 'flex' }}>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Dietary Restrictions</FormLabel>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Checkbox checked={Vegan} onChange={() => setVegan(!Vegan)} name="Vegan" />}
                                                label="Vegan"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={Vegitarian} onChange={() => setVegitarian(!Vegitarian)} name="Vegitarian" />}
                                                label="Vegetarian"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={Kosher} onChange={() => setKosher(!Kosher)} name="Kosher" />}
                                                label="Kosher"
                                            />
                                        </FormGroup>
                                        <FormHelperText>Select your Diet!</FormHelperText>
                                    </FormControl>
                                </Box>
                            </div>
                            <div>
                                <button onClick={close}>Apply</button>
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
                        {countries.map((country, index) => (
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
