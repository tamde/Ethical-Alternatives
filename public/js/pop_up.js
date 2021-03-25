var modal = document.querySelector(".modal");
var ingredientButton = document.querySelectorAll(".ingredientButton");
var closeButton = document.querySelector(".close-button");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}


for (let i = 0; i < ingredientButton.length; i++) {
    ingredientButton[i].addEventListener("click", toggleModal);
}
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);