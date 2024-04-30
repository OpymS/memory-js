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

export {saveUser, getUsers}