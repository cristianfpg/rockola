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
  owner: {type: String, required: true},
  duracion: {type: Number, default: 0},
  reproducciones: {type: Number, default: 0},
  omisiones: {type: Number, default: 0}
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
var contrasenaDefault = nombreDefault;
// var contrasenaDefault = sha1('laCONTRAseñaMA54465DIFciil');
var tituloDefault = 'no hay canciones en la playlist de color';
var urlDefault = '_Uie2r5wWxw';
var thumbDefault = 'http://cdn01.ib.infobae.com/adjuntos/162/imagenes/014/014/0014014674.jpg';
var urlActual;
var tiempoActual = 0;
var tiempoTotal = 120;
var calcTiempo;

function songNuevaFunc(data){
  var songNueva = new Song({
    titulo: data.titulo,
    url: data.url,
    thumbnail: data.thumbnail,
    idplaylist: data.idplaylist,
    duracion: data.duracion,
    owner: data.owner
  })
  songNueva.save();
}

/*
var usuarioNuevo = new Usuario({
  nombre: nombreDefault,
  contrasena: contrasenaDefault
})
usuarioNuevo.save();

songNuevaFunc({
  titulo: tituloDefault,
  url: urlDefault,
  thumbnail: thumbDefault,
  idplaylist : 0,
  duracion: tiempoTotal,
  owner: 'desde node'
});

var option = new Option({
  key: 'votacion',
  settings: {}
});
option.save();

var option = new Option({
  key: 'sesiones',
  settings: []
});
option.save();
*/

Option.find({key: 'sesiones'},function(err, callback){
  var getSettings = callback[0];
  getSettings.settings = [];
  getSettings.save();
})

function reinicioContadorFunc(fin){
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

function reinicioVotacionFunc(urlActual,owner){
  Option.find({key: 'votacion'},function(err, callback){
    var getSettings = callback[0];
    getSettings.settings = {
      urlActual: urlActual,
      participantes: [],
      like: 0,
      dislike: 0,
      owner: owner
    };
    getSettings.save();
  })
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
            reinicioContadorFunc(callback.duracion)
          })
          reinicioVotacionFunc(callback.url,'owner');
        }else{
          Song.update({url: urlDefault},{$set:{ activa: true }},function(err, callback){
            io.emit('tiempo actual', {tiempoActual: 0, urlActual: urlDefault});
            io.emit('update playlist');
            cancionActualFunc(function(err, callback){
              reinicioContadorFunc(callback.duracion)
            })
          })
          reinicioVotacionFunc(urlDefault,'owner');          
        }
      })
    });
  })
}

cancionActualFunc(function(err, callback){
  reinicioContadorFunc(callback.duracion+3);
})

// endpoints y rutas
app.get('/', function(req, res){
  req.session.nombre ? res.render('rockola') : res.redirect('/signin');
});

app.get('/signin',function(req,res){
  req.session.nombre ? res.redirect('/') : res.render('signin', {msg: ''});
})

app.get('/logout',function(req,res){
  if(req.session.nombre){
    Option.find({key: 'sesiones'},function(err, callback){
      var getSettings = callback[0];
      var nuevaArray = getSettings.settings.slice(0);
      var index = nuevaArray.map(function (e) { return e.nombre; }).indexOf(req.session.nombre);
      nuevaArray.splice(index, 1);

      getSettings.settings = nuevaArray;
      getSettings.save();
      res.clearCookie('sesion');
      req.session.destroy();
      res.json('sesion terminada');
    })
  }else{
    res.json('no hay sesion');
  }
})

app.post('/validarSignin',function(req,res){
  var reqNombre = req.body.nombre;
  // var reqContrasena = sha1(req.body.contrasena);
  var reqContrasena = req.body.nombre;
  Option.find({key: 'sesiones'},function(err, callback){
    var getSettings = callback[0];
    var nuevaArray = getSettings.settings.slice(0);
    function checkArray(data){
      return data.nombre == reqNombre;
    }
    if(!getSettings.settings.find(checkArray) && reqNombre){
      Usuario.find({nombre: reqNombre},function(err, callback){
        if(callback.length == 1 && callback[0].contrasena == reqContrasena){
          nuevaArray.push({nombre: reqNombre});
          getSettings.settings = nuevaArray;
          getSettings.save();
          req.session.nombre = reqNombre;
          res.cookie('sesion', reqNombre, { maxAge: 900000000000, httpOnly: false});
          res.redirect('/');          
        }else{
          // res.json('no esta registrado');
          res.render('signin',{msg: 'no esta registrado'});
        }
      })
    }else{
      res.json('esta logueado o es vacio');
    }
  })
})

app.get('/cambiocancion',function(req,res){
  cambioCancionFunc();
  res.json({respuesta: 'cambio'});
  io.emit('update votos');
})
app.get('/misesion',function(req,res){
  res.json(req.session.nombre);
});
app.post('/voto',function(req,res){
  var reqNombre = req.body.participante;
  var reqVoto = req.body.voto;
  Option.find({key: 'votacion'},function(err, callback){
    var getSettings = callback[0];
    function checkArray(data){
      return data == reqNombre;
    }
    if(!getSettings.settings.participantes) getSettings.settings.participantes = [];
    if(!getSettings.settings.participantes.find(checkArray)){
      var nuevaArray = getSettings.settings.participantes.slice(0);
      var urlAct = getSettings.settings.urlActual;
      var ownerAct = getSettings.settings.owner;
      var likeAct = getSettings.settings.like;
      var dislikeAct = getSettings.settings.dislike;
      if(reqVoto == 'like') likeAct++
      if(reqVoto == 'dislike') dislikeAct++
      nuevaArray.push(reqNombre);
      getSettings.settings = {
        urlActual: urlAct,
        participantes: nuevaArray,
        like: likeAct,
        dislike: dislikeAct,
        owner: ownerAct
      };
      getSettings.save();
      res.json(getSettings.settings);
      if((likeAct + 2) < dislikeAct) cambioCancionFunc();
    }else{
      res.json('ya voto');
    }
  })
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
app.get('/vervotos',function(req,res){
  Option.find({key: 'votacion'},function(err, callback){
    var getSettings = callback[0];
    res.json(getSettings);    
  })  
});
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
            duracion: req.body.duracion,
            owner: req.body.owner
          });
          res.json({respuesta: 'creada'});
        }else{
          if(!callback[0].activa){
            Song.update({url: req.body.url},{$set:{ activa: true, idplaylist: lengthSongs, owner: req.body.owner}},function(err, callback){
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