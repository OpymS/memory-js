const nameRegex = /^([A-Za-z'-/ ]{3,})$/;
const emailRegex = /^([a-zA-Z0-9-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,5})$/;
const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*?])(?=.*[A-Za-z])[a-zA-Z0-9!@#$%^&*?]{6,}$/;


const $contactForm = document.getElementById("contactForm");
const $inputName = document.getElementById("username");
const $errorName = document.getElementById("errorUsername");
const $inputEmail = document.getElementById("email");
const $errorEmail = document.getElementById("errorEmail");
const $inputPassword = document.getElementById("password");
const $errorPassword = document.getElementById("errorPassword");
const $errorPasswordLetter = document.getElementById("errorPasswordLetter");
const $errorPasswordNumber = document.getElementById("errorPasswordNumber");
const $errorPasswordSpecial = document.getElementById("errorPasswordSpecial");
const $errorPasswordLength = document.getElementById("errorPasswordLength");
const $inputConfirm = document.getElementById("confirm")
const $errorConfirm = document.getElementById("errorConfirm")

const user = {}

let isOkName = false;
let isOkEmail = false;
let isOkPassword = false;
let isOkConfirm = false;

$inputName.addEventListener("blur", function () {
  if (validateName(this.value)) {
    $errorName.textContent = "";
    isOkName = true;
  } else {
    $errorName.textContent =
      "Choisissez un pseudo contenant au moins 3 caractères";
    isOkName = false;
  }
});

$inputEmail.addEventListener("blur", function () {
  if (validateEmail(this.value)) {
    $errorEmail.textContent = "";
    isOkEmail = true;
  } else {
    $errorEmail.textContent =
      "Entrez un email valide";
    isOkEmail = false;
  }
});

$inputPassword.addEventListener("input", function () {
  $errorPassword.textContent =
    "Au moins "
  $errorPasswordLetter.textContent =
    "1 lettre (majuscule ou minuscule), ";
  $errorPasswordNumber.textContent =
    "1 nombre, ";
  $errorPasswordSpecial.textContent =
    "1 caractère spécial, ";
  $errorPasswordLength.textContent =
    "ainsi que 6 caractères minimum.";
  if (validatePassword(this.value)) {
    $errorPassword.textContent = "Mot de passe OK";
    $errorPassword.classList.remove("error");
    $errorPassword.classList.add("success");
    setTimeout(() => {
      $errorPassword.textContent = "";
    }, 3000);
    $errorPasswordLetter.textContent = "";
    $errorPasswordNumber.textContent = "";
    $errorPasswordSpecial.textContent = "";
    $errorPasswordLength.textContent = "";
    isOkPassword = true;
  } else {
    if (this.value.length >= 8) {
      $errorPasswordLength.classList.remove("error");
      $errorPasswordLength.classList.add("success");
    } else {
      $errorPasswordLength.classList.remove("success");
      $errorPasswordLength.classList.add("error");
    }
    if (this.value.match(/(?=.*[A-Za-z])/)) {
      $errorPasswordLetter.classList.remove("error");
      $errorPasswordLetter.classList.add("success");
    } else {
      $errorPasswordLetter.classList.remove("success");
      $errorPasswordLetter.classList.add("error");
    }
    if (this.value.match(/(?=.*[0-9])/)) {
      $errorPasswordNumber.classList.remove("error");
      $errorPasswordNumber.classList.add("success");
    } else {
      $errorPasswordNumber.classList.remove("success");
      $errorPasswordNumber.classList.add("error");
    }
    if (this.value.match(/(?=.*[!@#$%^&*?])/)) {
      $errorPasswordSpecial.classList.remove("error");
      $errorPasswordSpecial.classList.add("success");
    } else {
      $errorPasswordSpecial.classList.remove("success");
      $errorPasswordSpecial.classList.add("error");
    }
    isOkPassword = false;
  }
});

$inputConfirm.addEventListener("blur", function () {
  if (this.value == $inputPassword.value) {
    $errorConfirm.textContent = "";
    isOkConfirm = true;
  } else {
    $errorConfirm.textContent =
      "Il y a une différence entre vos 2 mots de passe";
    isOkConfirm = false;
  }
});

$contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  // Ces lignes pour gérer les éléments pré-remplis
  isOkName = validateName($inputName.value)
  isOkEmail = validateEmail($inputEmail.value)
  isOkPassword = validateEmail($inputPassword.value)
  isOkConfirm = ($inputConfirm.value == $inputPassword.value)
  if (isOkName && isOkEmail && isOkPassword && isOkConfirm) {
    user.name = $inputName.value
    user.email = $inputEmail.value
    user.password = $inputPassword.value
  }else{
    alert("Erreur. Veuillez ressaisir les éléments.")
    $contactForm.reset()
  }
})

function saveUser(key, item) {
  console.log("save");
  const users = getUsers(key)
  console.log(users);
  let unicUser = true
  users.forEach(user => {
    if (user.email == item.email) {
      alert(`L'email ${user.email} est déjà utilisé. Veuillez en choisir un autre`)
      unicUser=false
    } else if (user.name == item.name) {
      alert(`Le pseudo ${user.name} est déjà utilisé. Veuillez en choisir un autre`)
      unicUser=false
    }
  })
  if (unicUser) {
    console.log("unique");
    users.push(item)
    localStorage.setItem(key, JSON.stringify(users))
  };
}

function getUsers(key) {
  const users = JSON.parse(localStorage.getItem(key)) || []

  return users
}

function validateName(name) {
  if (name.match(nameRegex)) {
    return true
  } else {
    return false
  }
}

function validateEmail(email) {
  if (email.match(emailRegex)) {
    return true
  } else {
    return false
  }
}

function validatePassword(password) {
  if (password.match(passwordRegex)) {
    return true
  } else {
    return false
  }
}

