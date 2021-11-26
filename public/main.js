import {
    initializeApp,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged, 
    signInWithRedirect,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getFirestore,
    onSnapshot,
    orderBy,
    query,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";
import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-storage.js";
import {
    addImage,
    clearAllImages,
    showLoginUi,
} from "/ui.js";
import {
    getCurrentTime,
    getRandomString,
} from '/utils.js';

const app = initializeApp({
    apiKey: "AIzaSyD5r8JZgJxpmLfnZ7VK1Wlvjo-eCslLY5U",
    authDomain: "mi-fabulosa-web.firebaseapp.com",
    projectId: "mi-fabulosa-web",
    storageBucket: "mi-fabulosa-web.appspot.com",
    messagingSenderId: "975124049813",
    appId: "1:975124049813:web:3a1445a0b20ee510a2909c"
});
const auth = getAuth();
const authProvider = new GoogleAuthProvider()
const db = getFirestore();
const storage = getStorage();

let currentUser = null;

onSnapshot(query(collection(db, "images"), orderBy("createdAt", "desc")), (querySnapshot) => {
    clearAllImages();
    querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        addImage(
            docSnap.id,
            data.title,
            data.owner?.name ? data.owner.name : "Invitado",
            data.owner && currentUser && data.owner.uid === currentUser.uid,
            data.image.url,
            data.image.path);
    });
});

onAuthStateChanged(auth, (user) => {
    currentUser = user
    if (user) {
        showLoginUi(user.displayName ? user.displayName : "Usuario");
    } else {
        showLoginUi();
    }
})

/**
 * deleteImage es la función que se llama cuando un usuario hace click en el
 * botón de eliminar imagen.
 * 
 * @param {string} id ID de la imagen en la base de datos.
 * @param {string} path Ruta de la imagen en el almacenamiento.
 */
export function deleteImage(id, path) {
    deleteObject(ref(storage, path));
    deleteDoc(doc(db, "images", id));
}

/**
 * logIn es la función que se llama cuando un invitado hace click en el botón
 * de iniciar sesión.
 */
export function logIn() {
    signInWithRedirect(auth, authProvider);
}

/**
 * logOut es la función que se llama cuando un usuario hace click en el botón
 * de cerrar sesión.
 */
export function logOut() {
    signOut(auth);
}

/**
 * uploadImage es la función que se llama cuando un invitado o usuario pulsan
 * el botón de Subir imagen tras rellenar el formulario.
 * 
 * Los datos se comprueban que son correctos antes de llamar a esta función.
 * 
 * @param {string} title Título de la imagen a subir.
 * @param {File} image Archivo de imagen a subir.
 */
export async function uploadImage(title, image) {
    const path = `images/${currentUser ? currentUser.uid : 'guests'}/${getRandomString()}`
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, image);

    let owner = null;
    if (currentUser) {
        owner = {
            name: currentUser.displayName,
            uid: currentUser.uid,
        };
    }
    await addDoc(collection(db, "images"), {
        title: title,
        owner: owner,
        createdAt: getCurrentTime(),
        image: {
            path: path,
            url: await getDownloadURL(fileRef),
        },
    });
}
