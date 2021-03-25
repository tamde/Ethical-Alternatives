/*------------------------------------------------------------------------------
Description: 
------------------------------------------------------------------------------*/
function add_to_book(id,book)
{
    //console.log(id,book);
    var info = {id,book};
    //console.log(info);
    var req = new XMLHttpRequest();

    req.open("POST", "/add_to_book", true);
    req.setRequestHeader("Content-Type", "application/json");

    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400) {
            var response = {};
            response.Name = JSON.parse(req.responseText);
            //console.log(response.Name[0]);
            //response.
            //add_button(response.Name[0]);
        }
        else 
        {
            console.log("Error in network request: " + req.statusText);    
        }
    });

    // send the POST request
    req.send(JSON.stringify({info}));
}

/*------------------------------------------------------------------------------
Description: Recipe card menu options. When you click the plus sign on the 
             card to save it, it looks to see if the user is logged in by
             checking the My Recipe Books section of the page. If they have
             anything in there, then they are logged in. It then populates the
             menu with a list of books the user has. The user can add a new book
             as well.
------------------------------------------------------------------------------*/
function options_menu(info)
{
    //console.log(info);
    var check = document.getElementById("myBookContainer");

    if(check.childNodes.length < 2)
    {
        // No books in the book shelf. User is probably a guest or hasnt
        // signed in yet. This should redirect them to the login screen.
       
    }
    else
    {
        modal_up(); // calls function from recipe_book.js
        var modal = document.getElementById("modal");
        var menu_cont = add_menu();
        var title_text = document.createTextNode("Add Recipe To A Book");
        
        modal.appendChild(menu_cont);
        menu_cont.childNodes[0].appendChild(title_text);
        
        var menu_body = menu_cont.childNodes[1];
        var books = document.getElementById("book_cont");
        
        for (var i = 0; i < books.childNodes.length; i++)
        {
            var holder = {};
            holder.Name = books.childNodes[i].innerText;
            holder.ID = books.childNodes[i].id;

            var select_name = add_button(holder);
            
            select_name.addEventListener('click',event =>{
                var modal = document.getElementById("modal");
                info.path[1].childNodes[0].style.opacity = "1";
                info.path[1].childNodes[1].style.display = "none";
                add_to_book(info.path[3].id, event.path[0].innerText);
                modal.remove(select_name);
            });
            
            menu_body.appendChild(select_name);
        }
        
        menu_body.appendChild(add_button(-1));
    }
}

/*------------------------------------------------------------------------------
Description: This creates a div inside recipe picture div. This div holds the
             menu plus sign and the check mark when the user saves the recipe.
------------------------------------------------------------------------------*/
function add_option_button()
{
    var optionDiv = document.createElement("div");
    var checkContainer = document.createElement("div");
    var menuContainer = document.createElement("div");
    
    optionDiv.className ="optionContainer";
    menuContainer.className ="optionPlus";
    checkContainer.className ="checkMark";
    
    menuContainer.addEventListener('click',event =>{
        options_menu(event);
    });
    
    optionDiv.appendChild(checkContainer);
    optionDiv.appendChild(menuContainer);
    
    return optionDiv;
}

/*------------------------------------------------------------------------------
Description:
------------------------------------------------------------------------------*/
function show_recipe_details(info,name,desc)
{
    console.log(info);
    
    modal_up(); // calls function from recipe_book.js
    var modal = document.getElementById("modal");
    var menu_cont = add_menu();
    menu_cont.className = "showRecipeInformation";
    
    var title_text = document.createTextNode(name);
    var desc_text = document.createTextNode(desc);
    
    var descCont = document.createElement("div");
    var listCont = document.createElement("div");
    descCont.className = "showRecipeDescription";
    listCont.className = "showRecipeList";
    
    var altCont = document.createElement("div");
    altCont.className = "showAltList";
    var altTitle = document.createTextNode("Here are some ethical alternatives");
    altCont.appendChild(altTitle);
    
    
    menu_cont.childNodes[0].appendChild(title_text);
    menu_cont.childNodes[1].appendChild(descCont);
    menu_cont.childNodes[1].appendChild(listCont);
    menu_cont.childNodes[1].appendChild(altCont);
    descCont.appendChild(desc_text);
    
    var list = document.createElement("ul");
    var altList = document.createElement("ul");
    
    for (var i = 0; i < info.length; i++)
    {
        var tooltip = document.createElement("div");
        tooltip.className = "tooltip";
        
        var tooltiptext = document.createElement("span");
        tooltiptext.className = "tooltiptext";
        tooltiptext.innerText = info[i].EthicalDescription;
        
        tooltip.appendChild(tooltiptext);
        
        var bullet = document.createElement("li");
        var ingName = document.createTextNode(info[i].Name + " ");
        var ingAmount = document.createTextNode(" " + info[i].Amount + " ");
        var ingMeasure = document.createTextNode(info[i].MeasurementType + " ");
        
        if (info[i].IsEthical == 0)
        {
            var altBullet = document.createElement("li");
            var altIng = document.createTextNode(info[i].Alt[0].Name);
            altBullet.appendChild(altIng)
            altCont.appendChild(altBullet);
            //console.log(info[i].Alt[0].Name);
        }

        bullet.appendChild(tooltip);
        tooltip.appendChild(ingName);
        bullet.appendChild(ingAmount);
        bullet.appendChild(ingMeasure);
        list.appendChild(bullet);
    }
    
    listCont.appendChild(list);
    
    //descCont.appendChild(descCont);
    modal.appendChild(menu_cont);
    
}

/*------------------------------------------------------------------------------
Description:
------------------------------------------------------------------------------*/
function get_recipe_details(info,name,desc)
{
    //console.log(info);
    //get_recipe_details
    var data = info;
    var req = new XMLHttpRequest();

    req.open("GET", "/get_recipe_details?id=" + info, true);
    req.setRequestHeader('Content-Type','application/json')
    
    req.addEventListener('load', function()
    {
        if (req.status >= 200 && req.status <= 400)
        {
            var response = JSON.parse(JSON.parse(req.responseText).results);
            show_recipe_details(response, name, desc);
        }
        else
        {
            console.log('Error in network request: ' + req.statusText);
        }
    });
        
    req.send(info);
}

/*------------------------------------------------------------------------------
Description: This function dynamically makes the recipe card.
------------------------------------------------------------------------------*/
function make_card(info, num)
{
    //console.log(info[num].ID);
    var cardDiv = document.createElement("div");
    var picDiv = document.createElement("div");
    var nameDiv = document.createElement("div");
    var rateDiv = document.createElement("div");
    var descDiv = document.createElement("div");
    var authDiv = document.createElement("div");
    
    //adding correct classes to each div.
    cardDiv.className ="recipeCard";
    picDiv.className ="foodPhoto";
    nameDiv.className ="foodName";
    descDiv.className ="foodDescription";
    authDiv.className ="foodAuthor";
    
    cardDiv.id = info[num].ID;
    
    var optionsDiv = add_option_button();

    
    cardDiv.appendChild(picDiv);
    cardDiv.appendChild(nameDiv);
    cardDiv.appendChild(descDiv);
    cardDiv.appendChild(authDiv);
    picDiv.appendChild(optionsDiv);
    
    //This will be deleted once we are hoooked up to the Database.
/*     var testName = document.createTextNode("Recipe Name");
    var testAuth = document.createTextNode("By: Author");
    var testDesc = document.createTextNode("A Test Description."); */
    var testName = document.createTextNode(info[num].Name);
    var testAuth = document.createTextNode("By: Author");
    var testDesc = document.createTextNode(info[num].Description);
    
    nameDiv.appendChild(testName);
    authDiv.appendChild(testAuth);
    descDiv.appendChild(testDesc);
    
    picDiv.addEventListener('click',event =>{
        get_recipe_details(event.path[2].id,info[num].Name,info[num].Description);
    });
    
/*     .addEventListener('click',event =>{
    show_recipe_details(event.path[0]);
    }); */
    
    return cardDiv;
}

/*------------------------------------------------------------------------------
Description:
------------------------------------------------------------------------------*/
function random_recipe_info()
{
    var data = null;
    var req = new XMLHttpRequest();

    req.open("GET", "/random_recipe_info", true);
    req.setRequestHeader('Content-Type','application/json')

    req.addEventListener('load', function()
    {
        if (req.status >= 200 && req.status <= 400)
        {
            var response = JSON.parse(req.responseText);
            //console.log(response);
            load_recipe(response);
        }
        else
        {
            console.log('Error in network request: ' + req.statusText);
        }
    });

    req.send(data);
}

/*------------------------------------------------------------------------------
Description: This function loads up and start the creation process for the
             recipe cards. This should run as soon as the page opens up.
------------------------------------------------------------------------------*/
function load_recipe(info)
{
    if(info == null)
    {
        info = random_recipe_info();
    }

    var parentDiv = document.getElementById("cardRow");
    while (parentDiv.hasChildNodes())
    {
        parentDiv.removeChild(parentDiv.firstChild);
    }

    for (var i = 0; i < info.length; i++)
    {
        var card = make_card(info,i);
        parentDiv.appendChild(card);
    }
}

load_recipe(); // for testing
