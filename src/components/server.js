const express = require("express");
const sql = require("sql");
const cors = require("corse");

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    user: "acohorst1",
    password: "",
    server: "",
    database: "",
    pool:{
        max: 
        min: 
        idleTimeoutMillis: 3000,
    },
    options: {
        encrypt: true,
        trustServerCertification: false,
    },
};

//Register page
app.post("/register", async(req, res) => {
    const userRef = userRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [ValidUserName, setValidUserName] = useState("false");

});