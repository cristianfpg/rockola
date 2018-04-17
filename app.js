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
db.once('open',function(){});

var defaultIdkey = '_Uie2r5wWxw';
var defaultTitle = 'Título por defecto del servidor.';
var defaultDuration = 120;

var actualIdkey = '';
var actualTitle = '';
var actualDuration;
var actualTime = 0;

var timeInterval;
var serialSong = 0;

var songSchema = mongoose.Schema({
  idkey: {type: String, required: true, unique: true},
  duration: {type: Number, required: true},
  title: {type: String, default: defaultTitle},
  sthumbnail: {type: String, default: ''},
  playlist: {type: Boolean, default: true},
  serial: {type: Number, required: true}
},
{
  timestamps: true
});
var Song = mongoose.model('Song', songSchema);

/*
var newSong = new Song({
  idkey: defaultIdkey,
  title: defaultTitle,
  duration: defaultDuration,
  serial: serialSong
})
newSong.save();
*/

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

// endpoints y rutas
app.get('/', function(req, res){
  res.render('rockola');
});

app.get('/getplaylist', function(req, res){
  Song.find({playlist: true}).sort({serial: 1, updatedAt: 1}).exec(function(err, callback) { 
    res.json(callback);
  });
});

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
app.get('/skipsong',function(req,res){
  skipSong();
  res.json({response: 'skip song'});
})
http.listen(3000, function(){
  console.log('listening on *:3000');
});

// inicializadores
initRockola();