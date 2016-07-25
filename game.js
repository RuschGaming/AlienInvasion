var sprites = {
 ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
 missile: { sx: 15, sy: 49, w: 2, h: 10, frames: 1 },
 charmander: { sx: 190, sy: 0, w: 33, h: 28, frames: 1 },
 pokeball: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
 slowpoke: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
 pika: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
 squirtle: { sx: 37, sy: 0, w: 42, h: 33, frames: 1 },
 tetris_stick: { sx: 224, sy: 0, w: 10, h: 40, frames: 1 },
 tetris_blue: { sx: 234, sy: 0, w: 21, h: 32, frames: 1 },
 tetris_red: { sx: 255, sy: 0, w: 31, h: 21, frames: 1 },
 tetris_purple: { sx: 286, sy: 0, w: 31, h: 21, frames: 1 },
 tetris_green: { sx: 317, sy: 0, w: 21, h: 31, frames: 1 },
 doom_head: { sx: 338, sy: 0, w: 40, h: 30, frames: 1 },
 doom_e: { sx: 378, sy: 0, w: 23, h: 39, frames: 1 },
 doom_soul: { sx: 401, sy: 0, w: 34, h: 40, frames: 1 },
 doom_pinky: { sx: 435, sy: 0, w: 29, h: 40, frames: 1 },
 doom_caco: { sx: 464, sy: 0, w: 31, h: 31, frames: 1 },
 explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
 enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frame: 1, },
};

var enemies = [
    {
      straight: { x: 0,   y: -50, sprite: 'pokeball', health: 10,
                  E: 100 },
      ltr:      { x: 0,   y: -100, sprite: 'slowpoke', health: 10,
                  B: 75, C: 1, E: 100, missiles: 2  },
      circle:   { x: 250,   y: -50, sprite: 'pika', health: 10,
                  A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
      wiggle:   { x: 100, y: -50, sprite: 'squirtle', health: 20,
                  B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
      step:     { x: 0,   y: -50, sprite: 'charmander', health: 10,
                  B: 150, C: 1.2, E: 75 }
    },
    {
      straight: { x: 0,   y: -50, sprite: 'tetris_stick', health: 10,
                  E: 100 },
      ltr:      { x: 0,   y: -100, sprite: 'tetris_red', health: 10,
                  B: 75, C: 1, E: 100, missiles: 2  },
      circle:   { x: 250,   y: -50, sprite: 'tetris_blue', health: 10,
                  A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
      wiggle:   { x: 100, y: -50, sprite: 'tetris_green', health: 20,
                  B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
      step:     { x: 0,   y: -50, sprite: 'tetris_purple', health: 10,
                  B: 150, C: 1.2, E: 75 }
    },
    {
      straight: { x: 0,   y: -50, sprite: 'doom_pinky', health: 10,
                  E: 100 },
      ltr:      { x: 0,   y: -100, sprite: 'doom_e', health: 10,
                  B: 75, C: 1, E: 100, missiles: 2  },
      circle:   { x: 250,   y: -50, sprite: 'doom_caco', health: 10,
                  A: 0,  B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI/2 },
      wiggle:   { x: 100, y: -50, sprite: 'doom_soul', health: 20,
                  B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2 },
      step:     { x: 0,   y: -50, sprite: 'doom_head', health: 10,
                  B: 150, C: 1.2, E: 75 }
    }
];

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16,
    PHRAZE_TOGGLE = false,
    LEVEL = 0,
    POINTS = 0,
    SHARE_VISIBLE = false,
    SCORE = 0;

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function addPointsToScoreboard(points) {
    POINTS += points;
    document.getElementById('score').innerHTML = pad(POINTS, 14);
}

function pushPoints() {
    // pushing points
    $.post('http://node02.kanobu.ru/api/apps/knb-ai-medinsky', {score: Game.points})
    .done(function(data){
        POINTS = data.result;
        addPointsToScoreboard(0);
    })
    .fail(function(jqXhr){
        console.log(jqXhr.responseText);
    });
}

function getPoints() {
    $.get('http://node02.kanobu.ru/api/apps/knb-ai-medinsky')
    .done(function(data){
        POINTS = data.result;
        addPointsToScoreboard(0);
    });
}

var startGame = function() {
    getPoints();

  var ua = navigator.userAgent.toLowerCase();

  // Only 1 row of stars
  if(ua.match(/android/)) {
    Game.setBoard(0,new Starfield(50,0.6,100,true));
  } else {
    Game.setBoard(0,new Starfield(20,0.4,100,true));
    Game.setBoard(1,new Starfield(50,0.6,100));
    Game.setBoard(2,new Starfield(100,1.0,50));
  }
  Game.setBoard(3,new TitleScreen("Симулятор Мединского",
                                  "Нажмите пробел для начала",
                                  playGame));
};

var randPhrase = function(type) {
    var death_phrases = [
        "[...] зная свою слабость, в компьютерные игры не играю. Надо понимать, что детям этого нельзя совсем. Это зло.",
        "Все компьютерные игры, что бы вам ни говорили, есть абсолютное зло. Это дьявол.",
        "Я сам у себя дома почти все телеканалы заблокировал, чтобы дети не смотрели.",
        "[Игры] – это зло, это пожиратели, как у Стивена Кинга, которые пожирали пространство и время."
    ]

    var win_phrases = [
        "Особенно, на мой взгляд, отвратительно — это все компьютерные игры.",
        "Я отключил интернет у детей в телефонах. Так они теперь ищут wi-fi. Надо вообще отобрать у них смартфоны.",
        "Компьютерные игры, за редчайшим исключением, вещь исключительно вредная. За редким исключением, подтверждающим правило."
    ]

    var arr = [];

    switch(type) {
        case 'death':
            arr = death_phrases;
            break;

        case 'win':
            arr = win_phrases;
            break;
        default:
            break;
    }

    var phrase = arr[getRandomInt(0, arr.length - 1)]
    var element = document.getElementById('phrase');
    element.innerHTML = phrase;
}

var sayPhrase = function(phrase) {
    var element = document.getElementById('phrase');
    element.innerHTML = phrase;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var levels = [
    [
        [ 0,      4000,  500, 'step' ],
        [ 6000,   13000, 800, 'ltr' ],
        [ 10000,  16000, 400, 'circle' ],
        [ 17800,  20000, 500, 'straight', { x: 50 } ],
        [ 18200,  20000, 500, 'straight', { x: 90 } ],
        [ 18200,  20000, 500, 'straight', { x: 10 } ],
        [ 22000,  25000, 400, 'wiggle', { x: 150 }],
        [ 22000,  25000, 400, 'wiggle', { x: 100 }]
    ],
    [
        [ 0,   13000, 500, 'wiggle', {x: 200} ],
        [ 0,  16000, 400, 'circle' ],
        [ 17000, 28000, 500, 'ltr'],
        [ 17000, 28000, 500, 'ltr', {x: 200}],
        [ 28000, 32000, 400, 'straight', {x: 100}],
        [ 28000, 32000, 400, 'straight', {x: 140}],
        [ 28000, 32000, 400, 'straight', {x: 180}],
        [ 33000, 27000, 500, 'wiggle'],
        [ 33000, 27000, 500, 'step', {x: 180}]
    ],
    [
        [ 0, 8000, 400, 'step'],
        [ 0, 8000, 400, 'step', {x: 180}],
        [ 3000, 8000, 400, 'circle'],
        [ 7000, 12000, 500, 'ltr'],
        [ 9000,  15000, 400, 'wiggle', { x: 150 }],
        [ 9000,  15000, 400, 'wiggle', { x: 200 }],
        [ 12000, 15000, 300, 'straight'],
        [ 13000, 28000, 500, 'circle'],
        [ 17000, 28000, 500, 'ltr'],
        [ 17000, 28000, 500, 'ltr', {x: 200}],
        [ 32000, 40000, 500, 'circle'],
        [ 32000, 40000, 500, 'circle', {x: 20}],
        [ 32000, 40000, 500, 'circle', {x: 100}],
        [ 32000, 40000, 500, 'straight', {x: 90}],
        [ 32000, 40000, 500, 'straight', {x: 170}]
    ]
];

var phrases = [
    "Культура и покемоны не имеют ничего общего.",
    "Я пережил то время, когда играл. Играл в начале 90-х годов, когда «Тетрис» появился, и сразу понял, что это зло.",
    "[Doom] я стер. Навсегда. Так хотел его уничтожить, что уничтожил все программное обеспечение на компьютере."
];



var playGame = function() {
  LEVEL = 0;
  changeMed('');
  sayPhrase("Я готов!");
  launchLvl(0);
  Game.setBoard(5,new GamePoints(0));
  $('.overlay').removeClass('show');
  $('#share').removeClass('show');
  $('.shareBtn').removeClass('show');
  $('.playAgain').removeClass('show');
};

var launchLvl = function() {
    changeMed('');
    sayPhrase(phrases[LEVEL]);
    var board = new GameBoard();
    board.add(new PlayerShip());
    if (LEVEL + 1 === levels.length) {
        board.add(new Level(levels[LEVEL], winGame));
    } else {
        board.add(new Level(levels[LEVEL], winLvl));
    }
    Game.setBoard(3, board);
}

var winLvl = function() {
  LEVEL += 1;
  Game.setBoard(3,new TitleScreen("Уровень пройден!",
                                  "Нажмите «огонь», чтобы уничтожить больше игр",
                                  launchLvl, LEVEL));
  changeMed('win');
  randPhrase('win');
};


var winGame = function() {
  Game.setBoard(3,new TitleScreen("Культура спасена!",
                                  "Нажмите «огонь», чтобы уничтожить еще больше игр",
                                  playGame));
  changeMed('win');
  randPhrase('win');
  pushPoints();

  share();
  $('.overlay').addClass('show');
  $('#share').addClass('show');
  $('.shareBtn').addClass('show');
  $('.playAgain').addClass('show');
};

var loseGame = function() {
  Game.setBoard(3,new TitleScreen("Игры вас победили",
                                  "Нажмите «огонь», чтобы сразиться со злом",
                                  playGame));
  changeMed('loose');
  randPhrase('death');
  pushPoints();
  share();
  $('.overlay').addClass('show');
  $('#share').addClass('show');
  $('.shareBtn').addClass('show');
  $('.playAgain').addClass('show');
};

var changeMed = function(type) {
    switch (type) {
        case 'win':
            document.getElementById('phrases').classList.add('win');
            break;
        case 'loose':
            document.getElementById('phrases').classList.add('loose');
            break;
        default:
            document.getElementById('phrases').classList.remove('loose');
            document.getElementById('phrases').classList.remove('win');
            break;
    }
}

var Starfield = function(speed,opacity,numStars,clear) {

  // Set up the offscreen canvas
  var stars = document.createElement("canvas");
  stars.width = Game.width;
  stars.height = Game.height;
  var starCtx = stars.getContext("2d");

  var offset = 0;

  // If the clear option is set,
  // make the background black instead of transparent
  if(clear) {
    starCtx.fillStyle = "#000";
    starCtx.fillRect(0,0,stars.width,stars.height);
  }

  // Now draw a bunch of random 2 pixel
  // rectangles onto the offscreen canvas
  starCtx.fillStyle = "#FFF";
  starCtx.globalAlpha = opacity;
  for(var i=0;i<numStars;i++) {
    starCtx.fillRect(Math.floor(Math.random()*stars.width),
                     Math.floor(Math.random()*stars.height),
                     2,
                     2);
  }

  // This method is called every frame
  // to draw the starfield onto the canvas
  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;

    // Draw the top half of the starfield
    if(intOffset > 0) {
      ctx.drawImage(stars,
                0, remaining,
                stars.width, intOffset,
                0, 0,
                stars.width, intOffset);
    }

    // Draw the bottom half of the starfield
    if(remaining > 0) {
      ctx.drawImage(stars,
              0, 0,
              stars.width, remaining,
              0, intOffset,
              stars.width, remaining);
    }
  };

  // This method is called to update
  // the starfield
  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  };
};

var PlayerShip = function() {
  this.setup('ship', { vx: 0, reloadTime: 0.25, maxVel: 200 });

  this.reload = this.reloadTime;
  this.x = Game.width/2 - this.w / 2;
  this.y = Game.height - Game.playerOffset - this.h;

  this.step = function(dt) {
    if(Game.keys['left']) { this.vx = -this.maxVel; }
    else if(Game.keys['right']) { this.vx = this.maxVel; }
    else { this.vx = 0; }

    this.x += this.vx * dt;

    if(this.x < 0) { this.x = 0; }
    else if(this.x > Game.width - this.w) {
      this.x = Game.width - this.w;
    }

    this.reload-=dt;
    if(Game.keys['fire'] && this.reload < 0) {
      Game.keys['fire'] = false;
      this.reload = this.reloadTime;

      this.board.add(new PlayerMissile(this.x+8,this.y-3+this.h/2));
      this.board.add(new PlayerMissile(this.x-16+this.w,this.y-3+this.h/2));
    }
  };
};

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    loseGame();
  }
};


var PlayerMissile = function(x,y) {
  this.setup('missile',{ vy: -700, damage: 10 });
  this.x = x - this.w/2;
  this.y = y - this.h;
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_ENEMY);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y < -this.h) {
      this.board.remove(this);
  }
};


var Enemy = function(blueprint,override) {
  this.merge(this.baseParameters);
  this.setup(blueprint.sprite,blueprint);
  this.merge(override);
};

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = { A: 0, B: 0, C: 0, D: 0,
                                   E: 0, F: 0, G: 0, H: 0,
                                   t: 0, reloadTime: 0.75,
                                   reload: 0 };

Enemy.prototype.step = function(dt) {
  this.t += dt;

  this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
  this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

  this.x += this.vx * dt;
  this.y += this.vy * dt;

  var collision = this.board.collide(this,OBJECT_PLAYER);
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  }

  if(Math.random() < 0.01 && this.reload <= 0) {
    this.reload = this.reloadTime;
    if(this.missiles == 2) {
      this.board.add(new EnemyMissile(this.x+this.w-2,this.y+this.h));
      this.board.add(new EnemyMissile(this.x+2,this.y+this.h));
    } else {
      this.board.add(new EnemyMissile(this.x+this.w/2,this.y+this.h));
    }

  }
  this.reload-=dt;

  if(this.y > Game.height ||
     this.x < -this.w ||
     this.x > Game.width) {
       this.board.remove(this);
  }
};

Enemy.prototype.hit = function(damage) {
  this.health -= damage;
  if(this.health <=0) {
    if(this.board.remove(this)) {
      Game.points += this.points || 1;
      addPointsToScoreboard(1);

      this.board.add(new Explosion(this.x + this.w/2,
                                   this.y + this.h/2));
    }
  }
};

var EnemyMissile = function(x,y) {
  this.setup('enemy_missile',{ vy: 200, damage: 10 });
  this.x = x - this.w/2;
  this.y = y;
};

EnemyMissile.prototype = new Sprite();
EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

EnemyMissile.prototype.step = function(dt)  {
  this.y += this.vy * dt;
  var collision = this.board.collide(this,OBJECT_PLAYER)
  if(collision) {
    collision.hit(this.damage);
    this.board.remove(this);
  } else if(this.y > Game.height) {
      this.board.remove(this);
  }
};



var Explosion = function(centerX,centerY) {
  this.setup('explosion', { frame: 0 });
  this.x = centerX - this.w/2;
  this.y = centerY - this.h/2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function(dt) {
  this.frame++;
  if(this.frame >= 12) {
    this.board.remove(this);
  }
};

window.addEventListener("load", function() {
  Game.initialize("game",sprites,startGame);
});

// sharing
share = function(){
        var shareCanvas = $('#share')[0];
        var sctx = shareCanvas.getContext('2d');

        // draw bg
        var img = $('#shareImg')[0];
        sctx.drawImage(img, 0, 0, 600, 300);

        // draw frame
        sctx.strokeStyle = "rgba(255,255,255,0.6)";
        sctx.strokeRect(20,20, 560, 260);

        // draw text
        sctx.fillStyle = "#fff";
        sctx.textAlign = "center";
        sctx.textBaseline = "bottom";
        sctx.font = "bold 18px arial";
        sctx.fillText('СЕГОДНЯ Я ЗАПРЕТИЛ', 300, 70);

        // draw subtitle
        sctx.textBaseline = "top";
        sctx.fillText('ИГР', 300, 160);

        // draw score

            // scoring magic
            if (window.localStorage.getItem('score') === null) {
                SCORE = Game.points.toString();

            } else if (window.localStorage.getItem('score') === "NaN") {
                SCORE = Game.points.toString();
            } else {
                SCORE = (parseInt(window.localStorage.getItem('score')) + Game.points).toString();
            }

            window.localStorage.setItem('score', SCORE);

            // actual drawing
            sctx.fillStyle = "#f1c40f";
            sctx.textBaseline = "top";
            sctx.font = "70px DS Dots Medium";
            sctx.fillText(SCORE, 300, 70);

        // draw med
        var med = $('#medImg')[0];
        sctx.drawImage(med, 50, 200, 50, 65);

        // draw angled thingie
        sctx.fillStyle = "#000";
        sctx.rotate(45 * Math.PI / 180);
        sctx.strokeRect(250,60,20,20);

        // reset current transformation matrix to the identity matrix
        sctx.setTransform(1, 0, 0, 1, 0, 0);

        // draw speech "bubble"
        sctx.fillRect(135, 202, 425, 60);
        sctx.strokeRect(135, 202, 425, 60);
        sctx.rotate(45 * Math.PI / 180);
        sctx.fillRect(251,59,20,20);

        // reset current transformation matrix to the identity matrix
        sctx.setTransform(1, 0, 0, 1, 0, 0);

        // say stuff
        var phrases = [
            "Особенно, на мой взгляд, отвратительно — это все компьютерные игры.",
            "Я отключил интернет у детей в телефонах. Так они теперь ищут wi-fi. Надо вообще отобрать у них смартфоны.",
            "Компьютерные игры, за редчайшим исключением, вещь исключительно вредная. За редким исключением, подтверждающим правило.",
            "Я пережил то время, когда играл. Играл в начале 90-х годов, когда «Тетрис» появился, и сразу понял, что это зло.",
            "[Doom] я стер. Навсегда. Так хотел его уничтожить, что уничтожил все программное обеспечение на компьютере.",
            "[...] зная свою слабость, в компьютерные игры не играю. Надо понимать, что детям этого нельзя совсем. Это зло!",
            "Все компьютерные игры, что бы вам ни говорили, есть абсолютное зло. Это дьявол.",
            "Когда кино — мозг отдыхает, потому что за тебя все придумано. С компьютерными играми это доведено до абсурда.",
            "[...] тот факт, что Россия еще сохранилась и развивается, говорит, что у нашего народа имеется одна лишняя хромосома.",
            "[Игры] – это зло, это пожиратели, как у Стивена Кинга, которые пожирали пространство и время.",
            "Я сам у себя дома почти все телеканалы заблокировал, чтобы дети не смотрели."
        ];
        var phrase = phrases[getRandomInt(0, phrases.length - 1)];

        sctx.fillStyle = "#fff";
        sctx.textAlign = "left";
        sctx.textBaseline = "bottom";
        sctx.font = "14px arial";
        phrase = wordWrap(phrase, 50);
        var i = 0;

        var topPos = 225;

        while (phrase.indexOf('\n') > -1) {
            var currPart = phrase.substr(0, phrase.indexOf('\n'));
            sctx.fillText(currPart, 150, topPos + 15 * i);
            phrase = phrase.substr(phrase.indexOf('\n') + 1, phrase.length);
            i += 1;
        };

        if (i === 0) {
            sctx.fillText(phrase, 150, topPos);
        } else {
            sctx.fillText(phrase, 150, topPos + 15 * i);
        }
};

(function(){
    $(document).ready(function() {
        $('.playAgain').click(function() {
            $('.overlay').removeClass('show');
            $('#share').removeClass('show');
            $('.shareBtn').removeClass('show');
            $('.playAgain').removeClass('show');

            $('.shareBtn.img').text('Прямая ссылка').css({left: '225px'});
        });

        $('.shareBtn').click(function() {
            switch($(this).data('soc')) {
                case 'vkontakte':
                    $.post(
                        'http://node02.kanobu.ru/api/apps/knb-ai-medinsky/share',
                        {
                            base64Img: $('#share')[0].toDataURL('image/jpeg', 0.8)
                        }
                    )
                    .done(function(data) {
                        Share.vkontakte('http://kanobu.ru/articles/simulyator-medinskogo-3000-zapreti-vse-igryi-369592/', 'Симулятор Мединского 3000 - запрети все игры!', data.result, 'Сегодня я запретил ' + SCORE + ' игр. Я спас культуру!');
                    })
                    .fail(function(jqXhr) {
                        console.log(jqXhr);
                    });

                    break;
                case 'facebook':
                    $.post(
                        'http://node02.kanobu.ru/api/apps/knb-ai-medinsky/share',
                        {
                            base64Img: $('#share')[0].toDataURL('image/jpeg', 0.8)
                        }
                    )
                    .done(function(data) {
                        Share.facebook('http://kanobu.ru/articles/simulyator-medinskogo-3000-zapreti-vse-igryi-369592/', 'Симулятор Мединского 3000 - запрети все игры!', data.result, 'Сегодня я запретил ' + SCORE + ' игр. Я спас культуру!');
                    })
                    .fail(function(jqXhr) {
                        console.log(jqXhr);
                    });
                    break;
                case 'twitter':
                    $.post(
                        'http://node02.kanobu.ru/api/apps/knb-ai-medinsky/share',
                        {
                            base64Img: $('#share')[0].toDataURL('image/jpeg', 0.8)
                        }
                    )
                    .done(function(data) {
                        Share.twitter('http://kanobu.ru/articles/simulyator-medinskogo-3000-zapreti-vse-igryi-369592/', 'Симулятор Мединского 3000 - запрети все игры!');
                    })
                    .fail(function(jqXhr) {
                        console.log(jqXhr);
                    });
                    break;
                default:
                    $.post(
                        'http://node02.kanobu.ru/api/apps/knb-ai-medinsky/share',
                        {
                            base64Img: $('#share')[0].toDataURL('image/jpeg', 0.8)
                        }
                    )
                    .done(function(data) {
                        $('.shareBtn.img').text(data.result).css({left: '90px'});
                    })
                    .fail(function(jqXhr) {
                        console.log(jqXhr);
                    });
                    break;
            }
        })
    });
})();

// word wrap
function wordWrap(str, maxWidth) {
    var newLineStr = "\n"; done = false; res = '';
    do {
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

        if (str.length < maxWidth)
            done = true;
    } while (!done);

    return res+str;
}

function testWhite(x) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
};

Share = {
	vkontakte: function(purl, ptitle, pimg, text) {
		url  = 'http://vkontakte.ru/share.php?';
		url += 'url='          + encodeURIComponent(purl);
		url += '&title='       + encodeURIComponent(ptitle);
		url += '&description=' + encodeURIComponent(text);
		url += '&image='       + encodeURIComponent(pimg);
		url += '&noparse=true';
		Share.popup(url);
	},
	odnoklassniki: function(purl, text) {
		url  = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
		url += '&st.comments=' + encodeURIComponent(text);
		url += '&st._surl='    + encodeURIComponent(purl);
		Share.popup(url);
	},
	facebook: function(purl, ptitle, pimg, text) {
		url  = 'http://www.facebook.com/sharer.php?s=100';
		url += '&p[title]='     + encodeURIComponent(ptitle);
		url += '&p[summary]='   + encodeURIComponent(text);
		url += '&p[url]='       + encodeURIComponent(purl);
		url += '&p[images][0]=' + encodeURIComponent(pimg);
		Share.popup(url);
	},
	twitter: function(purl, ptitle) {
		url  = 'http://twitter.com/share?';
		url += 'text='      + encodeURIComponent(ptitle);
		url += '&url='      + encodeURIComponent(purl);
		url += '&counturl=' + encodeURIComponent(purl);
		Share.popup(url);
	},
	mailru: function(purl, ptitle, pimg, text) {
		url  = 'http://connect.mail.ru/share?';
		url += 'url='          + encodeURIComponent(purl);
		url += '&title='       + encodeURIComponent(ptitle);
		url += '&description=' + encodeURIComponent(text);
		url += '&imageurl='    + encodeURIComponent(pimg);
		Share.popup(url)
	},

	popup: function(url) {
		window.open(url,'','toolbar=0,status=0,width=626,height=436');
	}
};
