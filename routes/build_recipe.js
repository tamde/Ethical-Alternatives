
var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

router.get('/build_recipe', function(req, res, next) {

  var context = {};
  context.user = req.user;
  if (context.user) {
    console.log(context.user);
  }

  // Get list of ingredient groups with ingredient associations
  let sql_query = "SELECT DISTINCT Ingredient.ID, Ingredient.Name, " +
    "Ingredient.IsEthical, Ingredient.EthicalDescription, " +
    "IngredientGroup.ID as IngredientGroupID, IngredientGroup.GroupName as GroupName " +
    "FROM `Ingredient`,`IngredientGroup`,`Ingredient_IngredientGroup` " +
    "WHERE Ingredient.ID=Ingredient_IngredientGroup.IngredientID " +
    "AND Ingredient_IngredientGroup.IngredientGroupID=IngredientGroup.ID";

  mysql.pool.query(sql_query, function(err, result) {
    if (err) {
      next(err);
      return;
    }

    context.ingredients = result;
    res.render('build_recipe', context);
  });
});

router.post('/build_recipe', async function(req, res, next) {

  // payload received from client
  var payload = [];
  for (x in req.body) {
    payload.push({ name: x, value: req.body[x] });
  }

  // Create a variable to hold values from client form
  var recipe = {
    id: null,
    name: payload[0].value,
    description: payload[2].value
  };
  var user_id = payload[3].value;

  var recipe_component_list = [];
  payload[1].value.forEach(function(item, index) {
    recipe_component_list.push([item.ingredientID, item.amount, item.measurement_type]);
  });

  // save recipe to the database
  recipe.id = await insertRecipe([recipe.name, recipe.description]);

  // save recipe components to database
  for (var i = 0; i < recipe_component_list.length; i++) {
    let component_id = await insertComponents(recipe_component_list[i]);

    // create relationship between recipe components and recipe
    await insertRecipeComponent([recipe.id, component_id]);
  }

  // create relationship between recipe and user_id
  await insertRecipeUser([recipe.id, user_id]);

  let status_msg = "Recipe " + recipe.name + " saved to database with id: " + recipe.id
  res.json({ reg_success: status_msg });
});

/*
insertComponents - async function that takes in as argument an array with
ingredientID, amount and measurementType and resolves the inserted ID in db 
*/
async function insertComponents(recipe_components) {
  return new Promise(function(resolve, reject) {
    let sql_query = "INSERT INTO `RecipeComponent` (`IngredientID`, `Amount`, `MeasurementType`) VALUES (?, ?, ?)";
    mysql.pool.query(sql_query, recipe_components, function(err, result) {
      if (err) {
        next(err);
        return;
      }
      resolve(result.insertId);
    });
  });
}

/*
insertRecipe - async function that takes in as argument an array with
recipe name and description and resolves the inserted ID in db
*/
async function insertRecipe(recipe) {
  return new Promise(function(resolve, reject) {
    let sql_query = "INSERT INTO `Recipe` (`Name`, `Description`) VALUES (?, ?)";
    mysql.pool.query(sql_query, recipe, function(err, result) {
      if (err) {
        next(err);
        return;
      }
      resolve(result.insertId);
    });
  });
}

/*
insertRecipeUser - async function that takes in as argument an array with
recipeID and UserID and resolves the inserted ID in db
*/
async function insertRecipeUser(recipe_user) {
  return new Promise(function(resolve, reject) {
    let sql_query = "INSERT INTO `Recipes_Users` (`RecipeID`, `UserID`) VALUES (?, ?)";
    mysql.pool.query(sql_query, recipe_user, function(err, result) {
      if (err) {
        next(err);
        return;
      }
      resolve(result.insertId);
    });
  });
}

/*
insertRecipeComponent - async function that takes in as argument an array with
recipeID and componentID and resolves the inserted ID in db
*/
async function insertRecipeComponent(recipe_component) {
  return new Promise(function(resolve, reject) {
    let sql_query = "INSERT INTO `Recipe_RecipeComponent` (`RecipeID`, `RecipeComponentID`) VALUES (?, ?)";
    mysql.pool.query(sql_query, recipe_component, function(err, result) {
      if (err) {
        next(err);
        return;
      }
      resolve(result.insertId);
    });
  });
}

module.exports = router;