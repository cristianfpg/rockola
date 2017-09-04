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
  duracion: {type: Number,default: 0},
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
    idplaylist: data.idplaylist,
    duracion: data.duracion
  })
  songNueva.save();
}
var tituloDefault = 'no hay canciones en la playlist de color';
var urlActual = '_Uie2r5wWxw';
var urlDefault = '_Uie2r5wWxw';
var thumbDefault = 'http://cdn01.ib.infobae.com/adjuntos/162/imagenes/014/014/0014014674.jpg';
var tiempoActual = 0;
var tiempoTotal = 20;

// Song.findOne({titulo: tituloDefault},function(err, callback){
//   if(!callback){
//     songNuevaFunc({
//       titulo: tituloDefault,
//       url: urlActual,
//       thumbnail: 'http://cdn01.ib.infobae.com/adjuntos/162/imagenes/014/014/0014014674.jpg',
//       idplaylist : 0,
//       duracion: tiempoTotal
//     });
//   }
// })
Song.find({url: urlDefault},function(err, callback){
  if(callback.length <= 0){
    songNuevaFunc({
      titulo: tituloDefault,
      url: urlDefault,
      thumbnail: thumbDefault,
      idplaylist : 0,
      duracion: tiempoTotal
    });
  }
})
function cancionActualFunc(response){
  Song.findOne({activa: true}).sort({created_at: -1}).exec(function(err, callback) {
    response(err, callback);
  });
}
// calcularTiempoFunc();
function calcularTiempoFunc(){
  // tiempoActual = 0;
  // Song.findOne({activa: true}).sort({created_at: -1}).exec(function(err, callback) {
  //   myStopFunction();
  //   if(!callback){
  //     Song.update({titulo: tituloDefault},{activa: true},function(err, callback){
  //       // res.json({respuesta: 'no hay mas canciones'});
  //       console.log('no hay mas canciones')
  //     })
  //   }
  //   tiempoTotal = callback.duracion;
  //   urlActual = callback.url;
  //   console.log(urlActual);
  //   console.log(tiempoTotal)
  //   var calcTiempo = setInterval(function(){ myTimer() }, 1000);
  //   function myTimer() {
  //     tiempoActual++;
  //     console.log(tiempoActual)
  //     if(tiempoActual > tiempoTotal ) {
  //       console.log('acabo')
  //       myStopFunction();
  //       quitarCancionFunc();
  //       calcularTiempoFunc();
  //     }
  //   }
  //   function myStopFunction() {
  //     clearInterval(calcTiempo);
  //   }

  // });
}

function quitarCancionFunc(){
  // Song.update({url: urlActual},{$set:{ activa: false }},function(err, callback){
  //   if(err || callback.nModified == 0){
  //     console.log('error')
  //   }else{
  //     Song.find({activa: true},function(err, callback){
  //       if(callback.length==0){
  //         Song.update({titulo: tituloDefault},{activa: true},function(err, callback){
  //           console.log('no hay mas canciones')
  //         })
  //       }else{
  //         console.log('desactivada')
  //       }
  //     })
  //   }
  // })
}

// socket
io.on('connection', function(socket){
  socket.on('update playlist', function(){
    io.emit('update playlist');
  });
  socket.on('tiempo actual', function(msg){
    io.emit('tiempo actual', {tiempoActual: tiempoActual, urlActual: urlActual});
  });
  // socket.on('disconnect', function(){
  //   ('user disconnected');
  // });
});

// rutas get
var calcTiempo;

tiempoActual = 0;
clearInterval(calcTiempo);
calcTiempo = setInterval(function(){ myTimer() }, 1000);
// console.log(callback.duracion);
function myTimer() {
  tiempoActual++;
  console.log(tiempoActual)
  if(tiempoActual > 50 ) {
    clearInterval(calcTiempo);
    // Song.update({url: callback.url},{$set:{ activa: false }},function(err, callback){
    //   cancionActualFunc(function(err, callback){
    //     console.log('siguiente')
    //     io.emit('tiempo actual', callback);
    //   })
    // });
  }
}

app.get('/cambiocancion',function(req,res){
  // cancionActualFunc(function(err, callback){
  //   tiempoActual = 0;
  //   clearInterval(calcTiempo);
  //   calcTiempo = setInterval(function(){ myTimer() }, 1000);
  //   console.log(callback.duracion);
  //   function myTimer() {
  //     tiempoActual++;
  //     console.log(tiempoActual)
  //     if(tiempoActual > 5 ) {
  //       clearInterval(calcTiempo);
  //       Song.update({url: callback.url},{$set:{ activa: false }},function(err, callback){
  //         cancionActualFunc(function(err, callback){
  //           console.log('siguiente')
  //           io.emit('tiempo actual', callback);
  //         })
  //       });
  //     }
  //   }
  // })

        //   Song.update({url: urlDefault},{$set:{ activa: false }},function(err, callback){
        //     tiempoActual: 120;
        //     io.emit('tiempo actual', {tiempoActual: tiempoActual, urlActual: urlDefault});
        //     io.emit('update playlist');
        //   })

  cancionActualFunc(function(err, callback){
    Song.update({url: callback.url},{$set:{ activa: false }},function(err, callback){
      cancionActualFunc(function(err, callback){
        if(callback){
          io.emit('tiempo actual', {tiempoActual: tiempoActual, urlActual: callback.url});
          io.emit('update playlist');
        }else{
          Song.update({url: urlDefault},{$set:{ activa: true }},function(err, callback){
            io.emit('tiempo actual', {tiempoActual: tiempoActual, urlActual: urlDefault});
            io.emit('update playlist');
          })
        }
      })
    });
  })
  
  res.json({respuesta: 'cambio'});

    // var urlAborrar = callback.url;
    // Song.update({url: urlAborrar},{$set:{ activa: false }},function(err, callback){
    //   if(err || callback.nModified == 0){
    //     res.json({respuesta: 'error al desactivar cancion'});
    //   }else{
    //     Song.find({activa: true},function(err, callback){
    //       if(callback.length==0){
    //         Song.update({titulo: tituloDefault},{activa: true},function(err, callback){
    //           res.json({respuesta: 'no hay mas canciones'});
    //         })
    //       }else{
    //         res.json({respuesta: 'desactivada'});
    //       }
    //     })
    //   }
    //   io.emit('tiempo actual', {tiempoActual: tiempoActual, urlActual: urlActual});
    //   io.emit('update playlist', 'desde node');
    //   calcularTiempoFunc();
    //   console.log('cambio desde endpoint');
    //   res.json({respuesta: 'cambio'});
    // })
})
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

  res.render('rockola');
});

// app.get('/rockola', function(req, res){
// });

// app.get('/signin', function(req, res){
// });

// app.get('/destroy',function(req, res){
// });

// rutas usuarios
app.get('/verusuarios',function(req,res){
  Usuario.find({}, function(err, callback){
    res.json(callback);
  })
})
app.post('/nuevousuario',function(req,res){
  // var usuarioNuevo = new Usuario({
  //   nombre: req.body.nombre,
  //   email: req.body.email,
  //   contrasena: req.body.contrasena
  // })
  // usuarioNuevo.save();
  // res.redirect('/');
})

app.post('/verificarusuario',function(req,res){
  // Usuario.find({email: req.body.email}, function(err, callback){
  //   if(err){
  //     ('err');
  //   }else{
  //     if(req.body.contrasena == callback[0].contrasena){
  //       ('bien');
  //       req.session.nombre = callback[0].nombre;
  //     }else{
  //       ('mal');
  //     }
  //   }
  //   res.redirect('/');
  // });
})

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
// app.post('/borrarcancion',function(req,res){
//   Song.update({url: req.body.url},{$set:{ activa: false }},function(err, callback){
//     if(err || callback.nModified == 0){
//       res.json({respuesta: 'error al desactivar cancion'});
//     }else{
//       Song.find({activa: true},function(err, callback){
//         if(callback.length==0){
//           Song.update({titulo: tituloDefault},{activa: true},function(err, callback){
//             res.json({respuesta: 'no hay mas canciones'});
//           })
//         }else{
//           res.json({respuesta: 'desactivada'});
//         }
//       })
//     }
//   })
// })
// voto
app.post('/votacion',function(req,res){
  console.log(req.body.url);
  console.log(req.body.voto);
  // Song.find({url: req.body.url},function(err, callback){
  //   var participantes = callback[0].participantes;
  //   function checkPart(persona){
  //     return persona == participante;
  //   }
  //   if(!participantes.find(checkPart) && participante){
  //     participantes.push(participante);
  //     Song.update({url: req.body.url},{$set:{ participantes: participantes }},function(err, callback){
  //       if(voto == 'like'){
  //         Song.update({url: req.body.url},{$inc:{ like: 1 }},function(err, callback){
  //         })
  //       }else{
  //         Song.update({url: req.body.url},{$inc:{ dislike: 1 }},function(err, callback){
  //         })
  //       }
  //       res.json({respuesta: 'voto_correcto'});
  //     })
  //   }else{
  //     if(!participante){
  //       res.json({respuesta: 'no_esta_logueado'});
  //     }else{
  //       res.json({respuesta: 'en_lista'});
  //     }
  //   }
  // })
})
// puerto
http.listen(3000, function(){
  console.log('listening on *:3000');
});
