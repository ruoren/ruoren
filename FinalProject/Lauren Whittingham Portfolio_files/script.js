//***START sparkle code
//source: https://codepen.io/simeydotme/pen/jgcvi
$(function() {
  $(".nav-link").sparkleh({
    color: "000000",
    count: 20,
    overlap: 10
  });
  $("body").sparkleh({
    count: 200,
    color: ["#f3edc4","#253943","#659e3f"],
    speed: 0.4
  });
  // $("#mypic").sparkleh({
  //   count: 30,
  //   color: ["#f3edc4","#253943","#659e3f"],
  //   speed: 0.4
  // });
  // $(".logoanime").sparkleh({
  //   count: 80,
  //   color: ["#ff0080","#ff0080","#0000FF"]
  // });

  // default is varying levels of transparent white sparkles
  // $(".sparkley:first").sparkleh(
  //   {
  //     color: "000000",
  //     count: 20,
  //     overlap: 0
  //   }
  // );
  // $(".sparkley:last").sparkleh({
  //   color: "rainbow",
  //   count: 100,
  //   overlap: 10
  // });

});
$.fn.sparkleh = function( options ) {

  return this.each( function(k,v) {

    var $this = $(v).css("position","relative");

    var settings = $.extend({
      width: $this.outerWidth(),
      height: $this.outerHeight(),
      color: "#000000",
      count: 20,
      overlap: 0,
      speed: 1
    }, options );

    var sparkle = new Sparkle( $this, settings );

    $this.on({
      "mouseover focus" : function(e) {
        sparkle.over();
      },
      "mouseout blur" : function(e) {
        sparkle.out();
      }
    });

  });

}
function Sparkle( $parent, options ) {
  this.options = options;
  this.init( $parent );
}

Sparkle.prototype = {

  "init" : function( $parent ) {

    var _this = this;

    this.$canvas =
      $("<canvas>")
        .addClass("sparkle-canvas")
        .css({
          position: "absolute",
          top: "-"+_this.options.overlap+"px",
          left: "-"+_this.options.overlap+"px",
          "z-index": -1,
          "pointer-events": "none"
        })
        .appendTo($parent);

    this.canvas = this.$canvas[0];
    this.context = this.canvas.getContext("2d");

    this.sprite = new Image();
    this.sprites = [0,6,13,20];
    this.sprite.src = this.datauri;

    this.canvas.width = this.options.width + ( this.options.overlap * 2);
    this.canvas.height = this.options.height + ( this.options.overlap * 2);


    this.particles = this.createSparkles( this.canvas.width , this.canvas.height );

    this.anim = null;
    this.fade = false;

  },

  "createSparkles" : function( w , h ) {

    var holder = [];

    for( var i = 0; i < this.options.count; i++ ) {

      var color = this.options.color;

      if( this.options.color == "rainbow" ) {
        color = '#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
      } else if( $.type(this.options.color) === "array" ) {
        color = this.options.color[ Math.floor(Math.random()*this.options.color.length) ];
      }

      holder[i] = {
        position: {
          x: Math.floor(Math.random()*w),
          y: Math.floor(Math.random()*h)
        },
        style: this.sprites[ Math.floor(Math.random()*4) ],
        delta: {
          x: Math.floor(Math.random() * 1000) - 500,
          y: Math.floor(Math.random() * 1000) - 500
        },
        size: parseFloat((Math.random()*2).toFixed(2)),
        color: color
      };

    }

    return holder;

  },

  "draw" : function( time, fade ) {

    var ctx = this.context;

    ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

    for( var i = 0; i < this.options.count; i++ ) {

      var derpicle = this.particles[i];
      var modulus = Math.floor(Math.random()*7);

      if( Math.floor(time) % modulus === 0 ) {
        derpicle.style = this.sprites[ Math.floor(Math.random()*4) ];
      }

      ctx.save();
      ctx.globalAlpha = derpicle.opacity;
      ctx.drawImage(this.sprite, derpicle.style, 0, 7, 7, derpicle.position.x, derpicle.position.y, 7, 7);

      if( this.options.color ) {

        ctx.globalCompositeOperation = "source-atop";
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = derpicle.color;
        ctx.fillRect(derpicle.position.x, derpicle.position.y, 7, 7);

      }

      ctx.restore();

    }


  },

  "update" : function() {

     var _this = this;

     this.anim = window.requestAnimationFrame( function(time) {

       for( var i = 0; i < _this.options.count; i++ ) {

         var u = _this.particles[i];

         var randX = ( Math.random() > Math.random()*2 );
         var randY = ( Math.random() > Math.random()*3 );

         if( randX ) {
           u.position.x += ((u.delta.x * _this.options.speed) / 1500);
         }

         if( !randY ) {
           u.position.y -= ((u.delta.y * _this.options.speed) / 800);
         }

         if( u.position.x > _this.canvas.width ) {
           u.position.x = -7;
         } else if ( u.position.x < -7 ) {
           u.position.x = _this.canvas.width;
         }

         if( u.position.y > _this.canvas.height ) {
           u.position.y = -7;
           u.position.x = Math.floor(Math.random()*_this.canvas.width);
         } else if ( u.position.y < -7 ) {
           u.position.y = _this.canvas.height;
           u.position.x = Math.floor(Math.random()*_this.canvas.width);
         }

         if( _this.fade ) {
           u.opacity -= 0.02;
         } else {
           u.opacity -= 0.005;
         }

         if( u.opacity <= 0 ) {
           u.opacity = ( _this.fade ) ? 0 : 1;
         }

       }

       _this.draw( time );

       if( _this.fade ) {
         _this.fadeCount -= 1;
         if( _this.fadeCount < 0 ) {
           window.cancelAnimationFrame( _this.anim );
         } else {
           _this.update();
         }
       } else {
         _this.update();
       }

     });

  },

  "cancel" : function() {

    this.fadeCount = 100;

  },

  "over" : function() {

    window.cancelAnimationFrame( this.anim );

    for( var i = 0; i < this.options.count; i++ ) {
      this.particles[i].opacity = Math.random();
    }

    this.fade = false;
    this.update();

  },

  "out" : function() {

    this.fade = true;
    this.cancel();

  },



  "datauri" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAHCAYAAAD5wDa1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNDNFMzM5REEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDNFMzM5RUEyMkUxMUUzOEE3NEI3Q0U1QUIzMTc4NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0M0UzMzlCQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0M0UzMzlDQTIyRTExRTM4QTc0QjdDRTVBQjMxNzg2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jzOsUQAAANhJREFUeNqsks0KhCAUhW/Sz6pFSc1AD9HL+OBFbdsVOKWLajH9EE7GFBEjOMxcUNHD8dxPBCEE/DKyLGMqraoqcd4j0ChpUmlBEGCFRBzH2dbj5JycJAn90CEpy1J2SK4apVSM4yiKonhePYwxMU2TaJrm8BpykpWmKQ3D8FbX9SOO4/tOhDEG0zRhGAZo2xaiKDLyPGeSyPM8sCxr868+WC/mvu9j13XBtm1ACME8z7AsC/R9r0fGOf+arOu6jUwS7l6tT/B+xo+aDFRo5BykHfav3/gSYAAtIdQ1IT0puAAAAABJRU5ErkJggg=="

};
// $('img.photo',this).imagesLoaded(myFunction)
// execute a callback when all images have loaded.
// needed because .load() doesn't work on cached images

// mit license. paul irish. 2010.
// webkit fix from Oren Solomianik. thx!

// callback function is passed the last image to load
//   as an argument, and the collection as `this`


$.fn.imagesLoaded = function(callback){
  var elems = this.filter('img'),
      len   = elems.length,
      blank = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  elems.bind('load.imgloaded',function(){
      if (--len <= 0 && this.src !== blank){
        elems.unbind('load.imgloaded');
        callback.call(elems,this);
      }
  }).each(function(){
     // cached images don't fire load sometimes, so we reset src.
     if (this.complete || this.complete === undefined){
        var src = this.src;
        // webkit hack from https://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
        // data uri bypasses webkit log warning (thx doug jones)
        this.src = blank;
        this.src = src;
     }
  });

  return this;
};
//***END sparkle animation



//**START anime.js linedrawing homepage
var linedrawing = anime({
  targets: '.path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 10000,
  delay: function(el, i) { return i * 250 },
  // direction: 'alternate',
  loop: true
});
//**END anime.js linedrawing homepage


//*** START my aboutme carousel on the homepage
//source: https://codepen.io/gschier/pen/jkivt
var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};
//*** END my aboutme carousel on the homepage

// $(function() {
//    $(window).scroll(function () {
//       if ($(this).scrollTop() > 50) {
//         console.log(document.getElementsByClassName("backgroundpic"));
//          document.getElementsByClassName("backgroundpic").style.background("#000000");
//       }
//       if ($(this).scrollTop() < 50) {
//          document.getElementsByClassName("backgroundpic").style.background("transparent");
//       }
//    });
// });


//code for to change to opacity of the bouncing arrow on the homepage
//source: https://codepen.io/bewley/pen/revRQv
$(window).scroll(function(){
    $(".arrow").css("opacity", 1 - $(window).scrollTop() / 250);
  //250 is fade pixels
});


//***start javascript to overlay on images on homepage and project page***//
function textOverlay(){
  document.getElementById("textoverlay").textContent="ABOUT ME";
  document.getElementById("mypic").style.filter="saturate(20%) brightness(40%) contrast(94%)";
}

function textOverlayRem(){
  document.getElementById("textoverlay").textContent="";
  document.getElementById("mypic").style.filter="saturate(100%) brightness(100%) contrast(100%)";
}

function overlay(){
  document.getElementById("carouselimg").style.filter="saturate(20%) brightness(40%) contrast(94%)";
  document.getElementById("carouselimg2").style.filter="saturate(20%) brightness(40%) contrast(94%)";
  document.getElementById("textoverlay1").textContent="ANATOMAGE";
  document.getElementById("textoverlay2").textContent="WORKDOM";
}

function overlayRem(){
  document.getElementById("carouselimg").style.filter="saturate(100%) brightness(100%) contrast(100%)";
  document.getElementById("carouselimg2").style.filter="saturate(100%) brightness(100%) contrast(100%)";
  document.getElementById("textoverlay1").textContent="";
  document.getElementById("textoverlay2").textContent="";
}
//***end javascript to overlay on images on homepage***//

//turning bouncing arrow into a scroll button
$(document).ready(function (){
  $("#scroll").click(function (){
    $('body').animate({
      scrollTop: $("#scrollhere").offset().top
      }, 2000);
  });
});


$(".card2").hover(function(){
    var image = $(".card2");
    image.fadeOut(200, function () {
        image.attr('src', 'assets/images/workdomprojects2.png');
        image.fadeIn(200);
    })},
  function(){
    var image = $(".card2");
    image.fadeOut(200, function () {
        image.attr('src', 'assets/images/workdomprojects.png');
        image.fadeIn(200);
    });
});

$(".card1").hover(function(){
    var image = $(".card1");
    image.fadeOut(200, function () {
        image.attr('src', 'assets/images/anatomageprojects2.png');
        image.fadeIn(200);
    })},
  function(){
    var image = $(".card1");
    image.fadeOut(200, function () {
        image.attr('src', 'assets/images/anatomageprojects.png');
        image.fadeIn(200);
    });
});
