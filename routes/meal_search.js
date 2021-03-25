var express = require('express');
var app = express();
var router = express.Router();
const mysql = require('./dbcon.js');

router.get('/get_ingredients', function(req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM Ingredients", function(err, rows, fields) {
    if (err) {
      console.log("ran into an error");
      console.log(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
  });
});

router.get('/search_recipe_name', function(req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM Recipe WHERE Name like '%" + [req.query.search] + "%'", function(err, rows, fields) {
    if (err) {
      console.log("ran into an error");
      console.log(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
  });
});

router.get('/search_recipe_ingredient', function(req, res, next) {
  var context = {};
  mysql.pool.query("SELECT R.ID, R.Name, R.Description FROM Recipe R JOIN Recipe_RecipeComponent RRC ON R.ID = RRC.RecipeID JOIN RecipeComponent RC ON RRC.RecipeComponentID = RC.ID JOIN Ingredient I ON RC.IngredientID = I.ID WHERE I.Name like '%" + [req.query.search] + "%'", function(err, rows, fields) {
    if (err) {
      console.log("ran into an error");
      console.log(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
  });
});

router.get('/get_recipe_details', function(req, res, next) {
  var context = {};
  let sql_query = "SELECT RC.ID, I.Name, RC.Amount, RC.MeasurementType, I.IsEthical, I.EthicalDescription, IIG.IngredientGroupID " +
    "FROM RecipeComponent RC " +
    "JOIN Recipe_RecipeComponent RRC ON RC.ID = RRC.RecipeComponentID " +
    "JOIN Ingredient I ON RC.IngredientID = I.ID " +
    "JOIN Ingredient_IngredientGroup IIG ON RC.IngredientID = IIG.IngredientID " +
    "WHERE RRC.RecipeID = ";
  mysql.pool.query(sql_query + [req.query.id], function(err, rows, fields) {
    if (err) {
      console.log("ran into an error");
      console.log(err);
      return;
    }

    // Get list of IngredientGroupID of all unethical ingredients 
    var igArr = [];
    for (var i = 0; i < rows.length; i++) {

      // All ingredients will have an array of ethical alternatives
      // List may be empty for some, this prevents null exceptions against ingredient.Alt object
      rows[i].Alt = [];

      if (rows[i].IsEthical == 0) {
        igArr.push(rows[i].IngredientGroupID);
      }
    }

    // If any ingredients are not ethical update alternatives list and respond
    if (igArr.length > 0) {
      var igList = igArr.join(',');

      // Get ethical alternatives for ingredients in each group
      let sql_query = "select I.ID, I.Name, IIG.IngredientGroupID " +
        "from Ingredient_IngredientGroup IIG " +
        "JOIN Ingredient I on IIG.IngredientID = I.ID " +
        "where IIG.IngredientGroupID in (" + igList + ") AND I.IsEthical = 1;";

      console.log(sql_query);
      mysql.pool.query(sql_query, function(err, alt_rows, fields) {
        if (err) {
          console.log("ran into an error");
          console.log(err);
          return;
        }
        //console.log(alt_rows);

        // For each ingredient in context.results, add field of ethical alternative
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].IsEthical == 0) {

            // Add ethical alternatives to the alt list
            for (var j = 0; j < alt_rows.length; j++) {
              if (rows[i].IngredientGroupID == alt_rows[j].IngredientGroupID) {
                rows[i].Alt.push({
                  ID: alt_rows[j].ID,
                  Name: alt_rows[j].Name
                });
              }
            }
          }
        }
        context.results = JSON.stringify(rows);
        res.send(context);
      });
    } else {
      context.results = JSON.stringify(rows);
      res.send(context);
    } // if (igArr.length > 0)
  });
});

router.get('/search_recipe_user_relationship', function (req, res, next) {
    var context = {};
    mysql.pool.query("SELECT * FROM `Recipes_Users` WHERE RecipeID = " + [req.query.recipeID] + " AND UserID = " + [req.query.userID], function (err, rows, fields) {
        if (err) {
            console.log("ran into an error");
            console.log(err);
            return;
        }
        context.results = JSON.stringify(rows);
        res.send(context);
    });
});

router.get('/insert_recipe_user_relationship', function (req, res, next) {
    var context = {};
    mysql.pool.query('INSERT INTO Recipes_Users (`RecipeID`, `UserID`) VALUES (?, ?)',
	[req.query.recipeID, req.query.userID], function (err, result) {
	    if (err) {
	        next(err);
	        return;
	    }
	    res.send(context);
	});
});

router.get('/meal_search', function(req, res, next) {
  /*
    Passport will populate the request with the user object when user has authenticated
    We can check if req.user is defined to get the logged-in user's id, username, nickname
    Print values to console for now
  */
  if (req.user) {
    console.log("/> User: " + JSON.stringify(req.user, null, 2));
  }

  res.render('meal_search', { user: req.user });
});

module.exports = router;
