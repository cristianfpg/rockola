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
  secret: 'unsecreto_cualquiera',
  resave: false,
  saveUninitialized: true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // conectado
});

io.on('connection', function(socket){
  socket.on('update playlist', function(){
    io.emit('update playlist');
  });
  socket.on('tiempo actual', function(msg){
    cancionActualFunc(function(err, callback){
      urlActual = callback.url;
      io.emit('tiempo actual', {tiempoActual: tiempoActual, urlActual: urlActual});
    })
  });
  socket.on('sesiones', function(){
    console.log('sessiones console.log');
  });
});

var usuarioSchema = mongoose.Schema({
  nombre: {type: String, required: true, unique: true},
  contrasena: {type: String, required: true},
  reproducciones: {type: Number, default: 0},
  omisiones: {type: Number, default: 0}
});

var songSchema = mongoose.Schema({
  titulo: {type: String, required: true},
  url: {type: String, required: true, unique: true},
  thumbnail: {type: String, required: true},
  idplaylist: {type: Number, required: true},
  activa: {type: Boolean, default: true},
  likes: {type: Number, default: 0},
  dislikes: {type: Number, default: 0},
  duracion: {type: Number, default: 0}
});

var optionSchema = mongoose.Schema({
  key: {type: String, required: true, unique: true},
  settings: {type: {}, default: {}}
});

var Usuario = mongoose.model('Usuario', usuarioSchema);
var Song = mongoose.model('Song', songSchema);
var Option = mongoose.model('Option', optionSchema);

// funciones
var nombreDefault = 'cristian';
var contrasenaDefault = sha1('laCONTRAseñaMA54465DIFciil');
var tituloDefault = 'no hay canciones en la playlist de color';
var urlDefault = '_Uie2r5wWxw';
var thumbDefault = 'http://cdn01.ib.infobae.com/adjuntos/162/imagenes/014/014/0014014674.jpg';
var urlActual;
var tiempoActual = 0;
var tiempoTotal = 120;
var calcTiempo;

// var usuarioNuevo = new Usuario({
//   nombre: nombreDefault,
//   contrasena: contrasenaDefault
// })
// usuarioNuevo.save();
//
// songNuevaFunc({
//   titulo: tituloDefault,
//   url: urlDefault,
//   thumbnail: thumbDefault,
//   idplaylist : 0,
//   duracion: tiempoTotal
// });
//
// var option = new Option({
//   key: 'votacion',
//   settings: {}
// });
// option.save();
//
// var option = new Option({
//   key: 'sesiones',
//   settings: []
// });
// option.save();


function songNuevaFunc(data){
  var songNueva = new Song({
    titulo: data.titulo,
    url: data.url,
    thumbnail: data.thumbnail,
    idplaylist: data.idplaylist,
    duracion: data.duracion
  })
  songNueva.save();
}

function contadorFunc(fin){
  tiempoActual = 0;
  clearInterval(calcTiempo);
  calcTiempo = setInterval(function(){ myTimer() }, 1000);
  function myTimer() {
    tiempoActual++;
    if(tiempoActual > fin ) {
      clearInterval(calcTiempo);
      cambioCancionFunc();
    }
  }
}

function cancionActualFunc(response){
  Song.findOne({activa: true}).sort({created_at: -1}).exec(function(err, callback) {
    response(err, callback);
  });
}

function cambioCancionFunc(){
  cancionActualFunc(function(err, callback){
    Song.update({url: callback.url},{$set:{ activa: false }},function(err, callback){
      cancionActualFunc(function(err, callback){
        if(callback){
          io.emit('tiempo actual', {tiempoActual: 0, urlActual: callback.url});
          io.emit('update playlist');
          cancionActualFunc(function(err, callback){
            contadorFunc(callback.duracion)
          })
        }else{
          Song.update({url: urlDefault},{$set:{ activa: true }},function(err, callback){
            io.emit('tiempo actual', {tiempoActual: 0, urlActual: urlDefault});
            io.emit('update playlist');
            cancionActualFunc(function(err, callback){
              contadorFunc(callback.duracion)
            })
          })
        }
      })
    });
  })
}

cancionActualFunc(function(err, callback){
  contadorFunc(callback.duracion)
})

// endpoints y rutas
app.get('/', function(req, res){
  req.session.nombre ? res.render('rockola') : res.redirect('/signin');
});

app.get('/signin',function(req,res){
  req.session.nombre ? res.redirect('/') : res.render('signin');
})

app.get('/logout',function(req,res){
  req.session.destroy();
  delete req.session;
  res.redirect('/signin');
})

app.post('/validarSignin',function(req,res){
  var reqNombre = req.body.nombre;
  var reqContrasena = sha1(req.body.contrasena);
  Option.find({key: 'sesiones'},function(err, callback){
    var getSettings = callback[0];
    var arrayy = ['cambio','segundo'];
    var arrayy2 = callback[0].settings;
    console.log(arrayy);
    console.log(arrayy2);
    // getSettings.settings = arrayy;
    // getSettings.save();
    res.json(callback);
  })
  // Usuario.find({nombre: reqNombre},function(err, callback){
  //   if(callback[0]){
  //     if(reqContrasena == callback[0].contrasena){
  //       req.session.nombre = reqNombre;
  //       res.redirect('/');
  //     }else{
  //       res.json('q hace?! wtf??')
  //     }
  //   }else{
  //     res.json('q hace?! wtf??')
  //   }
  // })
})

app.get('/cambiocancion',function(req,res){
  cambioCancionFunc();
  res.json({respuesta: 'cambio'});
})

app.post('/voto',function(req,res){
  // Option.find({key: 'votacion'},function(err, callback){
  //   var getSettings = callback[0];
  //   getSettings.settings.urlActual = req.body.url;
  //   getSettings.save();
  //   res.json(callback);
  // })
})

app.get('/verplaylist',function(req,res){
  Song.find({activa: true},function(err, callback){
    var porid = callback;
    porid.sort(function(a,b) {
      return a.idplaylist - b.idplaylist;
    });
    res.json(porid);
  })
})

app.post('/agregaraplaylist',function(req,res){
  Song.find({},function(err, callback){
    var porid = callback;
    porid.sort(function(a,b) {
      return a.idplaylist - b.idplaylist;
    });
    var lengthSongs = porid[porid.length - 1].idplaylist +1;
    Song.find({url: req.body.url},function(err, callback){
      if(err){
        res.json({respuesta: 'error'});
      }else{
        if(callback.length == 0) {
          songNuevaFunc({
            titulo: req.body.titulo,
            url: req.body.url,
            thumbnail: req.body.thumbnail,
            idplaylist: lengthSongs,
            duracion: req.body.duracion
          });
          res.json({respuesta: 'creada'});
        }else{
          if(!callback[0].activa){
            Song.update({url: req.body.url},{$set:{ activa: true, idplaylist: lengthSongs}},function(err, callback){
            })
            res.json({respuesta: 'activada'});
          }else{
            res.json({respuesta: 'esta en playlist'});
          }
        }
      }
    });
  });
})

// puerto
http.listen(3000, function(){
  console.log('listening on *:3000');
});
