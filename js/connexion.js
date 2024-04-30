import { getUsers } from "./storage.js";

const $email = document.getElementById("email")
const $password = document.getElementById("password")
const $contactForm = document.getElementById("contactForm")
let email, password

$contactForm.addEventListener("submit", function(event){
    event.preventDefault();
    email = $email.value
    password = $password.value
    let check = checkUser(email, password)
})

function checkUser(email, password) {
    const users = getUsers("users")
    let connected = false
    users.forEach(user => {
        if (user.email == email && user.password == password) {
            connected=true;
            // break;  dommage, break ne fonctionne pas avec le foreach
        }    
    });
    if (connected) {
        alert(`L'utilisateur ${email} est connecté.`)
    }else{
        alert("Erreur. Veuillez saisir les informations correctement")
    }
}