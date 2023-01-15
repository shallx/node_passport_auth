const authRoutes = require('./authRoutes');
const Chat = require('../Model/Chat');
const {ensureAuthenticated} = require('../config/auth');
const {initials, firstName} = require('../libs/string');
const io = require('../socket');
const expAutoSan = require('express-autosanitizer');
const videoRoutes = require('./videoRoutes');

exports.routes = (app) => {
    app.use(expAutoSan.allUnsafe);
    app.set('layout', 'layouts/layout');
    app.get('/',ensureAuthenticated, (req,res) => {
        res.render('dashboard', {
            name: req.user.name
        })
    });
    app.get('/dashboard', ensureAuthenticated, (req,res) => {
        res.render('dashboard', {
            name: req.user.name
        })
    });
    app.get('/chat', ensureAuthenticated, async(req,res) => {
        let connected_users = await Chat.find({room_id: "watchparty"});
        let users = connected_users.map(user =>initials(user.name));
        let username = firstName(req.user.name);
        if(users.findIndex(user => user == initials(req.user.name)) == -1) {
            users.push(initials(req.user.name));
        }
        res.render('chat', {username, users, extractStyles: true});
    });
    app.use(videoRoutes);
    app.use(authRoutes);
}