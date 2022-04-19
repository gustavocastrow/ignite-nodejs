const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
const customers = [];

app.use(express.json());

//Middleware
function verifyIfExistsAccountCPF(request, response, next){
    const { cpf } = request.headers;
    const customer = customers.find((customer) => customer.cpf === parseInt(cpf));

    if(!customer) {
        return response.status(400).json({ error: "Customer not found!"})
    }

    request.customer = customer;
    return next();
}

app.post("/account", (request, response) => {
    const {cpf, name} = request.body;
    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

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

//app.use(verifyIfExistsAccountCPF); -> quando eu quero que todas as rotas da aplicação utilizem o middleware

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statement);
});



app.listen(3333);