import { getUsers } from "./storage.js";

const user=getUsers("presentUser")[0]
console.log(user, user.name, user.email);

const $username = document.getElementById("username")
const $email = document.getElementById("email")
const $profilForm = document.getElementById("profilForm")

$username.textContent = user.name
$email.textContent = user.email

