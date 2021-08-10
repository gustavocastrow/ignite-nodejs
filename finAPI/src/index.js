const { request } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

//Middleware
function verifyIfExistsAccountCPF(request, response, next){
  const { cpf } = request.headers;
  const customer = customers.find((customer) => customer.cpf === cpf);

  if(!customer){
    return response.status(400).json({error: "Customer not found!"})
  }
  request.customer = customer;
  return next();
}

function getBalance(statement){
  const balance = statement.reduce((acc, operation) => {
    if(operation.type === 'credit'){
      return acc + operation.amount;
    }else {
      return acc - operation.amount;
    }
  }, 0)

  return balance;
}

/*
  ->CPF: string
  ->NAME: string
  ->ID: uuid()
  ->STATEMENT: array (lancamentos conta)
*/

//Criando Account e validando CPF:
app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: 'Customer already exists!' });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

//Buscar extrato bancario
app.get('/statement', verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  return response.json(customer.statement);
});

//Realizando um desposito
app.post('/deposit', verifyIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;
  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation);
  return response.status(201).send();
});

//Realizando um saque 
app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  if(balance < amount){
    return response.status(400).json({error: "Insufficient funds!"})
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit"
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

//Busca extrato bancario por data
app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { date } = request.query;

  //formatando data
  const dateFormat = new Date(date + " 00:00");
  
  const statement = customer.statement.filter((statement) => 
    statement.created_at.toDateString() === new Date(dateFormat).toDateString())

  return response.json(statement);
});

//Atualizando a conta
app.put("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { name } = request.body;
  const { customer } = request;

  customer.name = name;

  return response.status(201).send();
});

//Obtendo os dados da conta
app.get("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer);
});

//deletando account
app.delete("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  //splice
  customers.splice(customer, 1);

  return response.status(200).json(customers);
});

//Retornando o balance 
app.get("/balance", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  const balance = getBalance(customer.statement);

  return response.json(balance);
});


app.listen(3333);

