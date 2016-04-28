var express = require('express');
var router = express.Router();
var myDataRef = new Firebase("https://chas.firebaseio.com/");

/* GET home page. */
router.get('/', function(req, res, next) {
	myDataRef.on('value', function(dataSnapshot) {
		var keys = [];
		for (var key in dataSnapshot.val()) {
			keys.push(key);
		}
		res.render('index', {
			title: 'Game Room List',
			rooms: keys
		});
	});
});

//create
router.get('/create', function(req, res) {
	res.render('create');
});

router.post('/create', function(req, res) {
	var room_name = req.body.room_name;
	var room_size = req.body.room_size;
	var obj = {};
	obj[room_name] = {
		room_size: room_size,
		turn: 0
	};
	myDataRef.update(obj);
	res.redirect('/set_player_name/' + room_name);

});

router.get('/set_player_name/:room_name', function(req, res) {
  res.render('set_player_name', {
  	room_name: req.params.room_name
  });
});

router.post('/set_player_name/:room_name', function(req, res, next) {
  var player_name = req.body.player_name;
  var room_name = req.params.room_name;

  var room = myDataRef.child(room_name);
  room.on('value', function(snapshot) {
  		var obj = {
  			player1: {
  				location: {
  					0:0,
  					1:0,
  					2:0
  				},
  				name: player_name,
  				score: 0
  			}
  		}
  		room.update(obj);

  });
  res.redirect('/ready/' + room_name);
});

router.get('/ready/:room_name', function(req, res) {
	var room_name = req.params.room_name;
	res.render('ready', {
		room_name: room_name
	});
});

module.exports = router;
