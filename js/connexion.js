import { getUsers, connectUser } from "./storage.js";
// import { vibrate } from "./inscription.js"

const $email = document.getElementById("email")
const $password = document.getElementById("password")
const $contactForm = document.getElementById("contactForm")
const $vibrat = document.getElementById('vibrate')
let email, password

$contactForm.addEventListener("submit", function(event){
    event.preventDefault();
    email = $email.value
    password = $password.value
    let check = checkUser(email, password)
})

function checkUser(email, password) {
    const users = getUsers("users")
    let connectedUser
    let connected = false
    users.forEach(user => {
        if (user.email == email && user.password == password) {
            connected=true;
            connectedUser = user
            // break;  dommage, break ne fonctionne pas avec le foreach
        }    
    });
    if (connected) {
        alert(`L'utilisateur ${email} est connecté.`)
        connectUser(connectedUser)
        location="profil.html"
    }else{
        vibrate($vibrat)
        alert("Erreur. Veuillez saisir les informations correctement")
    }
}

function vibrate(elem) {
  elem.classList.remove("vibrate")
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      elem.classList.add("vibrate")
    })
  })
}