
var express = require('express');
var router = express.Router();
var mysql = require('./dbcon.js');

router.post('/show_book_recipes', function(req, res, next) 
{
    var context = {};
    var payload = req.body.info;
    context.user = req.user;
    
    //console.log(payload.data);
    //console.log(context.user);
    //console.log(context.user.ID);
    // Get list of recipe books the user has.
    const sql_query = "SELECT Recipe.ID, Recipe.Name, Recipe.Description " +
                      "FROM Recipes_Books JOIN Recipe " +
                      "ON Recipes_Books.RecipeID = Recipe.ID " +
                      "JOIN Books " +
                      "ON Recipes_Books.BookID = Books.ID " +
                      "WHERE Books.ID = (SELECT  ID FROM Books WHERE UserID = ? AND Name = ?)";

    console.log(sql_query);
    
    mysql.pool.query(sql_query,[req.user.ID, payload.data] ,function(err, result) {
    if (err) {
      next(err);
      return;
    }

    res.json(result);
    });
});

router.post('/add_to_book', function(req, res, next) 
{
    console.log("POST Request to add recipe to book");
    // payload received from client
    var payload = req.body.info;
    console.log(payload);
    console.log(req.user.ID);
    const sql_query = "INSERT INTO Recipes_Books (BookID, RecipeID) VALUES ((SELECT ID FROM Books WHERE Name = ? AND UserID = ?),?)"
    //const sql_query = "INSERT INTO Books (Name, UserID) VALUES (?,?)";
    console.log(sql_query);
    console.log(payload.book);
    console.log(payload.id);
    
    mysql.pool.query(sql_query,[payload.book,req.user.ID,payload.id], function(err, result) {
    if (err) {
      next(err);
      return;
    }
    else
    {   
        res.json(result);

    }
    });
});

router.get('/random_recipe_info', function(req, res, next) 
{
    var context = {};
    context.user = req.user;
    //console.log(context.user);
    //console.log(context.user.ID);
    
    // Get list of recipe books the user has.
    const sql_query = "SELECT * FROM Recipe JOIN Recipes_Users ON Recipe.ID = Recipes_Users.RecipeID WHERE Recipes_Users.UserID = ?"
    //const sql_query = "SELECT * FROM Recipe WHERE ID < 50";
    mysql.pool.query(sql_query,[req.user.ID], function(err, result) {
    if (err) {
      next(err);
      return;
    }

    res.json(result);
    });
});

router.get('/get_books', function(req, res, next) 
{
    var context = {};
    if(req.user != null)
    {
        context.user = req.user;
        //console.log(context.user);
        //console.log(context.user.ID);
        
        // Get list of recipe books the user has.
        const sql_query = "SELECT * FROM Books WHERE UserID =" + context.user.ID;

        mysql.pool.query(sql_query, function(err, result) {
        if (err) {
          next(err);
          return;
        }

        res.json(result);
        });
    }
    else
    {
        //console.log("Guest User");
        res.json([-2]);
    }
});

router.post('/get_books', function(req, res, next) 
{ 
    console.log("POST Request for get_books");
    // payload received from client
    var payload = req.body.info;
    console.log(payload);
    console.log(req.user.ID);
    
    const sql_query = "INSERT INTO Books (Name, UserID) VALUES (?,?)";
    console.log(sql_query);
    
    mysql.pool.query(sql_query,[payload,req.user.ID], function(err, result) {
    if (err) {
      next(err);
      return;
    }
    else
    {
        var query2 = "SELECT ID, Name FROM Books WHERE UserId = ? AND Name = ?";
        mysql.pool.query(query2,[req.user.ID,payload], function(err, result) {
        if (err) 
        {
            next(err);
            return;
        }
        
        res.json(result);
        });
    }
    });
});

module.exports = router;