const rp = require('request-promise')
const apiKey = ''

if (!apiKey) {
  throw 'No api key set, cannot continue'
}

function getUser (id) {
  return rp({
    url: `https://kth.test.instructure.com/api/v1/users/sis_login_id:${id}`,
    auth: {
      'bearer': apiKey
    },
    method: 'GET',
    json: true,
    headers: {
      'content-type': 'application/json'
    }
  })
}

function createUser (user) {
  return rp({
    url: `https://kth.test.instructure.com/api/v1/accounts/1/users`,
    auth: {
      'bearer': apiKey
    },
    method: 'POST',
    json: user,
    headers: {
      'content-type': 'application/json'
    }
  })
}

function createAUser () {
  const id = Math.random().toString(36)
  const user = { pseudonym: { unique_id: `${id}` },
    user: { name: 'A name',
      username: 'A username',
      email: `${id}@kth.se`,
  'sis-integration-id': id } }

  return getUser(user.pseudonym.unique_id)
    .catch(e => createUser(user))
    .then(() => getUser(user.pseudonym.unique_id)
      .catch(e => createUser(user)))
    .then(user => console.log('duplicate user successfully created', user))
    .then(createAUser)
}

createAUser()
