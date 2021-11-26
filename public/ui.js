import { deleteImage, logIn, logOut, uploadImage } from '/main.js'

/**
 * clearAllImages limpia los elementos de imagen.
 */
export function clearAllImages() {
    imageContainer.innerHTML = ""
}

/**
 * showLoginUi muestra el botón de iniciar o cerrar sesión en función de que
 * se le pase un string con el nombre de usuario.
 * 
 * @param {string|null|undefined} username Si es un string, muestra el botón
 *   de cerrar sesión. Si no, muestra el de iniciar sesión.
 */
 export function showLoginUi(username) {
    if (typeof username === "string") {
        accoutDropdown.classList.remove("d-none")
        loginBtn.classList.add("d-none")
        accoutDropdown.innerText = `Hola, ${username === "" ? "Usuario" : username}`
    } else {
        accoutDropdown.classList.add("d-none")
        loginBtn.classList.remove("d-none")
    }
}

/**
 * addImage añade un elemento imagen a la interfaz.
 * 
 * @param {string} id ID de la imagen en la base de datos.
 * @param {string} title Título de la imagen.
 * @param {string} ownerName Nombre del propietario.
 * @param {boolean} isOwner true si el usuario actual es propietario de la imagen, false si no lo es.
 * @param {string} imageUrl URL pública de la imagen.
 * @param {string} imagePath Ruta de la imagen en la base de datos.
 */
export function addImage(id, title, ownerName, isOwner, imageUrl, imagePath) {
    let col = document.createElement("div")
    col.classList.add("col-12", "col-md-6", "col-lg-4", "col-xl-3", "p-2") 
    let card = document.createElement("div")
    card.classList.add("card", "h-100", "text-white", "bg-md-dark-h4")
    col.appendChild(card)

    let img = document.createElement("img")
    img.src = imageUrl
    img.alt = title
    img.classList.add("rounded-1")
    card.appendChild(img)

    let cardBody = document.createElement("div")
    cardBody.classList.add("card-body")
    card.appendChild(cardBody)

    let titleElement = document.createElement("h5")
    titleElement.classList.add("card-title")
    titleElement.innerText = title
    cardBody.appendChild(titleElement)

    let cardText = document.createElement("p")
    cardText.innerText = `Creado por ${ownerName}`
    cardText.classList.add("one-line-text")
    cardBody.appendChild(cardText)

    if (isOwner) {
        let btn = document.createElement("a")
        btn.classList.add("d-block", "btn", "btn-danger")
        btn.textContent = "Eliminiar"
        btn.dataset.imageId = id
        btn.dataset.imagePath = imagePath
        btn.addEventListener('click', handleImageDeleteBtnClick)
        cardBody.appendChild(btn)
    }

    imageContainer.appendChild(col)
}



  /////////////////////////////////
 //// Código interno de la UI ////
/////////////////////////////////

const accoutDropdown = document.getElementById("account-dropdown")
const imageContainer = document.getElementById("image-container")
const inputFile = document.getElementById("input-file")
const inputTitle = document.getElementById("input-title")
const loginBtn = document.getElementById("login-btn")
const logoutBtn = document.getElementById("logout-btn")
const modal = new bootstrap.Modal(document.getElementById("upload-modal"), {keyboard: false})
const uploadForm = document.getElementById("upload-form")

function handleImageDeleteBtnClick(e) {
    e.preventDefault()

    const imageId = e.target.dataset.imageId
    if (!imageId) {
        throw new Error("Empty image ID")
    }
    const imagePath = e.target.dataset.imagePath
    if (!imagePath) {
        throw new Error("Empty image path")
    }

    deleteImage(imageId, imagePath)
}

loginBtn.addEventListener('click', handleLoginBtnClick)
function handleLoginBtnClick(e) {
    e.preventDefault()
    logIn()
}

logoutBtn.addEventListener('click', handleLogoutBtnClick)
function handleLogoutBtnClick(e) {
    e.preventDefault()
    logOut()
    location.reload()
}

uploadForm.addEventListener('input', handleInputTitleInput)
function handleInputTitleInput(e) {
    inputTitle.setCustomValidity(inputTitle.value.length >= 3 ? '' : "El título debe contener al menos 3 carácteres")
}
inputTitle.setCustomValidity("El título debe contener al menos 3 carácteres")

uploadForm.addEventListener('submit', handleUploadFormSubmit)
async function handleUploadFormSubmit(e) {
    e.preventDefault()
    var elements = e.target.elements;
    for (let i = elements.length - 1; i >= 0 ; i--) {
        elements[i].disabled = true;
    }
    inputTitle.disabled = true
    inputFile.disabled = true

    let title = inputTitle.value
    let file = inputFile.files[0]

    try {
        await uploadImage(title, file)
    } catch (e) {
        alert(`Error subiendo imagen: ${e}`);
        return;
    }

    for (let i = elements.length - 1; i >= 0 ; i--) {
        elements[i].disabled = false;
    }
    e.target.reset();
    modal.hide();
}
