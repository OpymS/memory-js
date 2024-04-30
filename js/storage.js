function saveUser(key, item) {
  const users = getUsers(key)
  let unicUser = true
  users.forEach(user => {
    if (user.email == item.email) {
      alert(`L'email ${user.email} est déjà utilisé. Veuillez en choisir un autre`)
      unicUser=false
    } else if (user.name == item.name) {
      alert(`Le pseudo ${user.name} est déjà utilisé. Veuillez en choisir un autre`)
      unicUser=false
    }
    return false
  })
  if (unicUser) {
    users.push(item)
    localStorage.setItem(key, JSON.stringify(users))
    return true
  };
}

function getUsers(key) {
  const users = JSON.parse(localStorage.getItem(key)) || []

  return users
}

function connectUser(user){
    const presentUser=[]
    presentUser.push(user)
    localStorage.setItem("presentUser", JSON.stringify(presentUser))
}

export {saveUser, getUsers, connectUser}