import express, { request } from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: "acohorst1",
  password: "software2024!",
  server: "movietrivia.database.windows.net",
  database: "DataBase",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 3000,
  },
  options: {
    encrypt: true,
    trustServerCertification: false,
  },
};

// Register page
app.post("/register", async (req, res) => {
  const { username, email, password, diet } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    const insertQuery = `
      INSERT INTO Users (Username, Email, Password, Diet) 
      VALUES (@username, @email, @password, @diet)
    `;
    request.input("username", sql.NVarChar, username);
    request.input("email", sql.NVarChar, email);
    request.input("password", sql.NVarChar, password);
    request.input("diet", sql.NVarChar, diet);

    const result = await request.query(insertQuery);

    console.log("Data inserted into MSSQL database successfully: ", result);

    res.sendStatus(200);
  } catch (error) {
    console.log("Error registering: ", error);
    res.sendStatus(500);
  }
});

// Login Page
app.post("/login", async (req, res) => {
  try {
    await sql.connect(config);

    const request = new sql.Request();

    const sqlQuery = `SELECT * FROM Users WHERE Username = @username AND Password = @password`;

    request.input("username", sql.NVarChar, req.body.username);
    request.input("password", sql.NVarChar, req.body.password);

    const result = await request.query(sqlQuery);

    if (result.recordset.length > 0) {
      res.json({ status: "success", data: result.recordset[0] });
    } else {
      res.json({ status: "failure", message: "Invalid Username or Password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ status: "failure", message: "Login failed due to an internal error" });
  }
});

//Search Page
app.get("/search", async(req, res) => {
  const { query, vegan, vegetarian, kosher } = res.query;

  try{
    await sql.connect(config);
    const request = new sql.Request();

    let searchQuery = `
      SELECT * 
      FROM Recipes
      WHERE GeneralName LIKE '%${query}$%'
    `;

    //adding dietary restrictions if provided
    if(vegan === 'true'){
      searchQuery += ` AND Vegan = 1`;
    }
    if(vegetarian === 'true'){
      searchQuery += `AND Vegetarian = 1`;
    }
    if(kosher === 'true'){
      searchQuery += `AND Kosher = 1`;
    }

    const result = await request.query(searchQuery);

    res.json(result.recordset);
  }
  catch(error){
    console.log("Error during search:", error);
    res.status(500).json({status: "failure", message: "search failed due to internal error"});
  }

});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
