import { deleteImage, logIn, logOut, uploadImage } from '/main.js'
const accoutDropdown = document.getElementById("account-dropdown")
const imageContainer = document.getElementById("image-container")
const inputFile = document.getElementById("input-file")
const inputTitle = document.getElementById("input-title")
const loginBtn = document.getElementById("login-btn")
const logoutBtn = document.getElementById("logout-btn")
const modal = new bootstrap.Modal(document.getElementById("upload-modal"), {keyboard: false})
const uploadForm = document.getElementById("upload-form")

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

export function clearAllImages() {
    imageContainer.innerHTML = ""
}

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


export function showLoginUi(username) {
    if (username || username === "") {
        accoutDropdown.classList.remove("d-none")
        loginBtn.classList.add("d-none")

        accoutDropdown.innerText = `Hola, ${username === "" ? "Usuario" : username}`
    } else {
        accoutDropdown.classList.add("d-none")
        loginBtn.classList.remove("d-none")
    }
}