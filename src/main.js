var debug = false;

function Box(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}
Box.prototype.intersectsRect = function(rect) {
  return !(
       this.x > rect.x + rect.width - 1 
    || rect.x > this.x + this.width - 1
    || this.y > rect.y + rect.height - 1
    || rect.y > this.y + this.height - 1
  );
};



function randomColor() {
  function random() {
    return Math.floor(256 * Math.random());
  }
  return 'rgb('+random()+', '+random()+', '+random()+')';
}

function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}


function addEvent(element, eventName, callback) {
  if (element.addEventListener) {
    element.addEventListener(eventName, callback, false);
  } else if (element.attachEvent) {
    element.attachEvent("on" + eventName, callback);
  }
}


function Explosion(x, y) {
  var frameIndex = 0;
  var image = document.createElement('img');
  image.src = images.EXPLOSION;
  var canvas = document.createElement('canvas');
  x -= 16;
  y -= 16;
  canvas.width = 32;
  canvas.height = 32;
  canvas.style.position = 'absolute';
  canvas.style.left = x+'px';
  canvas.style.top = y+'px';
  document.body.appendChild(canvas);
  var context = canvas.getContext('2d');
  sounds.EXPLOSION.play();
  var interval = setInterval(function() {
    if(frameIndex >= 4) {
      clearInterval(interval);
      document.body.removeChild(canvas);
    } else {
      var frame = frames[frameIndex];
      context.clearRect(0,0,canvas.width,canvas.height);
      context.drawImage(image, frame.x, frame.y, 32, 32, 0, 0, 32, 32);
      frameIndex++;
    }
  }, 100);
}

window.onload = function() {
  //sound preparation
  
  var letters = [];
  var texts = textNodesUnder(document.body);
  texts.forEach(function(textNode) {
    var text = textNode.data;
    var parent = textNode.parentNode;
    var span = document.createElement('span');
    var chars = text.split('');
    chars.forEach(function(ch) {
      var subSpan = document.createElement('span');
      subSpan.innerHTML = ch;  
      if(debug)
        subSpan.style.backgroundColor = randomColor();
      if(/\s/.test(ch))
        subSpan.className = 'whitespace';
      else {
        subSpan.className = 'letter';
        letters.push({
          killed: false,
          lifeSpan: Math.random() * 2000,
          on: false,
          element: subSpan
        });
      }
      span.appendChild(subSpan);
    });
    parent.replaceChild(span, textNode);
  });
  setInterval(function() {
    var time = new Date().getTime();
    letters.forEach(function(letter) {
      if(!letter.killed)
        letter.element.style.visibility = 'visible';
      else if(letter.lifeSpan > 0) {
        letter.element.style.visibility = letter.on ? 'visible' : 'hidden';
        letter.on = !letter.on;
        letter.lifeSpan -= 100;
      } else {
        letter.element.style.visibility = 'hidden';
      }
    });
  }, 100);
  
  addEvent(document, 'mousedown', function(event) {
    new Explosion(event.pageX, event.pageY);
    setTimeout(function() {
      var attackBox = new Box(event.clientX-16, event.clientY-16, 32, 32);
      letters.forEach(function(letter) {
        letter.element.getClientRects().forEach(function(hitBox) {
          if(attackBox.intersectsRect(hitBox)) {
            letter.killed = true;
            letter.on = Math.random() > 0.5;
          }
        });
      });
    }, 200);
  });
};