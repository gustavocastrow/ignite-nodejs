const express = require('express');

const app = express();

app.get("/", (request, response) => {
  return response.json({message: "Hello World Ignite!"})
})

//request: recebendo da req
//response: retorno da req.


//localhost:3333
app.listen(3333);

