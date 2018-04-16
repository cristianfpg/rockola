// variables e iniciaciones
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var sha1 = require('sha1');

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/rockola',{useMongoClient: true});

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
  secret: 'secreto_cualquiera',
  resave: true,
  saveUninitialized: true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function(){
  
});

var tituloDefault = 'Título por defecto del servidor.';
var urlDefault = '_Uie2r5wWxw';
var urlActual;
var tiempoActual = 0;
var tiempoTotal = 120;
var calcTiempo;

io.on('connection', function(socket){
  /*
  socket.on('update playlist', function(){
    io.emit('update playlist');
  });
  socket.on('tiempo actual', function(msg){
    cancionActualFunc(function(err, callback){
      urlActual = callback.url;
      io.emit('tiempo actual', {tiempoActual: tiempoActual, urlActual: urlActual});
    })
  });
  */
});

var songSchema = mongoose.Schema({
  keyid: {type: String, required: true, unique: true},
  duration: {type: Number, required: true},
  titulo: {type: String, default: tituloDefault},
  cthumbnail: {type: String, default: ''},
  sthumbnail: {type: String, default: ''},
  playlist: {type: Boolean, default: true}
});
var Song = mongoose.model('Song', songSchema);

// endpoints y rutas
app.get('/', function(req, res){
  res.render('rockola');
});

app.post('/agregaraplaylist',function(req,res){
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});