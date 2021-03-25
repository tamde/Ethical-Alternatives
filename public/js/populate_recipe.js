// build_recipe.js builds the the recipes' ingredients and the list of ethical alternatives

var id;
// get the ID of the ingredient
function getId(clickedId)
{
    id = clickedId;
}

// substitute the the name of the ingredient
// function replaceItem(ingredient)
// {
//     document.getElementById(id).innerHTML = ingredient;
// }

// dynamically create the ethical alternative list
function makeAltList()
{
    // list needs to be populated by database**********************
    var list = ["Cauliflower", "Kale", "Cabbage"];
    var ethicalAltList = document.getElementById("ethicalAltList");

    var ulEthicalAlt = document.createElement("ul");
    ulEthicalAlt.setAttribute("id", "altList");

    // create button with names of ingredients and add functionality to replace main ingredient with alternative
    for (i = 0; i < list.length; i++)
    {
        var li = document.createElement("li");
        let button = document.createElement("button");
        button.innerHTML = list[i];
        button.setAttribute("class", "ingredientButton");
        // replace ingredient when button is clicked
        button.addEventListener("click", function(){
            replaceItem(button.innerHTML)});     

        li.appendChild(button);
        ulEthicalAlt.appendChild(li);
    }
    ethicalAltList.appendChild(ulEthicalAlt);
}


function makeRecipe()
{
    // list needs to be populated by database*****************
    var list = ["test", "test2", "test3"];
    var ingredientList = document.getElementById("ingredientList");

    var ulRecipe = document.createElement("ul");
    ulRecipe.setAttribute("id", "recipeList");
    
    // create recipes
    for (i = 0; i < list.length; i++)
    {
        var li = document.createElement("li");
        li.setAttribute("class", "ingredientItem");
        let button = document.createElement("button");
        button.innerHTML = list[i];
        button.setAttribute("class", "ingredientButton");
        button.setAttribute("id", "recipe" + i);
        // get the id once button is clicked
        button.addEventListener("click", function(){
            getId(this.id)});
        li.appendChild(button);
        ulRecipe.appendChild(li);
    }
    ingredientList.appendChild(ulRecipe);
}
makeRecipe();
makeAltList();
