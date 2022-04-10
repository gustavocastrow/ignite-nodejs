const express = require('express');
const app = express();

app.get("/courses", (request, response) => {
    return response.json([
        "Curso 01",
        "Curso 02",
        "Curso 03"
    ]);
});

app.post("/courses", (request, response) => {
    return response.json([
        "Curso 01",
        "Curso 02",
        "Curso 03",
        "Curso 04",
    ]);
});

app.put("/courses/:id", (request, response) => {
    return response.json([
        "Curso 06",
        "Curso 02",
        "Curso 03",
        "Curso 04",
    ]);
});

app.patch("/courses/:id", (request, response) => {
    return response.json([
        "Curso 06",
        "Curso 07",
        "Curso 03",
        "Curso 04",
    ]);
});

app.delete("/courses/:id", (requeste, response) => {
    return response.json([
        "Curso 06",
        "Curso 02",,
        "Curso 04",
    ]);
});


app.listen(3333)