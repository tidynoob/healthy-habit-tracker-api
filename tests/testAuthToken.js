const axios = require('axios')

const options = {
  method: 'GET',
  url: 'http://localhost:3500/users',
  headers: {
    authorization:
      'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVfbXotYWdGOHg3Qi1QM01UZXFnNyJ9.eyJpc3MiOiJodHRwczovL2Rldi1wNHc3c3YxaWdma3R1em44LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJiZjJoSDNvd2N6UFZXMElpZklCOWd3bzRma0Nva2JjYkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9oZWFsdGh5LWhhYml0LXRyYWNrZXIuY29tIiwiaWF0IjoxNjc1ODk4OTI5LCJleHAiOjE2NzU5ODUzMjksImF6cCI6ImJmMmhIM293Y3pQVlcwSWlmSUI5Z3dvNGZrQ29rYmNiIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.Hv37CHjuGgtTWqLc-itQrUEx_h8EwLxa2RD4MUn1uuSK5gPreLHCwpJ_bNMQ8XYzQEWs0BN6a7JvleX-uzBJc9hWxUEZE1aPYDAKtfFxK1BHoHBBHLLLvHJQ7xuA770KawGWlQvKpZ-zMzddo6AotHAns5ACa5WM08FkiQwKPhXGIsH9XE47Zrm7g0YX2895xyfHhjJPsb7gQtRNqYAeKoKHwytGSvXVjbbGM-4ofV4Jyj9-qly6tRp5IdBrCWLLnFO8RsicjfGnzCf9-S9u0gD21ohtmywZjwUjfmGHmR1_47-_O3WLoKP34Ame9P6FS2nM2RqaK8oHPsg1JqXm8w'
  }
}

axios(options)
  .then((response) => {
    console.log(response.data)
  })
  .catch((error) => {
    console.log(error)
  })
