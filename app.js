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
var participante;
mongoose.Promise = require('bluebird');
// mongoose.connect('mongodb://192.168.0.252:27017/rockola'); // ipcolor
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
// var urlencodedParser = bodyParser.urlencoded({extended: false});

// socket
io.on('connection', function(socket){
  socket.on('update playlist', function(msg){
    io.emit('update playlist', 'desde node');
  });
  // socket.on('disconnect', function(){
  //   ('user disconnected');
  // });
});

// mongoose
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // conectado
});

var usuarioSchema = mongoose.Schema({
  nombre: {type: String,required: true},
  email: {type: String,required: true,unique: true},
  contrasena: {type: String,required: true},
  votosPositivos: {type: Number,default: 0},
  votosNegativos: {type: Number,default: 0}
});

var songSchema = mongoose.Schema({
  titulo: {type: String,required: true},
  url: {type: String,required: true,unique: true},
  thumbnail: {type: String,required: true},
  idplaylist: {type: Number,required: true},
  activa: {type: Boolean,default: true},
  like: {type: Number,default: 0},
  dislike: {type: Number,default: 0},
  participantes: {type: Array, default: []}
});

var Usuario = mongoose.model('Usuario', usuarioSchema);
var Song = mongoose.model('Song', songSchema);

var primerEmail = 'desarrollo1@coloralcuadrado.com';
Usuario.find({email: primerEmail},function(err, callback){
  if(!callback[0]){
    var usuarioNuevo = new Usuario({
      nombre: 'Cristian Pacheco',
      email: primerEmail,
      contrasena: sha1('laCONTRAseñaMA54465DIFciil')
    })
    usuarioNuevo.save();
  }
})

function songNuevaFunc(data){
  var songNueva = new Song({
    titulo: data.titulo,
    url: data.url,
    thumbnail: data.thumbnail,
    idplaylist: data.idplaylist
  })
  songNueva.save();
}
var tituloDefault = 'no hay canciones en la playlist de color';
Song.find({titulo: tituloDefault},function(err, callback){
  if(!callback[0]){
    songNuevaFunc({
      titulo: tituloDefault,
      url: '_Uie2r5wWxw',
      thumbnail: 'http://cdn01.ib.infobae.com/adjuntos/162/imagenes/014/014/0014014674.jpg',
      idplaylist : 0
    });
  }
})

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

  // res.render('rockola');
  if(req.session.email){
    res.send(req.session.email);
  }else{
    res.json('no esta logueado');
    // var nombre = 'Tito';
    // req.session.nombre = nombre;
    // res.send('Hola usuario desconocido. De ahora en adelante te llamaremos ' + nombre);
  }
});

app.get('/rockola', function(req, res){
  if(req.session.email){
    res.render('rockola');
  }else{
    res.json('no esta logueado');
  }
  console.log('req.session.email');
  console.log(req.session.email);
});

app.get('/signin', function(req, res){
  req.session.email = primerEmail;
  participante = req.session.email;
  console.log('desde /signin');
  console.log(participante);
  res.json(req.session.email);
});

app.get('/destroy',function(req, res){
  req.session.destroy();
  res.json('adios!');
});

// rutas usuarios
app.get('/verusuarios',function(req,res){
  Usuario.find({}, function(err, callback){
    res.json(callback);
  })
})
// app.post('/nuevousuario',function(req,res){
//   var usuarioNuevo = new Usuario({
//     nombre: req.body.nombre,
//     email: req.body.email,
//     contrasena: req.body.contrasena
//   })
//   usuarioNuevo.save();
//   res.redirect('/');
// })
//
// app.post('/verificarusuario',function(req,res){
//   Usuario.find({email: req.body.email}, function(err, callback){
//     if(err){
//       ('err');
//     }else{
//       if(req.body.contrasena == callback[0].contrasena){
//         ('bien');
//         req.session.nombre = callback[0].nombre;
//       }else{
//         ('mal');
//       }
//     }
//     res.redirect('/');
//   });
// })

// rutas playlist
app.get('/verplaylist',function(req,res){
  Song.find({activa: true},function(err, callback){
    var porid = callback;
    porid.sort(function(a,b) {
      return a.idplaylist - b.idplaylist;
    });
    res.json(porid);
  })
})
app.get('/vercancion/:url',function(req,res){
  Song.find({url: req.params.url},function(err, callback){
    res.json(callback);
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
            idplaylist: lengthSongs
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
  console.log(req.session.email);
})
app.post('/borrarcancion',function(req,res){
  Song.update({url: req.body.url},{$set:{ activa: false }},function(err, callback){
    if(err || callback.nModified == 0){
      res.json({respuesta: 'error al desactivar cancion'});
    }else{
      Song.find({activa: true},function(err, callback){
        if(callback.length==0){
          Song.update({titulo: tituloDefault},{activa: true},function(err, callback){
            res.json({respuesta: 'no hay mas canciones'});
          })
        }else{
          res.json({respuesta: 'desactivada'});
        }
      })
    }
  })
})
// voto
app.post('/votacion',function(req,res){
  var voto = req.body.voto;
  console.log('desde /votacion');
  console.log(req.session);
  Song.find({url: req.body.url},function(err, callback){
    var participantes = callback[0].participantes;
    function checkPart(persona){
      return persona == participante;
    }
    if(!participantes.find(checkPart) && participante){
      participantes.push(participante);
      Song.update({url: req.body.url},{$set:{ participantes: participantes }},function(err, callback){
        if(voto == 'like'){
          Song.update({url: req.body.url},{$inc:{ like: 1 }},function(err, callback){
          })
        }else{
          Song.update({url: req.body.url},{$inc:{ dislike: 1 }},function(err, callback){
          })
        }
        res.json({respuesta: 'voto_correcto'});
      })
    }else{
      if(!participante){
        res.json({respuesta: 'no_esta_logueado'});
      }else{
        res.json({respuesta: 'en_lista'});
      }
    }
  })
})

// puerto
http.listen(3000, function(){
  console.log('listening on *:3000');
});
