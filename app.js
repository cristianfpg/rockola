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
// mongoose.connect('mongodb://192.168.0.252:27017/rockola'); // ipcolor
mongoose.connect('mongodb://localhost:27017/rockola',{useMongoClient: true});

app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
  secret: 'unsecretocualquiera',
  resave: false,
  saveUninitialized: false
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// var urlencodedParser = bodyParser.urlencoded({extended: false});

// socket
io.on('connection', function(socket){
  socket.on('update playlist', function(msg){
    console.log('message: ' + msg);
    io.emit('update playlist', 'desde node');
  });
  // socket.on('disconnect', function(){
  //   console.log('user disconnected');
  // });
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

var songSchema = mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  idplaylist: {
    type: Number,
    required: true
  },
  activa: {
    type: Boolean,
    default: true
  }
});

var Usuario = mongoose.model('Usuario', usuarioSchema);
var Song = mongoose.model('Song', songSchema);

// var usuarioNuevo = new Usuario({
//   nombre: 'Cristian Pacheco',
//   email: 'desarrollo1@coloralcuadrado.com',
//   contrasena: 'c2'
// })
// usuarioNuevo.save();

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

  res.render('rockola');

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
app.post('/nuevousuario',function(req,res){
  var usuarioNuevo = new Usuario({
    nombre: req.body.nombre,
    email: req.body.email,
    contrasena: req.body.contrasena
  })
  usuarioNuevo.save();
  res.redirect('/');
})

app.post('/verificarusuario',function(req,res){
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
app.get('/verplaylist',function(req,res){
  Song.find({activa: true},function(err, callback){
    res.json(callback);
  })
})
app.post('/agregaraplaylist',function(req,res){
  Song.find({url: req.body.url},function(err, callback){
    var lengthSongs = callback.length;
    if(lengthSongs == 0) {
      songNuevaFunc({
        titulo: req.body.titulo,
        url: req.body.url,
        thumbnail: req.body.thumbnail,
        idplaylist: lengthSongs
      });
      res.json({respuesta: 'activada'});
    }else{
      if(!callback.activa){
        Song.update({url: req.body.url},{ activa: true},{idplaylist: lengthSongs},function(err, callback){
        })
        res.json({respuesta: 'activada'});
      }else{
        res.json({respuesta: 'esta en playlist'});
      }
    }
  });
})
app.post('/borrarcancion',function(req,res){
  console.log(req.body);
  Song.update({url: req.body.url},{ activa: false },function(err, callback){
    if(err){
      res.json({respuesta: 'error al desactivar cancion'});
    }else{
      Song.find({activa: true},function(err, callback){
        if(callback.length==0){
          Song.update({titulo: tituloDefault},{activa: true},function(err, callback){

          })
        }
      })
      res.json({respuesta: 'desactivada'});
    }
  })

  // Song.findByIdAndRemove(req.body.iduno,{},function(err, callback){
  //   if(err){
  //     res.json({respuesta: 'error al borrar cancion'});
  //   }else{
  //     Song.count({},function(err, callback){
  //       if(callback == 0){
  //         // songNuevaFunc({
  //         //   titulo: 'no hay canciones en la playlist',
  //         //   url: '_Uie2r5wWxw',
  //         //   thumbnail: 'http://cdn01.ib.infobae.com/adjuntos/162/imagenes/014/014/0014014674.jpg',
  //         // });
  //       }
  //     })
  //     res.json({respuesta: 'borrado'});
  //   }
  // })
})
// puerto
http.listen(3000, function(){
  console.log('listening on *:3000');
});
