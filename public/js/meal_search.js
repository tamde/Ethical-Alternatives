class Recipe {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    DisplayLink() {
        var link = document.createElement("a");
        var node = document.createElement("li");
        link.textContent = this.name;
        link.setAttribute('id', this.id)
        link.setAttribute('href', "#");
        link.onclick = function () { searchRecipeIngredients(this.id); }
        node.appendChild(link);

        return node;
    }
}

class RecipeComponent {
    constructor(id, name, type, amount) {
        this.name = name;
        this.type = type;
        this.amount = amount;
    }

    printRecipeComponent(recipeComponent) {
        //Formatting recipe component
        return document.createTextNode(this.amount + " " + this.type + " " + this.name)
    }
}

var recipes = [];

$('#searchType').change(function () {
    recipeSearchText = $('#recipeSearchText');
    ingredientSearchText = $('#ingredientSearchText');

    if (this.value == "ingredient") {
        recipeSearchText.css("display", "none");
        ingredientSearchText.css("display", "inline");
    }
    else {
        ingredientSearchText.css("display", "none");
        recipeSearchText.css("display", "inline");
    }
})

$('#searchButton').click(function () {
    searchType = $('#searchType').val();
    recipeSearchText = $('#recipeSearchText').val();
    ingredientSearchText = $('#ingredientSearchText').val();

    recipes = [];

    if (searchType == "ingredient") {
        $.ajax({
            url: "/search_recipe_ingredient?search=" + ingredientSearchText,
            method: "get",
            dataType: "json",
            success: function (data) {
                console.log("Search Successful");
                var json = JSON.parse(data.results);
                if (json.length) {
                    for (var i = 0; i < json.length; i++) {
                        var recipe = new Recipe(json[i].ID, json[i].Name, json[i].Description);
                        recipes.push(recipe);
                    }
                }
                search(recipes, ingredientSearchText);
            },
            error: function () {
                console.log("Search Failed");
                search(recipes, searchType, ingredientSearchText);
            }
        });
    }
    else {
        $.ajax({
            url: "/search_recipe_name?search=" + recipeSearchText,
            method: "get",
            dataType: "json",
            success: function (data) {
                console.log("Search Successful");
                var json = JSON.parse(data.results);
                if (json.length) {
                    for (var i = 0; i < json.length; i++) {
                        var recipe = new Recipe(json[i].ID, json[i].Name, json[i].Description);
                        recipes.push(recipe);
                    }
                }
                search(recipes, recipeSearchText);
            },
            error: function () {
                console.log("Search Failed");
                search(recipes, searchType, recipeSearchText);
            }
        });
    }
})

function search(recipes, searchText) {
    //Finding needed components
    resultsContainer = $("#resultsContainer");
    ingredientsContainer = $("#ingredientsContainer");

    //Formatting needed components
    resultsContainer.css("display", "block");
    ingredientsContainer.css("display", "none");

    //Formatting Results list
    resultsList = $("#resultsList");
    resultsList.text("");

    if (recipes.length == 0) {
        var textNode = document.createTextNode('No results found for "' + searchText + '"');
        resultsList.append(textNode);
    }
    else {
        for (recipe in recipes) {
            resultsList.append(recipes[recipe].DisplayLink());
        }
    }
}

function CreateLink(recipe) {
    var link = document.createElement("a");
    var node = document.createElement("li");
    link.textContent = recipe.name;
    link.setAttribute('id', recipe.id)
    link.setAttribute('href', "#");
    link.onclick = function () { searchRecipeIngredients(this.id); }
    node.appendChild(link);

    return node;
}

function searchRecipeIngredients(id) {
    var recipeComponents = [];

    //Search all recipe components based on recipe ID
    $.ajax({
        url: "/get_recipe_details?id=" + id,
        method: "get",
        dataType: "json",
        success: function (data) {
            console.log("Search Successful");
            var json = JSON.parse(data.results);
            if (json.length) {
                for (var i = 0; i < json.length; i++) {
                    var component = new RecipeComponent(json[i].ID, json[i].Name, json[i].MeasurementType, json[i].Amount);
                    recipeComponents.push(component);
                }
            }
            printRecipe(recipeComponents, id);
        },
        error: function () {
            console.log("Search Failed");
        }
    });
}

function displayRecipeAddButton(recipeId, userId, addRecipeButton) {
    //Don't display add recipe button if not logged in or if they have already added that recipe
    if (userId == "") {
        addRecipeButton.css("display", "none");
    } else {
        $.ajax({
            url: "/search_recipe_user_relationship?recipeID=" + recipeId + "&userID=" + userId || -1,
            method: "get",
            dataType: "json",
            success: function (data) {
                console.log("Search Successful");
                var json = JSON.parse(data.results);
                if (json.length) {
                    addRecipeButton.css("display", "none");
                } else {
                    addRecipeButton.css("display", "block");
                }
            },
            error: function () {
                console.log("Search Failed");
                addRecipeButton.css("display", "block");
            }
        });
    }

}

function addUserRecipe(recipeId, userId, addRecipeButton) {
    $.ajax({
        url: "/insert_recipe_user_relationship?recipeID=" + recipeId + "&userID=" + userId,
        method: "get",
        dataType: "json",
        success: function (data) {
            console.log("Update Successful");
            addRecipeButton.css("display", "none");
        },
        error: function () {
            console.log("Update Failed");
        }
    });
}

function printRecipe(recipeComponents, id) {
    //Finding needed components
    ingredientsContainer = $("#ingredientsContainer");
    recipeName = $("#recipeName");
    ingredientsList = $("#ingredientsList");
    recipeDescription = $("#recipeDescription");
    addRecipeButton = $('#addRecipeBtn');

    //Formatting needed components
    ingredientsContainer.css("display", "block");
    recipeName.text("");
    ingredientsList.text("");
    recipeDescription.text("");

    //Check which recipe was selected
    var currentRecipe = null;
    for (recipe in recipes) {
        if (recipes[recipe].id == id) {
            currentRecipe = recipes[recipe];
        }
    }

    //Display Recipe Name
    var textnode = document.createTextNode(currentRecipe.name);
    recipeName.append(textnode);

    //List Recipe Components
    for (recipeComponent in recipeComponents) {
        var node = document.createElement("li");
        node.appendChild(recipeComponents[recipeComponent].printRecipeComponent());
        ingredientsList.append(node);
    }

    //Display Recipe Description
    var textnode = document.createTextNode(currentRecipe.description);
    recipeDescription.append(textnode);

    //Display Add Recipe Button
    userId = $('#user_id').html();
    displayRecipeAddButton(id, userId, addRecipeButton);
    addRecipeButton.off();
    addRecipeButton.click(function () {
        addUserRecipe(id, userId, addRecipeButton)
    });
}