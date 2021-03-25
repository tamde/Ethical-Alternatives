// import ./pop_up.js for the modal popup
var imported = document.createElement('popup_script');
imported.src = './pop_up.js';
document.head.appendChild(imported);

const baseURL = 'localhost:3000/build_recipe';

var ingredient_info_from_db = []; // local array for storing all ingredients and their info from database
var ingredient_div = document.getElementById('all_ingredient_info').getElementsByTagName('span');

/* iterate through span objects in build_recipe.handlebars and place all ingredient info into an array*/
for (var i = 0; i < ingredient_div.length; i++ ){
    var single_ingredient = ingredient_div[i].innerHTML;
    var temp_arr = single_ingredient.split("*");

    console.log(temp_arr);
    ingredient_info_from_db.push({id: temp_arr[0], name: temp_arr[1], isEthical: temp_arr[2],
                             description: temp_arr[3], ingredient_groupID: temp_arr[4], 
                             ingredient_group_name: temp_arr[5]});
}

console.log(ingredient_info_from_db);


/* alert user if they are not logged in */
var user_id = document.getElementById("user_id").innerHTML;
if (user_id == ""){
    console.log("NOT LOGGED IN");
    alert("Please log in or create an account in order to save a built recipe.")
}

/*
------------------------------------------------------------------
create_category_dropdown() takes the array made from the ingredient
information from the database and creates a dropdown of all
unique ingredient groups.
-------------------------------------------------------------------
*/
function create_category_dropdown(ingredient_arr, dropdown){
    var groups_in_dropdown = []; // keep track of what categories we have in the dropdown

    // add all ingredient groups into the dropdown
    for (var i = 0; i < ingredient_arr.length; i++){
        var category_selection = document.createElement("option");

        // only add groups that haven't already been added to the category dropdown
        if (groups_in_dropdown.includes(ingredient_arr[i].ingredient_groupID) == false){
            category_selection.innerHTML = ingredient_arr[i].ingredient_group_name;
            category_selection.value = ingredient_arr[i].ingredient_groupID; // the value will be the Ingredient Group ID
            dropdown.appendChild(category_selection);
            groups_in_dropdown.push(ingredient_arr[i].ingredient_groupID); // save the group into the array
        }
    }
}

// create the dropdown for food categories in the ingredient form
var dropdown = document.getElementById("category_choice");
create_category_dropdown(ingredient_info_from_db, dropdown);


/*
---------------------------------------------------------------------------------
remove_ingredient_selection() removes any ingredients listed in the ingredient dropdown.
This way when the user chooses a new food category, the ingredients from the previous
category won't show up
REFERENCE CITED: https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
---------------------------------------------------------------------------------
*/
function remove_ingredient_selection(parent){

    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*
------------------------------------------------------------------------------
create_ingredient_dropdown() adds the ingredients from the selected food 
category from the Category dropdown
------------------------------------------------------------------------------
*/
function create_ingredient_dropdown(event){
    var group_choice = document.getElementById("category_choice").value;
    var dropdown = document.getElementById("ing_choice");
    remove_ingredient_selection(dropdown); // remove existing ingredient selections from dropdown

    // add all ingredient into the dropdown that are in the selected ingredient group
    for (var i = 0; i < ingredient_info_from_db.length; i++){
        var ingredient_selection = document.createElement("option");

        // here we iterate through the local array, ingredient_info_from_db and 
        // find all ingredients that are in the chose ingredient group
        if (ingredient_info_from_db[i].ingredient_groupID == group_choice){
            ingredient_selection.innerHTML = ingredient_info_from_db[i].name;
            ingredient_selection.value = ingredient_info_from_db[i].id;
            dropdown.appendChild(ingredient_selection);
        }
    }
}

/* ------------------------ ETHICAL INFO ---------------------------------- */
/*
--------------------------------------------------------------------
get_ingredient_id() grabs the ingredient ID of the ingredient whose
Check button was clicked (target).
--------------------------------------------------------------------
*/
function get_ingredient_id(target){
    var td = target.parentNode; // move up to td
    var tr = td.parentNode; // move up to tr
    var ingredient_id = tr.firstElementChild;
    ingredient_id = ingredient_id.firstElementChild.value;
    return ingredient_id;
}

/* 
-------------------------------------------------------------------------
get_ingredient_from_list() traverses the ingredient_info_from_db list and 
return the ingredient's entire object containting the ingredient's id,
name, isEthical value, ethical description, and ingredient group id
-------------------------------------------------------------------------
*/
function get_ingredient_from_list(ingredient_id){
    for (var i = 0; i < ingredient_info_from_db.length; i++ ){
        if (ingredient_id == ingredient_info_from_db[i].id){
            return ingredient_info_from_db[i];
        }
    }
}

/*
--------------------------------------------------------------------
function that creates a list of ethical alternatives. This list will
be passed to makeAltList()
--------------------------------------------------------------------
*/
function get_ethical_alts_from_group(ingredient_object){
    var alt_list = [];

    /* traverse through ingredient_info_from db array, if the ingredient_object that
    was passed to the function was unethical, then grab all ethical ingredients
    in that same ingredient group and push the ingredient object into the alt_list
    */
    for (var i = 0; i < ingredient_info_from_db.length; i++ ){
        if (ingredient_object.isEthical == 0 && ingredient_object.ingredient_groupID == ingredient_info_from_db[i].ingredient_groupID){
            if (ingredient_info_from_db[i].isEthical == 1){
                console.log(ingredient_info_from_db[i]);
                alt_list.push(ingredient_info_from_db[i]); // push the ethical ingredient's object to array
            }
        }
    }
    return alt_list;
}


/*
-------------------------------------------------------------------
make_AltList() is directly based off of Derrick's function in 
populate_recipe.js. I needed to change the function name slightly
due to script conflicts on the build_Recipe page. Also changed the list
to be a parameter, rather than a local variable.
--------------------------------------------------------------------
*/
function make_AltList(list, target)
{
    // console.log("makealts", list);
    // console.log(target);
    var ethicalAltList = document.getElementById("ethical_AltList");

    var ulEthicalAlt = document.createElement("ul");
    ulEthicalAlt.setAttribute("id", "altList");

    // create button with names of ingredients and add functionality to replace main ingredient with alternative
    for (i = 0; i < list.length; i++)
    {
        var li = document.createElement("li");
        let button = document.createElement("button");
        button.innerHTML = list[i].name;
        let alt_id = list[i].id;
        console.log(alt_id);
        button.setAttribute("class", "ingredientButton");
        // replace ingredient when button is clicked
        button.addEventListener("click", function(){
            replaceItem(target, alt_id, list)});     

        li.appendChild(button);
        ulEthicalAlt.appendChild(li);
    }
    ethicalAltList.appendChild(ulEthicalAlt);
}


/*
-------------------------------------------------------------------
replaceItem() replaces the unethical ingredient's ID and name
with the chosen ethical one.
--------------------------------------------------------------------
*/
function replaceItem(target, alt_id, list)
{
//     console.log(alt_id);
    for (i = 0; i < list.length; i++)
    {
        if (alt_id == list[i].id)
        {
            var replace_ingredient_id = list[i].id;
            var replace_ingredient_name = list[i].name;
        }
    }
    var all_inputs = document.getElementsByTagName("INPUT");
    // console.log(all_inputs.value)
    for (j = 0; j < all_inputs.length; j++)
    {
        if (all_inputs[j].value == target)
        {
            all_inputs[j].value = replace_ingredient_id;
//             console.log("value1 ", all_inputs[j].value);
            all_inputs[j+1].value = replace_ingredient_name;
//             console.log("value2 ", all_inputs[j+1].value);
        }
    }
}

/*
------------------------------------------------------------------------
populate_ethical_info() takes in the ingredient_id, gets the ingredient_object
from the ingredient_info_from_db list, and dynamically populates the 
pop-up modal with the Ethical Description of the ingredient
------------------------------------------------------------------------
*/
function populate_ethical_info(ingredient_id){
    var ingredient_object = get_ingredient_from_list(ingredient_id);
    var ethical_description = ingredient_object.description;
    var ingredient_name  = ingredient_object.name;
    var modal_ethical_description = document.getElementById("ingredientDescription");
    modal_ethical_description.innerHTML = ethical_description;
    var modal_ingredient_name = document.getElementById("ingredientName");
    modal_ingredient_name.innerHTML = "Ethical Information for " + ingredient_name;
    console.log(ingredient_id);
}
/*
---------------------------------------------------------------------
ethical_popup() populates ethical description modal with the
ingredient's Ethical Description. If the ingredient is unethical, then
alternatives will be shown
----------------------------------------------------------------------
*/
function ethical_popup(target){
    // get id of the ingredient whose check button was clicked
    var ingredient_id = get_ingredient_id(target);

    // get ingredient's object from ingredient_from_db()
    var ingredient_object = get_ingredient_from_list(ingredient_id);

    // dynamically populate modal with ethical information
    populate_ethical_info(ingredient_id);

    // create the list of ethical alternatives
    var alt_list = get_ethical_alts_from_group(ingredient_object);

    // remove any ethical alternatives that were appended previously
    var ul_list = document.getElementById("altList");
    if (ul_list){
        ul_list.remove();
    }

    // append the ethical alternative list to the modal
    make_AltList(alt_list, ingredient_id);
    
}
/* -------------------- END ETHICAL INFO ---------------------------------- */


/*
---------------------------------------------------------
check_button() creates a check button for checking ethics

**** MUST CHANGE THIS TO ACCOMMODATE DERRICK'S FEATURE ******
---------------------------------------------------------
*/
function check_button() {
    var button = document.createElement("td"); 
    var edit = document.createElement("INPUT");
    edit.setAttribute("type", "button");
    edit.setAttribute("value", "Check");
    edit.className = "ingredientButton";
    edit.innerHTML = "Check";
    button.appendChild(edit); // input element will be a child of td element

    return button;
}


/*
------------------------------------------------------------
create_delete_button() creates a delete button for deleting the row
------------------------------------------------------------
*/
function create_delete_button() {
    var button = document.createElement("td");
    var delete_button = document.createElement("INPUT");
    delete_button.setAttribute("type", "button");
    delete_button.setAttribute("id", "delete");
    delete_button.setAttribute("value", "Delete");
    button.appendChild(delete_button); // input element will be a child of td element

    return button;
}


/*
-------------------------------------------------------------------
ingredient_obeject() grabs all input values from the Ingredient Form 
and creates an object with the attributes: ingredient, amount, and
measurement type
--------------------------------------------------------------------
*/
function ingredient_object(){
    ing_object = {ingredientID: null, ingredient_name:null, amount: null, measurement_type: null};
    var ingredient_dropdown = document.getElementById("ing_choice");
    ing_object.ingredientID = ingredient_dropdown.value;
    ing_object.ingredient_name = ingredient_dropdown.options[ingredient_dropdown.selectedIndex].text;

    //console.log("ING CHOICE: " + ing_object.ingredient_name);
    ing_object.amount = parseFloat(document.getElementById("amount").value);
    ing_object.measurement_type = document.getElementById("measurement_type").value;
    //console.log(ing_object.ingredient);
    //console.log(ing_object.amount);
    //console.log(ing_object.measurement_type);

    return ing_object;
}


/*
-------------------------------------------------------------------
make_row() takes in the ingredient object and converts each attribute to
td cells and appends these to a new tr element. Also adds the
check and delete buttons. The whole tr element is appended to the
Recipe Form table
--------------------------------------------------------------------
*/
function make_row(ingredient_object){
    var new_row = document.createElement("tr"); // make a new row element
  
    // create the td cell for the ingredient ID - this will be hidden from user
    var inRecipe_ingID = document.createElement("td");
    var inRecipe_ingID_cell = document.createElement("INPUT");
    inRecipe_ingID_cell.setAttribute("type", "number");
    inRecipe_ingID_cell.setAttribute("type", "hidden");
    inRecipe_ingID_cell.setAttribute("value", parseInt(ingredient_object.ingredientID));
    inRecipe_ingID.appendChild(inRecipe_ingID_cell);
    new_row.appendChild(inRecipe_ingID);

    // create the td cell for the ingredient name - this must be disabled
    var inRecipe_ingName = document.createElement("td");
    var inRecipe_ingName_cell = document.createElement("INPUT");
    inRecipe_ingName_cell.setAttribute("type", "text");
    inRecipe_ingName_cell.setAttribute("disabled", true);
    inRecipe_ingName_cell.setAttribute("value", ingredient_object.ingredient_name);
    inRecipe_ingName.appendChild(inRecipe_ingName_cell);
    new_row.appendChild(inRecipe_ingName);

    // create the td cell for the amount
    var inRecipe_ingAmount = document.createElement("td");
    var inRecipe_ingAmount_cell = document.createElement("INPUT");
    inRecipe_ingAmount_cell.setAttribute("type", "number");
    inRecipe_ingAmount_cell.setAttribute("step", "0.01");
    inRecipe_ingAmount_cell.setAttribute("value", parseFloat(ingredient_object.amount));
    inRecipe_ingAmount.appendChild(inRecipe_ingAmount_cell);
    new_row.appendChild(inRecipe_ingAmount);

    // create the td cell for the measurement type
    var inRecipe_ingMeasurementType = document.createElement("td");
    var inRecipe_ingMeasurementType_cell = document.createElement("INPUT");
    inRecipe_ingMeasurementType_cell.setAttribute("type", "text");
    inRecipe_ingMeasurementType_cell.setAttribute("value", ingredient_object.measurement_type);
    inRecipe_ingMeasurementType.appendChild(inRecipe_ingMeasurementType_cell);
    new_row.appendChild(inRecipe_ingMeasurementType);

    // add the check button - ** THIS MUST BE CHANGED TO ACCOMMODATE DERRICK'S FEATURE ** 
    var check = check_button();
    new_row.appendChild(check);

    // add the delete button
    var del_button = create_delete_button();
    new_row.appendChild(del_button);

    var table = document.getElementById("recipe_table");
    var table_body = table.firstElementChild; // navigate to the tbody element
    table_body.appendChild(new_row); // append the tr to tbody
}


/*
-------------------------------------------------------------------
add_ingredient() grabs all Ingredient Form inputs and converts this
to an Object using ingredient_object(). The object is converted to a
row and added to the Recipe Form.
--------------------------------------------------------------------
*/
function addIngredient_to_Recipe(event){
    var ing_object = ingredient_object();
    make_row(ing_object);
}


/*
-----------------------------------------------------------------
delete_row() takes in the target (the clicked Delete button) and
navigates to the tr element, gets the row index of the delete
button, and calls deleteRow() to remove the entire ingredient
from the Recipe 
-----------------------------------------------------------------
*/
function delete_row(target){
    console.log("hit delete");  // if delete button was clicked delete the row
    var td = target.parentNode; // move up to td
    var tr = td.parentNode; // move up to tr
    var row_index = tr.rowIndex; // get the index of the Delete button's row
    console.log("ROW INDEX " + tr.rowIndex);
    recipe_table.deleteRow(row_index); // delete the row
}

/*
----------------------------------------------------------------------
Event delegation for clicking the "Delete" button
** this is a possible place to put Ethical Alternative functions **
------------------------------------------------------------------------
*/
var recipe_table = document.getElementById("recipe_table");
recipe_table.onclick = function (event) {
    var target = event.target; // get the element that was clicked in the table

    // If the target was anything except the check/delete buttons, break out of the event
    if (target.value != "Delete" && target.value != "Check") {
        return; 
    }

    // if User hit Delete, delete the ingredient from the Recipe
    else if (target.value == "Delete") {
        delete_row(target);
    }

    // if user hits check, then dynamically fill the popup modal and show the modal
    else {
        console.log("hit check"); // Otherwise the check button was clicked 
        ethical_popup(target);
        toggleModal();
    }   
}


/*
--------------------------------------------------------------------
get_recipe_components() creates an object for every ingredient added
to the recipe and adds the object to an array, all_recipe_components.
Returns all_recipe_components
-------------------------------------------------------------------
*/
function getAll_recipeComponents(){
    var all_recipe_components = [];
    var recipe_table = document.getElementById("recipe_table").firstElementChild;
    var ingredient_rows = recipe_table.children; // collection of every ingredient added to Recipe
   
    // For every ingredient added to the Recipe, get every ingredientID, amount, and measurement type
    // and push these as an object to the all_recipe_components array
    for (var i = 1; i < ingredient_rows.length; i++){
        var single_recipe_component = {ingredientID: null, amount: null, measurement_type: null};
        var entered_ingredient = ingredient_rows[i].children; // this is the collection of td elements containing the actual values

        console.log(entered_ingredient[0].firstElementChild.value);

        single_recipe_component.ingredientID = parseInt(entered_ingredient[0].firstElementChild.value); // get the ingredientID from the hidden td column
        single_recipe_component.amount = parseFloat(entered_ingredient[2].firstElementChild.value); // get the entered amount
        single_recipe_component.measurement_type = entered_ingredient[3].firstElementChild.value; // get the entered measurement type

        console.log("SINGLE COMPONENT ID: " + single_recipe_component.ingredientID);
        console.log("SINGLE COMPONENT AMOUNT: " + single_recipe_component.amount);
        console.log("SINGLE COMPONENT UNIT: " + single_recipe_component.measurement_type);

        all_recipe_components.push(single_recipe_component); // push the ingredient, now a "Recipe Component" into array
    }
    return all_recipe_components;
}


/*
------------------------------------------------------------------------
create an object containing: recipe components (ingredientID, amount, measurement type),
Recipe Name, and Recipe description.
------------------------------------------------------------------------
*/
function make_payload(){
    var payload = {recipe_name: null, recipe_components: null, recipe_description: null, user_id: null};
    payload.recipe_name = document.getElementById("recipe_name").value;
    payload.recipe_components = getAll_recipeComponents(); // get the recipe components as array of objects
    payload.recipe_description = document.getElementById("recipe_description").value;
    payload.user_id = parseInt(document.getElementById("user_id").innerHTML);


    console.log(payload);
    console.log("USER ID: " + payload.user_id);

    for (var i = 0; i < payload.recipe_components.length; i++){
        console.log("PAYLOAD ING ID: " + payload.recipe_components[i].ingredientID);
        console.log("PAYLOAD AMOUNT: " + payload.recipe_components[i].amount);
        console.log("PAYLOAD UNIT: " + payload.recipe_components[i].measurement_type);
    }

    return payload;
}



/*
------------------------------------------------------------------
postRecipe_toDB sends a POST request to the server and the body
of the request contains an object with: the Recipe Name, an array
of all Recipe Components ( ingredientID, amount, measurement type),
and the Recipe description
------------------------------------------------------------------
*/
function postRecipe_toDB(event){
    var req = new XMLHttpRequest();

    // create the payload object that will hold all new Recipe Components to be added to RecipeComponent table
    // and the Recipe Name, and Recipe description to be added to Recipe table
    var payload = make_payload();
    console.log(payload);

    req.open("POST", "/build_recipe", true);
    req.setRequestHeader("Content-Type", "application/json");

    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            
            alert(response.reg_success);
            window.location.href = "/";
            
        }
        else {
            console.log("Error in network request: " + req.statusText);
        }
    });


    /* Error handling for User not entering the recipe name 
       Do not send request if there is no recipe name or recipe components */
    if (payload.recipe_name == ""){
        // alert user and highlight empty Recipe Name input field
        var no_name = document.getElementById("recipe_name");
        no_name.style.borderColor = "red";
        no_name.style.backgroundColor = "pink";
        alert("You must enter a name for your Recipe");
    }
    else if (payload.recipe_components.length == 0){
        alert("You must enter at least one ingredient to save your Recipe");
    }
    else{
        // remove the Recipe Name properties added after an error
        // and send the POST request
        var name_exists = document.getElementById("recipe_name");
        name_exists.style.removeProperty("border-color");
        name_exists.style.removeProperty("background-color");
        req.send(JSON.stringify(payload));
        event.preventDefault();
    }
    
}


// add event listener for the creating the ingredient dropdown when user selects a food category
document.getElementById("category_choice").addEventListener("change", create_ingredient_dropdown);

// add event listener for Ingredient Form button to add ingredient to Recipe
document.getElementById("submit_ingredient").addEventListener("click", addIngredient_to_Recipe);

// bind the POST request to "Finsh Recipe" button for sending POST request to server
document.getElementById("finish_recipe_button").addEventListener("click", postRecipe_toDB);
