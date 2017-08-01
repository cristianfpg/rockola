// variables e iniciaciones
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
// var sha1 = require('sha1');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://192.168.0.252:27017/rockola'); // ipcolor
// mongoose.connect('mongodb://localhost:27017/rockola');

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
  secret: 'unsecretocualquiera',
  resave: false,
  saveUninitialized: false
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// socket
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
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
  /*
  if(req.session.nombre){
    res.render('pages/Index', {nombre: req.session.nombre});
  }else{
    res.redirect('/signin');
    // var nombre = 'Tito';
    // req.session.nombre = nombre;
    // res.send('Hola usuario desconocido. De ahora en adelante te llamaremos ' + nombre);
  }
  */

  // Usuario.find({}, function(err, callback){
  //   res.render('IndexPrueba', {usuarios: callback});
  // });
  res.render('rockola', {});
});

app.get('/signin', function(req, res){
});

app.get('/signup', function(req, res){
});

app.get('/destroy',function(req, res){
  req.session.destroy();
  res.redirect('/');
});

// rutas post
app.post('/nuevousuario',urlencodedParser,function(req,res){
  var usuarioNuevo = new Usuario({
    nombre: req.body.nombre,
    email: req.body.email,
    contrasena: req.body.contrasena
  })
  usuarioNuevo.save();
  res.redirect('/');
})

app.post('/verificarusuario',urlencodedParser,function(req,res){
  Usuario.find({email: req.body.email}, function(err, callback){
    if(err){
      console.log('err');
    }else{
      if(req.body.contrasena == callback[0].contrasena){
        console.log('bien');
        req.session.nombre = callback[0].nombre;
      }else{
        console.log('mal');
      }
    }
    res.redirect('/');
  });
})

// puerto
http.listen(3000, function(){
  console.log('listening on *:3000');
});
