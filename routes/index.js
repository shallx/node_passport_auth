const authRoutes = require('./authRoutes');
const Chat = require('../Model/Chat');
const expAutoSan = require('express-autosanitizer');
const {ensureAuthenticated} = require('../config/auth');
const {initials, firstName} = require('../libs/string');
const io = require('../socket');

exports.routes = (app) => {
    app.use(expAutoSan.allUnsafe);
    app.set('layout', 'layouts/layout');
    app.get('/', (req,res) => res.render('welcome'));
    app.get('/welcome', (req,res,next) => res.render('welcome'));
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
    app.get('/video', ensureAuthenticated, async(req,res,next) => {
        let connected_users = await Chat.find({room_id: "watchparty"});
        let users = connected_users.map(user =>initials(user.name));
        let username = firstName(req.user.name);
        if(users.findIndex(user => user == initials(req.user.name)) == -1) {
            users.push(initials(req.user.name));
        }
        res.render('video', {username, users, extractStyles: true});
    })
    app.use(authRoutes);
}