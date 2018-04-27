// ---------- variables iniciales -----------
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var sha1 = require('sha1');

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
  name: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  admin: {type: Boolean, default: false},
  player: {type: Boolean, default: false},
  block: {type: Boolean, default: false},
  songs_finished: {type: Number, default: 0},
  songs_skipped: {type: Number, default: 0}
});

var songSchema = mongoose.Schema(
  {
    idkey: {type: String, required: true, unique: true},
    duration: {type: Number, required: true},
    title: {type: String, default: defaultTitle},
    sthumbnail: {type: String, default: ''},
    playlist: {type: Boolean, default: true},
    serial: {type: Number, required: true}
  },{
    timestamps: true
  }
);

var optionSchema = mongoose.Schema({
  key: {type: String, required: true, unique: true},
  settings: {type: {}, default: {}}
});

var User = mongoose.model('User', userSchema);
var Song = mongoose.model('Song', songSchema);
var Option = mongoose.model('Option', optionSchema);

/* primeras acciones para la base de datos (necesarias para que corra la aplicacion de 1ro)*/

/*

var newUser = new User({
  name: 'cristian',
  password: 'cristian',
  admin: true
});
newUser.save();

var newUser = new User({
  name: 'player',
  password: 'player',
  player: true
});
newUser.save();

var newSong = new Song({
  idkey: defaultIdkey,
  title: defaultTitle,
  duration: defaultDuration,
  serial: serialSong
})
newSong.save();

var option = new Option({
  key: 'sessions',
  settings: []
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
        serial = callback.serial;
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
      });     
    }else{
      updateVariables(callback);
      initTimer(actualDuration);  
      io.emit('get actual song', [actualIdkey,0]); 
      io.emit('update playlist');        
    }
  }); 
}

function skipSong(){
  Song.update({idkey: actualIdkey},{$set:{ playlist: false }},function(err, callback){
    setNewSong();
  });
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
app.get('/', function(req, res){
  // req.session.name ? res.render('rockola') : res.redirect('/signin');
  res.render('rockola');
});

app.get('/signin',function(req,res){
  if(req.query.error) {
    switch(req.query.error){
      case 'nosignup':
        res.render('signin',{msg:'No esta registrado.'});
        break;
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
    // req.session.name ? res.redirect('/') : res.render('signin',{msg:''});
    res.render('signin',{msg:''});
  }
})

app.get('/dj',function(req,res){
  var actualSession = req.session.name;
  User.findOne({name: actualSession},function(err, callback){
    if(callback){
      if(callback.admin){
        // switch(req.query.option) {
        //   case 'sessions':
        //     Option.find({key: 'sessions'},function(err, callback){
        //       res.render('dj',{callback: callback});
        //     });     
        //     break;
        //   case 'users':
        //     User.find({},function(err, callback){
        //       var newCallback = callback.map(function(data){
        //         return data.name+', ';
        //         // return {name: data.name, finished: data.songs_finished};
        //       });
        //       res.render('dj',{callback: newCallback});
        //     });     
        //     break;
        //   default:
        //     res.render('dj');
        //     break;
        // }
        res.render('dj');
      }else{
        res.redirect('/');    
      }
    }else{
      res.json({msg: 'No existe la sesión'});
    }
  });
});

// ENDPOINTS GET
app.get('/getplaylist', function(req, res){
  Song.find({playlist: true}).sort({serial: 1, updatedAt: 1}).exec(function(err, callback) { 
    res.json(callback);
  });
});

// app.get('/skipsong',function(req,res){
//   skipSong();
//   res.json({response: 'skip song'});
// })

// app.get('/getsession',function(req,res){
//   res.json({name: req.session.name});
// });

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
  if(req.session.name){
    Option.find({key: 'sessions'},function(err, callback){
      var getSettings = callback[0];
      var newArray = getSettings.settings.slice(0);
      var index = newArray.map(function (e) { return e.name; }).indexOf(req.session.name);
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

// ENDPOINTS POST
app.post('/validatesignin',function(req,res){
  var reqName = req.body.name;
  var reqPassword = req.body.password;
  Option.find({key: 'sessions'},function(err, callback){
    var getSettings = callback[0];
    var newArray = getSettings.settings.slice(0);
    function checkArray(data){
      return data.name == reqName;
    }
    if(!getSettings.settings.find(checkArray) && reqName){
      User.find({name: reqName},function(err, callback){
        if(!callback) res.redirect('/signin?error=nosignup');
        if(callback.length == 1 && callback[0].password == reqPassword){
          newArray.push({name: reqName});
          getSettings.settings = newArray;
          getSettings.save();
          req.session.name = reqName;
          res.cookie('session', reqName, { maxAge: 900000000000, httpOnly: false});
          // res.redirect('/');   
          res.redirect('/signin');   
        }else{
          res.redirect('/signin?error=wrongdata');
        }
      })
    }else{
      reqName ? res.redirect('/signin?error=alreadylogged') : res.redirect('/signin?error=null');
    }
  })
})

app.post('/addtoplaylist',function(req,res){
  Song.findOne({idkey: req.body.idkey}).exec(function(err, callback) {
    serial++;
    if(callback){
      Song.findOne({idkey: req.body.idkey, playlist: false}).exec(function(errtwo, callbacktwo) {
        if(!callbacktwo){
          res.json({msg: 'Ya esta en la playlist.'});
        }else{
          Song.update({idkey: req.body.idkey},{$set:{ playlist: true, serial: serial }},function(errthree, callbackthree){
            res.json({msg: 'Agregada'});       
          });
        }
      });
    }else{
      var newSong = new Song({
        idkey: req.body.idkey,
        title: req.body.title,
        duration: req.body.duration,
        serial: serial
      })
      newSong.save(function(){
        res.json({msg: 'Agregada'});
      });
    }
  });  
});

app.post('/editusers',function(req,res){
  var stateToChange = req.body.state.split(':');
  var newName = req.body.newname;
  if(req.body.newname == '') newName = req.body.actualname;
  var newObject = { name: newName, password: req.body.newname, state: false };  
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
  User.update({name: req.body.actualname},{$set: newObject},function(err, callback){
    if(callback.n == 1 && callback.nModified == 1){
      res.json('listo');
    }else{
      res.json('Sin cambios');   
    }
  });  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

// inicializadores
initRockola();