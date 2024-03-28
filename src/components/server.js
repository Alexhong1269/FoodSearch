const express = require("express");
const sql = require("sql");
const cors = require("corse");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    user: "acohorst1",
    password: "software2024!",
    server: "movietrivia.database.windows.net",
    database: "DataBase",
    pool:{
        max: 10, 
        min: 0, 
        idleTimeoutMillis: 3000,
    },
    options: {
        encrypt: true,
        trustServerCertification: false,
    },
};

//Register page
app.post("/register", async(req, res) => {
    const{ username, email, password, diet} = req.body
    
    try{
        await sql.connect(config);
        const insertQuery = `
            INSERT INTO Users (Username, Email, Password, Diet) 
            VALUES (@username, @email, @password, @diet, 0)
        `;
        request.input("username", sql.NVarChar, username);
        request.input("email", sql.NVarChar, email);
        request.input("password", sql.NVarChar, password);
        request.input("diet", sql.NVarChar, diet);
        
        const result = await request.query(insertQuery);

        console.log("Data inserted into MSSQL database successfully: ", result);

        res.sendStatus(200);
    }
    catch(error){
        console.log("Error registering: ", error);
        res.sendStatus(500);
    }
});