const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const customers = [];

app.use(express.json());

//Criando um conta
//CPF -> string
//NAME -> string
//ID -> uuid
//Statement -> [] (extrato da conta)

app.post("/account", (request, response) => {
    const {cpf, name} = request.body;
    const customerAlreadyExists = customers.some((customer) => customer.cpf = cpf);

    if(customerAlreadyExists){
        return response.status(400).json({error: "Customers already exists!"});
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return response.status(201).send();
});

//Buscando extrato bancario de um cliente
app.get("/statement/:cpf", (request, response) => {
    const { cpf } = request.params;

    //const customer = customers.find((customer) => customer.cpf == cpf);
    const customer = customers.find((customer) => customer.cpf === parseInt(cpf));

    return response.json(customer.statement);
});



app.listen(3333);