;(function (window) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

  const FRAME_RATE = 60
  const PARTICLE_NUM = 2000
  const RADIUS = Math.PI * 2
  const CANVASWIDTH = 700
  const CANVASHEIGHT = 500
  const CANVASID = 'canvas'

  let texts = ['MI AMOR', 'NO TENGO', 'MUCHO PARA', 'TI,', 'SE QUE', 'NO HE', 'SIDO EL', 'MEJOR', 'CONTIGO,', 'PERO','TEN EN', 'CUENTA', 'QUE YO','TE AMO', 'DE VERDAD','DARÍA MI', 'VIDA POR', 'TI,', 'ESTOS', 'ÚLTIMOS', 'DÍAS NO', 'HAN SIDO', 'LOS','MEJORES,', 'TANTAS', 'COSAS QUE', 'PASAN,', 'SOLO', 'ESPERO', 'QUE ME', 'PUEDAS', 'PERDONAR', 'POR TODO', 'LO QUE TE', ' HICE.','AHORA SI', 'HOY ES UN', 'DÍA MUY', 'ESPECIAL', 'PARA', 'NOSOTROS,', 'PUES', 'SEGUIMOS', 'CUMPLIENDO', 'MESES', 'YA', 'PASAMOS A', 'UN AÑO Y', 'UN MES.', 'TODO', 'ESTE', 'TIEMPO', 'CONTIGO', 'ES LO', 'MEJOR DE', 'MI VIDA,', 'LO ÚNICO', 'QUE', 'QUIERO ES', 'PODER', 'QUEDARME', 'PARA', 'SIEMPRE.', 'SE QUE ES', 'CANSADO', 'Y ME', 'REFIERO A', 'ESTO DE', 'LEER Y', 'DAR CLICK', 'ESO ES', 'TODO', 'NA!', 'ES MENTIRA,', 'ENTRA', 'AL LINK', '<=']

  // Crea el enlace
const enlace = document.createElement('a');
enlace.textContent = '💗';
enlace.href = 'https://acortar.link/loca';

// Agrega el enlace al contenedor
const contenedor = document.getElementById('enlace-vertical');
contenedor.appendChild(enlace);

// Posiciona el enlace verticalmente
enlace.style.position = 'absolute';
enlace.style.top = '0';
enlace.style.right = '0';
enlace.style.bottom = '0';
enlace.style.width = '2px';
enlace.style.backgroundColor = '#000';
enlace.style.color = '#fff';
enlace.style.padding = '10px';
enlace.style.textDecoration = 'none';

  let canvas,
    ctx,
    particles = [],
    quiver = true,
    text = texts[0],
    textIndex = 0,
    textSize = 30

    function draw() {
      // Limpiar el área del lienzo
      ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.textBaseline = 'middle';
      ctx.font = textSize + 'px \'Open Sans\', \'Avenir\', \'Helvetica Neue\', \'Arial\', \'sans-serif\'';
    
      // Dividir el texto en líneas
      const lines = wrapText(ctx, text, CANVASWIDTH);
      const lineHeight = textSize * 1.2; // Ajustar el espaciado entre líneas
      const startX = (CANVASWIDTH - ctx.measureText(text).width) / 2;
      const startY= (CANVASHEIGHT - (lines.length * lineHeight)) / 2;
    
      // Dibujar cada línea
      lines.forEach((line, index) => {
        const textWidth = ctx.measureText(line).width;
        const xPosition = (CANVASWIDTH - textWidth) / 2;
        const yPosition = startY + index * lineHeight;
        ctx.fillText(line, xPosition, yPosition);
      });
    
      const imgData = ctx.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT);
      ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT);
    
      for (let i = 0, l = particles.length; i < l; i++) {
        let p = particles[i];
        p.inText = false;
      }
      particleText(imgData);
    
      window.requestAnimationFrame(draw);
    }
    
    function wrapText(ctx, text, maxWidth) {
      const words = text.split(' ');
      let lines = [];
      let currentLine = '';
    
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (ctx.measureText(currentLine + ' ' + word).width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }    

    function particleText(imgData) {
      var pxls = [];
      for (var w = CANVASWIDTH; w > 0; w -= 1) {
        for (var h = 0; h < CANVASHEIGHT; h += 1) {
          var index = (w + h * (CANVASWIDTH)) * 4;
          if (imgData.data[index] > 1) {
            pxls.push([w, h]);
          }
        }
      }

    var count = pxls.length
    var j = parseInt((particles.length - pxls.length) / 2, 10)
    j = j < 0 ? 0 : j

    for (var i = 0; i < pxls.length && j < particles.length; i++, j++) {
      try {
        var p = particles[j],
          X,
          Y

        if (quiver) {
          X = (pxls[i - 1][0]) - (p.px + Math.random() * 10)
          Y = (pxls[i - 1][1]) - (p.py + Math.random() * 10)
        } else {
          X = (pxls[i - 1][0]) - p.px
          Y = (pxls[i - 1][1]) - p.py
        }
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)
        p.x = p.px + C * T * p.delta
        p.y = p.py + S * T * p.delta
        p.px = p.x
        p.py = p.y
        p.inText = true
        p.fadeIn()
        p.draw(ctx)
      } catch (e) {}
    }
    for (var i = 1; i < particles.length; i++) {
      var p = particles[i]
      if (!p.inText) {
        p.fadeOut()

        var X = p.mx - p.px
        var Y = p.my - p.py
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)

        p.x = p.px + C * T * p.delta / 2
        p.y = p.py + S * T * p.delta / 2
        p.px = p.x
        p.py = p.y

        p.draw(ctx)
      }
    }
  }

  function setDimensions () {
    canvas.width = CANVASWIDTH
    canvas.height = CANVASHEIGHT
    canvas.style.position = 'absolute'
    canvas.style.left = '50%'
    canvas.style.top = '50%'
    canvas.style.transform = 'translate(-50%, -50%)'
  }

  function event () {
    document.addEventListener('click', function (e) {
      textIndex++
      if (textIndex >= texts.length) {
        textIndex--
        return
      }
      text = texts[textIndex]
      console.log(textIndex)
    }, false)

    document.addEventListener('touchstart', function (e) {
      textIndex++
      if (textIndex >= texts.length) {
        textIndex--
        return
      }
      text = texts[textIndex]
      console.log(textIndex)
    }, false)
  }

  function init () {
    canvas = document.getElementById(CANVASID)
    if (canvas === null || !canvas.getContext) {
      return
    }
    ctx = canvas.getContext('2d')
    setDimensions()
    event()

    for (var i = 0; i < PARTICLE_NUM; i++) {
      particles[i] = new Particle(canvas)
    }

    draw()
  }

  class Particle {
    constructor (canvas) {
      let spread = canvas.height
      let size = Math.random() * 1.2

      this.delta = 0.06

      this.x = 0
      this.y = 0

      this.px = Math.random() * canvas.width
      this.py = (canvas.height * 0.5) + ((Math.random() - 0.5) * spread)

      this.mx = this.px
      this.my = this.py

      this.size = size

      this.inText = false
   
      this.opacity = 0
      this.fadeInRate = 0.005
      this.fadeOutRate = 0.03
      this.opacityTresh = 0.98
      this.fadingOut = true
      this.fadingIn = true
    }
    fadeIn () {
      this.fadingIn = this.opacity > this.opacityTresh ? false : true
      if (this.fadingIn) {
        this.opacity += this.fadeInRate
      }else {
        this.opacity = 1
      }
    }
    fadeOut () {
      this.fadingOut = this.opacity < 0 ? false : true
      if (this.fadingOut) {
        this.opacity -= this.fadeOutRate
        if (this.opacity < 0) {
          this.opacity = 0
        }
      }else {
        this.opacity = 0
      }
    }
    draw (ctx) {
      ctx.fillStyle = 'rgba(226,225,142, ' + this.opacity + ')'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, RADIUS, true)
      ctx.closePath()
      ctx.fill()
    }
  }
  
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if(!isChrome){
      $('#iframeAudio').remove()
  }
  
  init()  
})(window)
