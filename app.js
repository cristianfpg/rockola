// ---------- variables iniciales -----------
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var request = require('request');
require('dotenv').config();

// --------- primeras ejecuciones -----------
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
db.once('open',function(){});

// ---------- variables secundarias --------

var defaultIdkey = '_Uie2r5wWxw';
var defaultTitle = 'Título por defecto del servidor.';
var defaultDuration = 120;

var actualIdkey = '';
var actualTitle = '';
var actualDuration;
var actualTime = 0;

var timeInterval;
var serialSong = 0;

var userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true, min: 1},
  name: {type: String, required: true, min: 1},
  admin: {type: Boolean, default: false},
  player: {type: Boolean, default: false},
  block: {type: Boolean, default: false},
  songs_finished: {type: Number, default: 0},
  songs_skipped: {type: Number, default: 0}
});

var songSchema = mongoose.Schema(
  {
    idkey: {type: String, required: true, unique: true},
    serial: {type: Number, required: true, unique: true},
    duration: {type: Number, required: true},
    owner: {type: String, required: true, min: 1},
    title: {type: String, default: defaultTitle},
    sthumbnail: {type: String, default: ''},
    playlist: {type: Boolean, default: true},
    score: {type: Number, default: 0}
  },{
    timestamps: true
  }
);

var optionSchema = mongoose.Schema({
  key: {type: String, required: true, unique: true},
  settings: {type: [], default: []}
});

var User = mongoose.model('User', userSchema);
var Song = mongoose.model('Song', songSchema);
var Option = mongoose.model('Option', optionSchema);

/* primeras acciones para la base de datos (necesarias para que corra la aplicacion de 1ro)*/

/*

var newUser = new User({
  name: 'admin',
  email: 'desarrollo1@coloralcuadrado.com',
  admin: true
});
newUser.save();

var newSong = new Song({
  idkey: defaultIdkey,
  title: defaultTitle,
  owner: 'desarrollo1@coloralcuadrado.com',
  duration: defaultDuration,
  serial: serialSong,
})
newSong.save();

var option = new Option({
  key: 'sessions',
  settings: []
});
option.save();

var option = new Option({
  key: 'votes',
  settings: [1]
});
option.save();

*/


// ----- funciones ------------
function initRockola(){
  Song.findOne({playlist: true}).sort({updatedAt: 1}).exec(function(err, callback) { 
    if(!callback){
      Song.update({idkey: defaultIdkey},{$set:{ playlist: true }},function(errtwo, callbacktwo){
        updateVariables({
          actualIdkey: defaultIdkey,
          actualTitle: defaultTitle,
          actualDuration: defaultDuration
        });
        initTimer(defaultDuration);
      });     
    }else{
      updateVariables(callback);
      initTimer(actualDuration);
      Song.findOne({}).sort({serial: -1}).exec(function(err, callback) { 
        serialSong = callback.serial;
      });
    }
  });
}
function initTimer(fin){
  actualTime = 0;
  clearInterval(timeInterval);
  timeInterval = setInterval(function(){ myTimer() }, 1000);
  function myTimer() {
    actualTime++;
    if(actualTime >= fin ) {
      clearInterval(timeInterval);
      skipSong(); 
    }
  }
}
function updateVariables(clbk){
  actualIdkey = clbk.idkey;
  actualTitle = clbk.title;
  actualDuration = clbk.duration;
}
function setNewSong(){
  Song.findOne({playlist: true}).sort({updatedAt: 1}).exec(function(err, callback) { 
    if(!callback){
      Song.update({idkey: defaultIdkey},{$set:{ playlist: true }},function(errtwo, callbacktwo){
        updateVariables({
          actualIdkey: defaultIdkey,
          actualTitle: defaultTitle,
          actualDuration: defaultDuration
        });
        initTimer(defaultDuration);  
        io.emit('get actual song', [defaultIdkey,0]);
        io.emit('update playlist');
        io.emit('new song');
      });     
    }else{
      updateVariables(callback);
      initTimer(actualDuration);  
      io.emit('get actual song', [actualIdkey,0]); 
      io.emit('update playlist');        
      io.emit('new song');
    }
  }); 
}

function skipSong(){
  Song.update({idkey: actualIdkey},{$set:{ playlist: false }},function(err, callback){
    Option.update({key: 'votes'},{$set:{ settings: [1] }},function(err, callback){
      setNewSong();
    })  
  });
}

function createSession(newArray,reqEmail,reqName,reqImage,getSettings,req,res){
  var cookieString;
  newArray.push({email: reqEmail, name: reqName, image: reqImage});
  getSettings.settings = newArray;
  getSettings.save();
  req.session.email = reqEmail;
  req.session.name = reqName;
  req.session.image = reqImage;
  cookieString = reqEmail+'|'+reqName+'|'+reqImage;
  res.cookie('session', cookieString, { maxAge: 900000000000, httpOnly: false});
}

io.on('connection', function(socket){
  socket.on('update results', function(msg){
    socket.emit('update results',msg);
  });
  socket.on('get actual song', function(){
    socket.emit('get actual song', [actualIdkey,actualTime]);
  });
  socket.on('update playlist', function(){
    io.emit('update playlist');   
  });
});

Option.find({key: 'sessions'},function(err, callback){
  var getSettings = callback[0];
  getSettings.settings = [];
  getSettings.save();
})

// --------- endpoints y rutas -------------

// RUTAS GET
app.get('/guestsession',function(req,res){
  if(req.session.email){
    res.redirect('/');
  }else{
    req.session.email = 'guest';
    res.json({msg: 'Invitado logueado'});
  }
})

app.get('/', function(req, res){
  req.session.email ? res.render('rockola') : res.redirect('/signin');
});

app.get('/signin',function(req,res){
  if(req.query.error) {
    switch(req.query.error){
      case 'alreadylogged':
        res.render('signin',{msg:'Ya esta logueado.'});
        break; 
      case 'wrongdata':
        res.render('signin',{msg:'Datos incorrectos.'});
        break; 
      case 'null':
        res.render('signin',{msg:'Ingrese los datos.'});
        break;   
      default:
        res.render('signin',{msg:''});
        break;
    }
  }else{
    req.session.email ? res.redirect('/') : res.render('signin',{msg:''});
  }
})

app.get('/dj',function(req,res){
  var actualSession = req.session.email;
  User.findOne({email: actualSession},function(err, callback){
    if(callback){
      if(callback.admin){
        res.render('dj');
      }else{
        res.redirect('/');    
      }
    }else{
      res.json({msg: 'Denegado'});
    }
  });
});

// ENDPOINTS GET
app.get('/getplaylist', function(req, res){
  Song.find({playlist: true}).sort({serial: 1, updatedAt: 1}).exec(function(err, callback) { 
    res.json(callback);
  });
});

app.get('/getsessions',function(req,res){
  Option.findOne({key: 'sessions'},function(err, callback){
    var newCallback = callback.settings;
    res.json({data: newCallback});
  });
});

app.get('/getusers',function(req,res){
  User.find({},function(err, callback){
    var newCallback = callback;
    res.json({data: newCallback});
  });
});

app.get('/logout',function(req,res){
  if(req.session.email){
    Option.find({key: 'sessions'},function(err, callback){
      var getSettings = callback[0];
      var newArray = getSettings.settings.slice(0);
      var index = newArray.map(function (e) { return e.email; }).indexOf(req.session.email);
      newArray.splice(index, 1);
      getSettings.settings = newArray;
      getSettings.save();
      res.clearCookie('session');
      req.session.destroy();
      res.json('Successful logout');
    })
  }else{
    res.redirect('/');
  }
})

app.get('/validatesignin',function(req,res){
  if(req.session.email) res.redirect('/');
  var endpointSlack = "https://slack.com/api/oauth.access?client_id="+process.env.CLIENTID+"&client_secret="+process.env.CLIENTSECRET+"&code="+req.query.code;
  request(endpointSlack, function (error, response, body) {
    var resJson = JSON.parse(body);
    if(resJson.ok){
      Option.find({key: 'sessions'},function(err, callback){
        var getSettings = callback[0];
        var newArray = getSettings.settings.slice(0);
        var reqEmail = resJson.user.email;
        var reqName = resJson.user.name;
        var reqImage = resJson.user.image_192;
        function checkArray(data){
          return data.email == reqEmail;
        }
        // si no encuentra sesiones && el correo lo enviaron
        if(!getSettings.settings.find(checkArray) && reqEmail){
          User.find({email: reqEmail},function(err, callback){          
            // no esta registrado
            if(!callback) res.redirect('/signin?error=nosignup');
            // esta registrado y no esta logueado: unica opcion que deja pasar
            if(callback.length == 1){
              createSession(newArray,reqEmail,reqName,reqImage,getSettings,req,res);
              res.redirect('/'); 
            }else{
              // crea el usuario si es la 1ra vez que entra
              var newUser = new User({
                name: reqName,
                email: reqEmail
              });
              newUser.save();
              createSession(newArray,reqEmail,reqName,reqImage,getSettings,req,res);              
              // res.json({msg: "¡Usuario nuevo!"});
              console.log('Nuevo!');
              res.redirect('/');               
            }
          })    
        }else{
          // cuando encuentra sesion o el correo es vacio 
          reqName ? res.redirect('/signin?error=alreadylogged') : res.redirect('/signin?error=null');
        }
      })    
    }else{
      // error del oauth 2.0
      res.json({msg: resJson.error});
    }
  });
})  

app.get('/getvotes',function(req,res){
  Option.find({key: 'votes'},function(err, callback){
    res.json({msg: callback[0].settings[0]});
  })
});

// ENDPOINTS POST

app.post('/addtoplaylist',function(req,res){
  if(req.body.owner){
    Song.findOne({idkey: req.body.idkey}).exec(function(err, callback) {
      serialSong++;
      if(callback){
        Song.findOne({idkey: req.body.idkey, playlist: false}).exec(function(errtwo, callbacktwo) {
          if(!callbacktwo){
            res.json({msg: 'Ya esta en la playlist.'});
          }else{
            Song.update({idkey: req.body.idkey},{$set:{ playlist: true, serial: serialSong, owner: req.body.owner }},function(errthree, callbackthree){
              res.json({msg: 'Agregada'});       
            });
          }
        });
      }else{
        var newSong = new Song({
          idkey: req.body.idkey,
          serial: serialSong,
          owner: req.body.owner,
          title: req.body.title,
          duration: req.body.duration,
        })
        newSong.save(function(){
          res.json({msg: 'Agregada'});
        });
      }
    });  
  }else{
    res.json({msg: 'Error'});
  }
});

app.post('/editusers',function(req,res){
  var stateToChange = req.body.state.split(':');
  var newObject = { };  
  switch(stateToChange[0]){
    case 'admin':
      newObject.admin = stateToChange[1];
      break;
    case 'player':
      newObject.player = stateToChange[1];
      break;
    case 'block':
      newObject.block = stateToChange[1];
      break;
  }
  User.update({email: req.body.email},{$set: newObject},function(err, callback){
    if(callback.n == 1 && callback.nModified == 1){
      res.json('listo');
    }else{
      res.json('Sin cambios');   
    }
  });  
});

app.post('/getuserpermissions',function(req,res){
  var actualSession = req.body.email;
  User.findOne({email: actualSession},function(err, callback){
    res.json(callback);
  });
});

app.post('/skipsong',function(req,res){
  if(req.body.admin){
    skipSong();
    res.json({msg: 'skip song'});
  }else{
    res.json({msg: 'nope'});
  }
})

app.post('/votes',function(req,res){    
  Option.find({key: 'sessions'},function(errOne, callbackOne){
    var sessionLength = callbackOne[0].settings.length;
    var skipPercent = sessionLength * -0.25;
    Option.find({key: 'votes'},function(err, callback){
      var getParticipants = callback[0];
      var newArray = getParticipants.settings.slice(0);
      function checkArray(data){
        return data == req.body.participant;
      }
      if(!getParticipants.settings.find(checkArray)){
        newArray[0] += req.body.vote;
        newArray.push(req.body.participant);
        getParticipants.settings = newArray;
        getParticipants.save();
        io.emit('update votes', newArray[0]);
        // if(newArray[0] <= skipPercent ) console.log('se supone que salta aca');
        if(newArray[0] <= skipPercent ) skipSong();
        res.json({msg: 'Hecho!'});
      }else{
        res.json({msg: 'Ya votó'});
      }
    })
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

// inicializadores
initRockola();
