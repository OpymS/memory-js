function saveUser(key, item) {
  const users = getUsers(key)
  let unicUser = true
  users.forEach(user => {
    if (user.email == item.email) {
      alert(`L'email ${user.email} est déjà utilisé. Veuillez en choisir un autre`)
      unicUser = false
    } else if (user.name == item.name) {
      alert(`Le pseudo ${user.name} est déjà utilisé. Veuillez en choisir un autre`)
      unicUser = false
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

function connectUser(user) {
  const presentUser = []
  presentUser.push(user)
  sessionStorage.setItem("presentUser", JSON.stringify(presentUser))
}

function getPresentUser(key) {
  const users = JSON.parse(sessionStorage.getItem(key)) || []

  return users
}

function updateUser(user) {
  connectUser(user)
  const users = getUsers("users")
  for (let i = 0; i < users.length; i++) {
    const element = users[i];
    if (element.name == user.name) {
      users.splice(i, 1)
      users.push(user)
    }

  }
  localStorage.setItem("users", JSON.stringify(users))
}

function getBestScores() {
  const scores = JSON.parse(localStorage.getItem("scores")) || []
  return scores
}

function updateScores(scores) {
  localStorage.setItem("scores", JSON.stringify(scores))
}

export { saveUser, getUsers, connectUser, getPresentUser, updateUser, getBestScores, updateScores }