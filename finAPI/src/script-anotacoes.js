const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json()); //Middleware para recebimento de JSON

const customers = [];

/*
Dados Account:
cpf -> string
name -> string
id -> UUID
statement(extrato acc) -> array[]
*/

//1º Requisito
app.post("/account", (request, response) => {
  const { cpf, name } = request.body; //Pois vamos receber uma inserção de dados

  //Validando se existe um usuário cadastrado via validação CPF.
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  ); //some() -> faz uma busca, retornando verdadeiro ou falso para a condição que for informada

  if(customerAlreadyExists) {
    return response.status(400).json({error: "Customer already exists!"})
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  });

  return response.status(201).send();
});

//2º Requisito 
app.get("/statement", (request, response) => {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);
  
  if(!customer){
    return response.status(400).json({error:"Customer not found!"})
  }

  return response.json(customer.statement);

});



app.listen(3333);