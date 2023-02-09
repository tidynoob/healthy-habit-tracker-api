const axios = require('axios')

async function getToken() {
  try {
    const res = await axios.post(
      'https://dev-p4w7sv1igfktuzn8.us.auth0.com/oauth/token',
      {
        client_id: 'bf2hH3owczPVW0IifIB9gwo4fkCokbcb',
        client_secret:
          '7tK0W27qxdT8SQulxVb9ff7ofyNLPKlv4j_v_wS-SBr5scz2vTuGddde2mefF8n2',
        audience: 'https://healthy-habit-tracker.com',
        grant_type: 'client_credentials'
      },
      {
        headers: {
          'content-type': 'application/json'
        }
      }
    )

    console.log(res.data)
  } catch (error) {
    console.error(error)
  }
}

getToken()
