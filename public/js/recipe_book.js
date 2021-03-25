/*------------------------------------------------------------------------------
Description:
------------------------------------------------------------------------------*/
function show_recipes(data)
{
    //console.log(event.path[1].innerText);
    //var data = event.path[1].innerText;
    var info = {data};
    //console.log(info);
    var req = new XMLHttpRequest();

    req.open("POST", "/show_book_recipes", true);
    req.setRequestHeader("Content-Type", "application/json");

    req.addEventListener("load", function(){
        if(req.status >= 200 && req.status < 400) {
            var response = {};
            response.Name = JSON.parse(req.responseText);
            //console.log(response.Name);
            load_recipe(response.Name);
            
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
Description: This creats the buttons "books" that the user can click. If you
             pass in the int <1> it will create a button for "adding a book".
------------------------------------------------------------------------------*/
function add_button(name)
{
    var check = "+ Add New Book";
    //console.log(name);
    //console.log(name.id);
    //console.log(name.Name);
    var button_div = document.createElement("div");
    var button_name = document.createElement("div");
    
    button_div.className = "bookButton";
    button_name.className = "bookName";
        
    if((name == -1) || (name == check))
    {
        button_name.innerHTML = "+ Add New Book";
        button_div.appendChild(button_name);
        button_div.onclick = new_book;
        book_add.appendChild(button_div);
    }
    else
    {
        button_name.innerHTML = name.Name;
        button_div.appendChild(button_name);
        button_div.id = name.ID;
        book_cont.appendChild(button_div);
    }
    return button_div;
}

/*------------------------------------------------------------------------------
Description: POST request for the user to add a new recipe book.
------------------------------------------------------------------------------*/
function add_books()
{
    var info = document.getElementById("addBook").value;
    //console.log(info);
    if(info != '')
    {
        var req = new XMLHttpRequest();

        req.open("POST", "/get_books", true);
        req.setRequestHeader("Content-Type", "application/json");

        req.addEventListener("load", function(){
            if(req.status >= 200 && req.status < 400) {
                var response = {};
                response.Name = JSON.parse(req.responseText);
                //console.log(response.Name[0]);
                //response.
                add_button(response.Name[0]);
            }
            else 
            {
                console.log("Error in network request: " + req.statusText);    
            }
            
            var modal = document.getElementById("modal");
            modal.remove();
        });

        // send the POST request
        req.send(JSON.stringify({info}));
    }
    

}

/*------------------------------------------------------------------------------
Description: A general modal pop up. This creates an overlay over the entire
             page. Easily called by any function that needs a modal.
------------------------------------------------------------------------------*/
function modal_up()
{
    var body = document.getElementById("bodyContainer");
    var modal = document.createElement("div");
    modal.className = "menu_modal";
    modal.id = "modal";
    body.appendChild(modal);
    modal.onclick = function(e)
    {
        if (e.target == modal)
        {
            modal.remove(); 
        }
    };
}

/*------------------------------------------------------------------------------
Description: Creates a basic menu div in the middle of the screen. This should
             be used with modal_up(). 
------------------------------------------------------------------------------*/
function add_menu()
{
    var container = document.createElement("div");
    var container_title = document.createElement("div");
    var container_body = document.createElement("div");
    
    container.id = "menu_container";
    container_title.id ="menu_container_title";
    container_body.id ="menu_container_body";
    
    container.className = "addMenuContainer";
    container_title.className = "addMenuTitle";
    
    container.appendChild(container_title);
    container.appendChild(container_body);
    
    return container;
}

/*------------------------------------------------------------------------------
Description: When the user clicks on "add a new book" this function runs. It
             calls modal_up() and then creates a div in the center of the screen
             with information for adding a book.
------------------------------------------------------------------------------*/
function new_book()
{
    // This handles duplicate modals.
    if (document.getElementById("modal") != null)
    {
        document.getElementById("modal").remove();
    }
    
    modal_up();
    var modal = document.getElementById("modal");
    var form_cont = add_menu();
    var form_title = form_cont.childNodes[0];
    var title = document.createTextNode("Add A Book");
    var form = document.createElement("input");
    var submit = document.createElement("input");
    
    submit.setAttribute("type","submit");
    submit.onclick = add_books;

    form.type = "text";
    form.name = "addBook";
    form.id = "addBook";
    
    form.className = "addBookForm";
    
    form_title.appendChild(title);
    modal.appendChild(form_cont);
    form_cont.appendChild(form_title);
    form_cont.appendChild(form);
    form_cont.appendChild(submit);
}

/*------------------------------------------------------------------------------
Description: This will load on startup. It will eventually pull all the users
             recipe books. It also calls add_button(-1), creating an add book 
             button at the bottom.
------------------------------------------------------------------------------*/
function book_load(info)
{
    var bc = document.getElementById("myBookContainer");
    var list_cont = document.createElement("div");
    var list_title = document.createElement("div");
    list_title.className = "addMenuTitle";
    var title = document.createTextNode("My Recipe Books");
    var book_cont = document.createElement("div");
    var book_add = document.createElement("div");
    book_cont.id ="book_cont";
    book_add.id ="book_add";
    
    list_title.appendChild(title);
    list_cont.appendChild(list_title);
    list_cont.appendChild(book_cont);
    list_cont.appendChild(book_add);
    bc.appendChild(list_cont);
    
    //console.log(info);
    for(var i = 0; i < info.length; i++)
    {
        var button = add_button(info[i]);
        
        button.addEventListener('click',event =>
        {
            //console.log(event.path[1].innerText);
            show_recipes(event.path[1].innerText);
        });
    }
    
    add_button(-1);
}

/*------------------------------------------------------------------------------
Description: The sends a get request to server to pull in the users recipe book 
             information. It returns a json file.
------------------------------------------------------------------------------*/
async function get_books()
{
    var data = null;
    var req = new XMLHttpRequest();

    req.open("GET", "/get_books", true);
    req.setRequestHeader('Content-Type','application/json')
    
    req.addEventListener('load', function()
    {
        if (req.status >= 200 && req.status <= 400)
        {
            var response = JSON.parse(req.responseText);

            if(response[0] == -2)
            {
                //console.log("Not signed in");
            }
            else
            {
                book_load(response);
            }
        }
        else
        {
            console.log('Error in network request: ' + req.statusText);
        }
    });
        
    req.send(data);
}

get_books(); // for testing.
