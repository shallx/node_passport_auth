const { Router } = require('express');

exports.routes = (app) => {
    app.get('/', (req,res) => res.send('Home Page'));
}