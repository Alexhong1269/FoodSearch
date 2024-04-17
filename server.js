require('dotenv').config(); // npm install dotenv (for loading environment variables, i.e. database credentials)
const bcrypt = require('bcrypt'); // npm install bcrypt (for hashing and comparing passwords)
const express = require('express'); // npm install express (a minimal web framework)
const session = require('express-session'); // npm install express-session (for session management)
const sql = require('mssql'); // npm install mssql (for connecting to database)
const multer = require('multer'); // npm install multer (for handling multi-part form data)

const app = express();
const port = 8080;
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // npm install ejs (for generating HTML with JavaScript)

// Database configuration
const config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	server: process.env.DB_SERVER,
	database: process.env.DB_DATABASE,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 3000
	},
	options: {
		encrypt: true,
		trustServerCertificate: false
	}
};

// Handle login sessions
app.use(session({
	secret: 'super_secret_key',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: 'auto' }
}));

// Pass session to all views
app.use((req, res, next) => {
	res.locals.session = req.session;
	next();
});

// Show the home page
app.get('/', (req, res) => {
	res.render('index');
});

// Show the registration page
app.get('/register', (req, res) => {
	res.sendFile(__dirname + '/public/register.html');
});

// Register an account
app.post('/register', async (req, res) => {
	try {
		// Connect to database
		let pool = await sql.connect(config);
		
		// Get parameters
		const { username, email, password } = req.body;
		
		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);
		
		// Check if the user exists
		const checkUser = await pool.request()
			.input('username', sql.VarChar, username)
			.input('email', sql.VarChar, email)
			.query('SELECT * FROM Users WHERE Username = @username OR Email = @email');
		
		// Add the user to the database.
		if (checkUser.recordset.length > 0) {
			res.send(`
				<script>
					alert('Username or email already exists. Please choose a different username or email.');
					window.location.href='/register';
				</script>
			`);
		} else {
			await pool.request()
				.input('username', sql.VarChar, username)
				.input('email', sql.VarChar, email)
				.input('password', sql.VarChar, hashedPassword)
				.query('INSERT INTO Users VALUES (NEXT VALUE FOR UserSeq, @username, @email, @password)');
			
			res.send(`
				<script>
					alert('Registration successful.');
					window.location.href='/login';
				</script>
			`);
		}
	} catch (err) {
		console.error('Error registering user:', err);
		res.status(500).send('An error occurred while querying the database.');
	}
});

// Show the login page
app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/public/login.html');
});

// Log in
app.post('/login', async (req, res) => {
	try {
		// Connect to the database
		let pool = await sql.connect(config);
		
		// Get parameters
		const { username, password } = req.body;
		
		// Check if the user exists
		const user = await pool.request()
			.input('username', sql.VarChar, username)
			.query('SELECT * FROM Users WHERE Username = @username');
		
		// If the user exists, check the password
		if (user.recordset.length > 0) {
			const match = await bcrypt.compare(password, user.recordset[0].Password);
			if (match) {
				req.session.loggedIn = true;
				req.session.userId = user.recordset[0].UserID;
				req.session.username = user.recordset[0].Username;
				res.redirect('/');
			} else {
				res.send(`
					<script>
						alert("Incorrect username or password.");
						window.location.href="/login";
					</script>
				`);
			}
		} else {
			res.send(`
				<script>
					alert("Incorrect username or password.");
					window.location.href="/login";
				</script>
			`);
		}
	} catch (err) {
		console.error('Error during login:', err);
		res.status(500).send('An error occurred while logging in.');
	}
});

// Log out
app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.error('Error during logout:', err);
			return res.status(500).send('An error occurred while logging out.');
		}
		res.redirect('/');
	});
});

// Show the account page
app.get('/account', async (req, res) => {
	try {
		// Connect to database
		let pool = await sql.connect(config);
		
		// Get parameters
		const userId = req.session.userId;
		const username = req.session.username;
		
		// Query the user's recipes
		const result = await pool.request()
			.input('userId', sql.Int, userId)
			.query(`
				SELECT RecipeID, Title
				FROM Recipes
				WHERE UserID = @userId
			`);
		
		// 
		res.render('account', {
			recipes: result.recordset,
			username: username
		});
	} catch (err) {
		console.error('Error getting account page:', err);
		res.status(500).send('An error occurred while querying the database.');
	}
});

// Add or edit a recipe
app.get('/build-recipe', async (req, res) => {
	const recipeId = req.query.recipeId;
	
	if (recipeId) {
		try {
			let pool = await sql.connect(config);
			
			// Fetch the main recipe details
			const recipeDetails = await pool.request()
				.input('recipeId', sql.Int, recipeId)
				.query('SELECT * FROM Recipes WHERE RecipeID = @recipeId');
			
			// Fetch ingredients associated with the recipe
			const ingredients = await pool.request()
			.input('recipeId', sql.Int, recipeId)
			.query('SELECT ri.Quantity, ri.Unit, ri.IngredientText, i.Name, i.IngredientID FROM RecipeIngredients ri JOIN Ingredients i ON ri.IngredientID = i.IngredientID WHERE ri.RecipeID = @recipeId ORDER BY ri.IngredientNumber');
			
			// Fetch instructions associated with the recipe
			const instructions = await pool.request()
				.input('recipeId', sql.Int, recipeId)
				.query('SELECT * FROM Instructions WHERE RecipeID = @recipeId ORDER BY Step');
			
			res.render('build-recipe', {
				recipe: recipeDetails.recordset[0],
				ingredients: ingredients.recordset,
				instructions: instructions.recordset
			});
		} catch (err) {
			console.error('Error getting recipe details:', err);
			res.status(500).send('An error occurred while querying the database.');
		}
	} else {
		res.render('build-recipe', { recipe: null, ingredients: [], instructions: [] });
	}
});

// Insert a new recipe
app.post('/save-recipe', multer().none(), async (req, res) => {
	
	console.log('Received data:', req.body);
	
	try {
		let pool = await sql.connect(config);
		
		// Step 1: Insert into Recipes table
		const { title, description, image, prepTime, cookTime, additionalTime, servings, yield } = req.body;
		const userID = req.session.userId;
		const pubDate = new Date();
		
		const result = await pool.request()
			.input('UserID', sql.Int, userID)
			.input('Title', sql.NVarChar, title)
			.input('TextDesc', sql.NVarChar, description)
			.input('Img', sql.NVarChar, image)
			.input('PubDate', sql.DateTime, pubDate)
			.input('PrepTime', sql.Int, prepTime)
			.input('CookTime', sql.Int, cookTime)
			.input('AdditionalTime', sql.Int, additionalTime)
			.input('Servings', sql.Int, servings)
			.input('Yield', sql.NVarChar, yield)
			.query(`INSERT INTO Recipes (UserID, Title, TextDesc, Img, PubDate, PrepTime, CookTime, AdditionalTime, Servings, Yield)
					OUTPUT INSERTED.RecipeID
					VALUES (@UserID, @Title, @TextDesc, @Img, @PubDate, @PrepTime, @CookTime, @AdditionalTime, @Servings, @Yield);`);
		
		const recipeId = result.recordset[0].RecipeID;
		
		console.log(recipeId);
		
		const ingredients = JSON.parse(req.body.ingredients || '[]');
		const instructions = JSON.parse(req.body.instructions || '[]');
		
		// Step 2: Insert into RecipeIngredients
		ingredients.forEach(async (ingredient, index) => {
			await pool.request()
				.input('RecipeID', sql.Int, recipeId)
				.input('IngredientNumber', sql.Int, index + 1)
				.input('IngredientID', sql.Int, ingredient.ingredientId)
				.input('Quantity', sql.Decimal, ingredient.quantity)
				.input('Unit', sql.NVarChar, ingredient.unit)
				.input('IngredientText', sql.NVarChar, ingredient.text)
				.query(`INSERT INTO RecipeIngredients (RecipeID, IngredientNumber, IngredientID, Quantity, Unit, IngredientText)
						VALUES (@RecipeID, @IngredientNumber, @IngredientID, @Quantity, @Unit, @IngredientText);`);
		});
		
		// Step 3: Initialize Ratings
		await pool.request()
			.input('RecipeID', sql.Int, recipeId)
			.query(`INSERT INTO Ratings (RecipeID, One, Two, Three, Four, Five)
					VALUES (@RecipeID, 0, 0, 0, 0, 0);`);
		
		// Step 4: Insert Instructions
		instructions.forEach(async (instruction, index) => {
			await pool.request()
				.input('RecipeID', sql.Int, recipeId)
				.input('Step', sql.Int, index + 1)
				.input('Instruction', sql.NVarChar, instruction)
				.query(`INSERT INTO Instructions (RecipeID, Step, Instruction)
						VALUES (@RecipeID, @Step, @Instruction);`);
		});
		
		// res.send('Recipe saved successfully!');
	} catch (err) {
		console.error('Failed to save recipe:', err);
		res.status(500).send('Failed to save recipe.');
	}
});

// Update a recipe
app.post('/update-recipe', multer().none(), async (req, res) => {
	const { recipeId, title, description, image, prepTime, cookTime, additionalTime, servings, yield, ingredients, instructions } = req.body;

	if (!recipeId) {
		return res.status(400).send("Recipe ID is required for updating.");
	}

	try {
		let pool = await sql.connect(config);

		// Step 1: Update the main recipe details
		await pool.request()
			.input('RecipeID', sql.Int, recipeId)
			.input('Title', sql.NVarChar, title)
			.input('TextDesc', sql.NVarChar, description)
			.input('Img', sql.NVarChar, image)
			.input('PrepTime', sql.Int, prepTime)
			.input('CookTime', sql.Int, cookTime)
			.input('AdditionalTime', sql.Int, additionalTime)
			.input('Servings', sql.Int, servings)
			.input('Yield', sql.NVarChar, yield)
			.query(`UPDATE Recipes SET 
					Title = @Title, TextDesc = @TextDesc, Img = @Img,
					PrepTime = @PrepTime, CookTime = @CookTime, 
					AdditionalTime = @AdditionalTime, Servings = @Servings, Yield = @Yield
					WHERE RecipeID = @RecipeID;`);

		// Step 2: Update ingredients
		// Assuming ingredients are sent as JSON and need deleting and reinserting
		await pool.request().input('RecipeID', sql.Int, recipeId).query('DELETE FROM RecipeIngredients WHERE RecipeID = @RecipeID');
		JSON.parse(ingredients).forEach(async (ingredient, index) => {
			await pool.request()
				.input('RecipeID', sql.Int, recipeId)
				.input('IngredientNumber', sql.Int, index + 1)
				.input('IngredientID', sql.Int, ingredient.ingredientId)
				.input('Quantity', sql.Decimal, ingredient.quantity)
				.input('Unit', sql.NVarChar, ingredient.unit)
				.input('IngredientText', sql.NVarChar, ingredient.text)
				.query(`INSERT INTO RecipeIngredients (RecipeID, IngredientNumber, IngredientID, Quantity, Unit, IngredientText)
						VALUES (@RecipeID, @IngredientNumber, @IngredientID, @Quantity, @Unit, @IngredientText);`);
		});

		// Step 3: Update instructions
		await pool.request().input('RecipeID', sql.Int, recipeId).query('DELETE FROM Instructions WHERE RecipeID = @RecipeID');
		JSON.parse(instructions).forEach(async (instruction, index) => {
			await pool.request()
				.input('RecipeID', sql.Int, recipeId)
				.input('Step', sql.Int, index + 1)
				.input('Instruction', sql.NVarChar, instruction)
				.query(`INSERT INTO Instructions (RecipeID, Step, Instruction)
						VALUES (@RecipeID, @Step, @Instruction);`);
		});
	} catch (err) {
		console.error('Failed to update recipe:', err);
		res.status(500).send('Failed to update recipe.');
	}
});

// Search ingredients on the build recipe page
app.get('/ingredients', async (req, res) => {
	
	// Get the search term
	const searchText = req.query.search;
	
	try {
		// Connect to database
		let pool = await sql.connect(config);
		
		// Query the database
		let result = await pool.request()
			.input('searchText', sql.VarChar, `%${searchText}%`)
			.query('SELECT IngredientID, Name FROM Ingredients WHERE Name LIKE @searchText');
		
		// Send results to page
		res.json(result.recordset);
	} catch (err) {
		console.error('Error querying ingredients:', err);
		res.status(500).send('An error occurred while querying the database.');
	}
});

// Search for recipes
app.get('/search', async (req, res) => {
	try {
		// Connect to database
		let pool = await sql.connect(config);
		
		// Get parameters
		const searchTerm = req.query.searchQuery || '';
		const page = parseInt(req.query.page) || 1;
		const pageSize = 20;
		
		// Count number of results for query
		let request = new sql.Request(pool);
		request.input('searchTerm', sql.VarChar, `%${searchTerm}%`);
		const totalResults = await request.query(`
			SELECT COUNT(*) AS TotalCount
			FROM Recipes
			WHERE Title LIKE @searchTerm OR GeneralName LIKE @searchTerm
		`);
		
		// Determine the number of pages
		const totalCount = totalResults.recordset[0].TotalCount;
		const totalPages = Math.ceil(totalCount / pageSize) - 1;
		
		// Ensure current page in valid range
		let validPage = Math.max(1, Math.min(page, totalPages === 0 ? 1 : totalPages));
		
		// Query recipes for the current page
		request.input('pageSize', sql.Int, pageSize);
		request.input('offset', sql.Int, (validPage - 1) * pageSize);
		const result = await request.query(`
			SELECT Recipes.RecipeID, Recipes.UserID, Users.Username, Recipes.Title, Recipes.TextDesc, Recipes.Img
			FROM Recipes
			INNER JOIN Users ON Recipes.UserID = Users.UserID
			WHERE Recipes.Title LIKE @searchTerm OR Recipes.GeneralName LIKE @searchTerm
			ORDER BY Recipes.Title
			OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
		`);
		
		// Send results to page
		res.render('results', {
			recipes: result.recordset,
			page: validPage,
			totalPages: totalPages,
			searchQuery: searchTerm
		});
	} catch (err) {
		console.error('Error getting search results:', err);
		res.status(500).send('An error occurred while querying the database.');
	}
});

// Get recipe details
app.get('/recipe/:recipeId', async (req, res) => {
	try {
		// Connect to database
		let pool = await sql.connect(config);
		
		// Get recipe ID
		const recipeId = req.params.recipeId;
		
		// Query recipe details
		let request = new sql.Request(pool);
		request.input('recipeId', sql.Int, recipeId)
		const details = await request.query(`
			SELECT *
			FROM Recipes
			JOIN Users ON Recipes.UserID = Users.UserID
			WHERE Recipes.RecipeID = @recipeId
		`);
		
		// Query ingredients
		const ingredients = await request.query(`
			SELECT ri.IngredientID, ri.IngredientText, i.Vegetarian, i.Vegan, i.GlutenFree, i.Keto, i.Paleo, i.Halal, i.Kosher
			FROM RecipeIngredients ri
			INNER JOIN Ingredients i ON ri.IngredientID = i.IngredientID
			WHERE ri.RecipeID = @recipeId
			ORDER BY ri.IngredientNumber
		`);
		
		// Query instructions
		const instructions = await request.query(`
			SELECT Instruction
			FROM Instructions
			WHERE RecipeID = @recipeId
			ORDER BY Step
		`);
		
		// Query ratings
		const ratings = await request.query(`
			SELECT *
			FROM Ratings
			WHERE RecipeID = @recipeId
		`);
		
		// Send results to page
		res.render('recipe', {
			recipe: details.recordset[0],
			ingredients: ingredients.recordset,
			instructions: instructions.recordset,
			ratings: ratings.recordset[0]
		});
	} catch (err) {
		console.error('Error getting recipe details:', err);
		res.status(500).send('An error occurred while querying the database.');
	}
});

// Substitute ingredients
app.get('/substitution', async (req, res) => {
	try {
		// Connect to database
		let pool = await sql.connect(config);
		
		// Get parameters
		const { ingredientId, preference } = req.query;
		
		// Query the database
		const query = `
		SELECT i1.Name
		FROM Ingredients i1
		INNER JOIN Ingredients i2
		ON i1.RoleInRecipe = i2.RoleInRecipe
		AND i1.Texture = i2.Texture
		AND (i1.FlavorProfile = i2.FlavorProfile OR i1.Category = i2.Category)
		WHERE i2.IngredientID = ${ingredientId}
		AND (i1.${preference} = 'Yes' OR i1.${preference} = 'Maybe')
		`;
		const details = await pool.request()
			.query(query);
		
		// Send results to page
		if (details.recordset.length > 0) {
			const randomIndex = Math.floor(Math.random() * details.recordset.length);
			const randomRow = details.recordset[randomIndex];
			res.json(randomRow);
		} else {
			res.json({ message: "No substitutions found." });
		}
	} catch (err) {
		console.error('Error getting substitution:', err);
		res.status(500).send('An error occurred while querying the database.');
	}
});

// Get description of category/dietary preference
app.get('/category-desc', async (req, res) => {
	try {
		// Connect to database
		let pool = await sql.connect(config);
		
		// Get parameters
		const { category } = req.query;
		
		// Query the database
		const query = `
		SELECT Description
		FROM Categories
		WHERE Name = '${category}'
		`;
		const desc = await pool.request()
			.query(query);
		
		// Send results to page
		res.json(desc);
	} catch (err) {
		console.error('Error getting the category substitution:', err);
		res.status(500).send('An error occurred while querying the database.');
	}
});

// Host server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});