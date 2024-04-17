-- SELECT Recipes.RecipeID, Recipes.UserID, Users.Username, Recipes.Title, Recipes.TextDesc, Recipes.Img
-- FROM Recipes
-- INNER JOIN Users ON Recipes.UserID = Users.UserID
-- WHERE Recipes.Title LIKE '%apple%'
-- OR Recipes.GeneralName LIKE '%apple%'
-- ORDER BY Recipes.Title

-- SELECT TOP 10 * FROM Ingredients;

-- CREATE SEQUENCE RecipeSeq
-- START WITH 14054
-- INCREMENT BY 1;

-- SELECT * FROM Recipes WHERE UserID IS NULL;

-- UPDATE Recipes SET UserID=0 WHERE UserID IS NULL;

-- UPDATE Users SET Username='Foogle Staff', Email='staff@foogle.com' WHERE UserID=0;

-- SELECT *
-- FROM Ingredients
-- WHERE Vegetarian = 'Yes'
-- 	AND RoleInRecipe = (SELECT RoleInRecipe FROM Ingredients WHERE IngredientID = 123)
-- 	AND Texture = (SELECT Texture FROM Ingredients WHERE IngredientID = 123)
-- 	AND (FlavorProfile = (SELECT FlavorProfile FROM Ingredients WHERE IngredientID = 123)
-- 	OR Category = (SELECT Category FROM Ingredients WHERE IngredientID = 123));

-- SELECT * FROM Ingredients WHERE IngredientID = 1318 OR Name = 'chaat masala';

-- SELECT * FROM Recipes;





-- Step 1
-- INSERT INTO Recipes (UserID, Title, GeneralName, TextDesc, PubDate, PrepTime, CookTime, AdditionalTime, Servings, Yield)
-- VALUES (1, 'Title', 'GeneralName', 'Description', '2024-04-12', 1, 1, 1, 1, 'Yield');

-- SELECT * FROM Recipes;

-- INSERT INTO Recipes (UserID, Title, TextDesc, Img, PubDate, PrepTime, CookTime, AdditionalTime, Servings, Yield)
-- 					OUTPUT INSERTED.RecipeID
-- 					VALUES (12345, 'agdf', 'fdgdfd', 'sdasdasd', '2024-01-01', 1, 1, 1, 1, 'asda');






-- Step 2
-- INSERT INTO RecipeIngredients (RecipeID, IngredientNumber, IngredientID, Quantity, Unit, IngredientText)
-- VALUES (14055, 1, 123, 70, 'gallons', 'some ingredient'),
-- 	   (14055, 2, 123, 70, 'gallons', 'some other ingredient');

-- SELECT * FROM RecipeIngredients WHERE RecipeID = 14068;








-- Step 3
-- INSERT INTO Instructions (RecipeID, Step, Instruction)
-- VALUES (14055, 1, 'Instruction 1'),
--        (14055, 2, 'Instruction 2');

SELECT * FROM Recipes WHERE RecipeID = 14082;
-- SELECT * FROM RecipeIngredients WHERE RecipeID > 14052;









-- Step 4
-- INSERT INTO Ratings (RecipeID, One, Two, Three, Four, Five)
-- VALUES (14055, 0, 0, 0, 0, 0);

-- SELECT * FROM Ratings WHERE RecipeID = 14055;















