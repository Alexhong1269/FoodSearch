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

//LOGIN
app.post("/login", async (req, res) => {
    try{
        await sql.connect(config);

        const request = new sql.Request();

        const sqlQurey = `SELECT * FROM Users WHERE Username = @username AND password = @password`;

        request.input("username", sql.NVarChar, req.body.username);
        request.input("password", sql.NVarChar, req.body.password);

        const result = await request.query(sqlQurey);

        if(result.recordset.length > 0){
            res.json({ status: "success", data: result.recondset[0]});
        }
        else{
            res.json({ status: "failure", message: "Invalid Username or Password"});
        }
    }
    catch(error){
        console.error("Error during login:", error);
        res.sendStatus(500);
        res.status(500).send("Login failed due to an internal error");
    }
});