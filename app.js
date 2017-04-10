// variables e iniciaciones
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var sha1 = require('sha1');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://192.168.0.100:27017/rockola');

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
  secret: 'dejelofijo',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'jsx');
var options = { doctype: '<!DOCTYPE html>' };
app.engine('jsx', require('express-react-views').createEngine(options));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// socket
io.on('connection', function(socket){
  console.log('io');
});

// mongoose
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // console.log('conectado')
}); 

var usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  contrasena: {
    type: String,
    required: true
  }
});
var Usuario = mongoose.model('Usuario', usuarioSchema);

// var usuarioNuevo = new Usuario({
//   nombre: 'Cristian Pacheco',
//   email: 'desarrollo1@coloralcuadrado.com',
//   contrasena: 'c2'
// })
// usuarioNuevo.save();

// rutas get
app.get('/', function(req, res){
  if(req.session.nombre){
    // res.send('Hola ' + req.session.nombre);
  }else{
    res.redirect('/signin');
    // var nombre = 'Tito';
    // req.session.nombre = nombre;
    // res.send('Hola usuario desconocido. De ahora en adelante te llamaremos ' + nombre);
  }
  // Usuario.find({}, function(err, callback){
  //   res.render('IndexPrueba', {usuarios: callback});
  // });
});
app.get('/signin', function(req, res){
  res.render('pages/SignIn', {prueba: 'listo!'});
});


// rutas post
app.post('/nuevousuario',urlencodedParser,function(req,res){
  var usuarioNuevo = new Usuario({
    nombre: req.body.nombre,
    email: req.body.email
  })
  usuarioNuevo.save();
  res.redirect('/');
})

app.post('/verificarusuario',urlencodedParser,function(req,res){
  console.log(req.body.email);
  console.log(req.body.contrasena);
  // Usuario.find({email: req.body.email}, function(err, callback){
  //   if(err){
  //     res.end();
  //     console.log('err');
  //   }else{
  //     if(req.body.contrasena == callback[0].contrasena){
  //       console.log('bien');
  //       res.send('contraseña correcta');
  //     }else{
  //       console.log('mal');
  //       res.send('mal');
  //     }
  //   }
  // });
})

// puerto
http.listen(3000, function(){
  console.log('listening on *:3000');
});