const authRoutes = require('./authRoutes');
const expAutoSan = require('express-autosanitizer');

exports.routes = (app) => {
    app.use(expAutoSan.allUnsafe)
    app.get('/', (req,res) => res.render('welcome'));
    app.use(authRoutes);
    // app.use('/user', userRoutes);
}