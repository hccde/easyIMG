/*!
 * wordcloud2.js
 * http://timdream.org/wordcloud2.js/
 *
 * Copyright 2011 - 2013 Tim Chien
 * Released under the MIT license
 */

'use strict';

const regeneratorRuntime = require('../regenerator-runtime')

  // Check if WordCloud can run on this browser
  var isSupported = true;

  // Find out if the browser impose minium font size by
  // drawing small texts on a canvas and measure it's width.
  var minFontSize = 12;

  // Based on http://jsfromhell.com/array/shuffle
  var shuffleArray = function shuffleArray(arr) {
    for (var j, x, i = arr.length; i;
      j = Math.floor(Math.random() * i),
      x = arr[--i], arr[i] = arr[j],
      arr[j] = x) {}
    return arr;
  };

  var WordCloud = function WordCloud(wxctx, options,canvasWidth,canvasHeight,canvasId,that) { //入参改为微信的canvas ctx
    if (!isSupported) {
      return;
    }


    /* Default values to be overwritten by options object */
    var settings = {
      list: [],
      fontFamily: '"Trebuchet MS", "Heiti TC", "微軟正黑體", ' +
                  '"Arial Unicode MS", "Droid Fallback Sans", sans-serif',
      fontWeight: 'normal',
      color: 'random-dark',
      minSize: 0, // 0 to disable
      weightFactor: 1,
      clearCanvas: true,
      backgroundColor: '#fff',  // opaque white = rgba(255, 255, 255, 1)

      gridSize: 8,
      drawOutOfBound: false,
      origin: null,

      drawMask: false,
      maskColor: 'rgba(255,0,0,0.3)',
      maskGapWidth: 0.3,

      wait: 1, //wait time 改为1 走setTimeout 的逻辑
      abortThreshold: 0, // disabled
      abort: function noop() {},

      minRotation: - Math.PI / 2,
      maxRotation: Math.PI / 2,
      rotationSteps: 0,

      shuffle: true,
      rotateRatio: 0.1,

      shape: 'circle',
      ellipticity: 0.65,

      classes: null,

      hover: null,
      click: null
    };

    if (options) {
      for (var key in options) {
        if (key in settings) {
          settings[key] = options[key];
        }
      }
    }

    /* Convert weightFactor into a function */
    if (typeof settings.weightFactor !== 'function') {
      var factor = settings.weightFactor;
      settings.weightFactor = function weightFactor(pt) {
        return pt * factor; //in px
      };
    }

    /* Convert shape into a function */
    if (typeof settings.shape !== 'function') {
      switch (settings.shape) {
        case 'circle':
        /* falls through */
        default:
          // 'circle' is the default and a shortcut in the code loop.
          settings.shape = 'circle';
          break;

        case 'cardioid':
          settings.shape = function shapeCardioid(theta) {
            return 1 - Math.sin(theta);
          };
          break;

        /*

        To work out an X-gon, one has to calculate "m",
        where 1/(cos(2*PI/X)+m*sin(2*PI/X)) = 1/(cos(0)+m*sin(0))
        http://www.wolframalpha.com/input/?i=1%2F%28cos%282*PI%2FX%29%2Bm*sin%28
        2*PI%2FX%29%29+%3D+1%2F%28cos%280%29%2Bm*sin%280%29%29

        Copy the solution into polar equation r = 1/(cos(t') + m*sin(t'))
        where t' equals to mod(t, 2PI/X);

        */

        case 'diamond':
          // http://www.wolframalpha.com/input/?i=plot+r+%3D+1%2F%28cos%28mod+
          // %28t%2C+PI%2F2%29%29%2Bsin%28mod+%28t%2C+PI%2F2%29%29%29%2C+t+%3D
          // +0+..+2*PI
          settings.shape = function shapeSquare(theta) {
            var thetaPrime = theta % (2 * Math.PI / 4);
            return 1 / (Math.cos(thetaPrime) + Math.sin(thetaPrime));
          };
          break;

        case 'square':
          // http://www.wolframalpha.com/input/?i=plot+r+%3D+min(1%2Fabs(cos(t
          // )),1%2Fabs(sin(t)))),+t+%3D+0+..+2*PI
          settings.shape = function shapeSquare(theta) {
            return Math.min(
              1 / Math.abs(Math.cos(theta)),
              1 / Math.abs(Math.sin(theta))
            );
          };
          break;

        case 'triangle-forward':
          // http://www.wolframalpha.com/input/?i=plot+r+%3D+1%2F%28cos%28mod+
          // %28t%2C+2*PI%2F3%29%29%2Bsqrt%283%29sin%28mod+%28t%2C+2*PI%2F3%29
          // %29%29%2C+t+%3D+0+..+2*PI
          settings.shape = function shapeTriangle(theta) {
            var thetaPrime = theta % (2 * Math.PI / 3);
            return 1 / (Math.cos(thetaPrime) +
                        Math.sqrt(3) * Math.sin(thetaPrime));
          };
          break;

        case 'triangle':
        case 'triangle-upright':
          settings.shape = function shapeTriangle(theta) {
            var thetaPrime = (theta + Math.PI * 3 / 2) % (2 * Math.PI / 3);
            return 1 / (Math.cos(thetaPrime) +
                        Math.sqrt(3) * Math.sin(thetaPrime));
          };
          break;

        case 'pentagon':
          settings.shape = function shapePentagon(theta) {
            var thetaPrime = (theta + 0.955) % (2 * Math.PI / 5);
            return 1 / (Math.cos(thetaPrime) +
                        0.726543 * Math.sin(thetaPrime));
          };
          break;

        case 'star':
          settings.shape = function shapeStar(theta) {
            var thetaPrime = (theta + 0.955) % (2 * Math.PI / 10);
            if ((theta + 0.955) % (2 * Math.PI / 5) - (2 * Math.PI / 10) >= 0) {
              return 1 / (Math.cos((2 * Math.PI / 10) - thetaPrime) +
                          3.07768 * Math.sin((2 * Math.PI / 10) - thetaPrime));
            } else {
              return 1 / (Math.cos(thetaPrime) +
                          3.07768 * Math.sin(thetaPrime));
            }
          };
          break;
      }
    }

    /* Make sure gridSize is a whole number and is not smaller than 4px */
    settings.gridSize = Math.max(Math.floor(settings.gridSize), 4);

    /* shorthand */
    var g = settings.gridSize;
    var maskRectWidth = g - settings.maskGapWidth;

    /* normalize rotation settings */
    var rotationRange = Math.abs(settings.maxRotation - settings.minRotation);
    var rotationSteps = Math.abs(Math.floor(settings.rotationSteps));
    var minRotation = Math.min(settings.maxRotation, settings.minRotation);

    /* information/object available to all functions, set when start() */
    var grid, // 2d array containing filling information
      ngx, ngy, // width and height of the grid
      center, // position of the center of the cloud
      maxRadius;

    /* timestamp for measuring each putWord() action */
    var escapeTime;

    /* function for getting the color of the text */
    var getTextColor;
    function random_hsl_color(min, max) {
      return 'rgb(' +
        (Math.random() * 255).toFixed() + ',' +
        (Math.random() * 255).toFixed() + ',' +
        (Math.random() * 255).toFixed() + ')';
    }
    switch (settings.color) {
      case 'random-dark':
        getTextColor = function getRandomDarkColor() {
          return random_hsl_color(10, 50);
        };
        break;

      case 'random-light':
        getTextColor = function getRandomLightColor() {
          return random_hsl_color(50, 90);
        };
        break;

      default:
        if (typeof settings.color === 'function') {
          getTextColor = settings.color;
        }
        break;
    }

    /* function for getting the font-weight of the text */
    var getTextFontWeight;
    if (typeof settings.fontWeight === 'function') {
      getTextFontWeight = settings.fontWeight;
    }

    /* function for getting the classes of the text */
    var getTextClasses = null;
    if (typeof settings.classes === 'function') {
      getTextClasses = settings.classes;
    }

    /* Interactive */
    var interactive = false;
    var infoGrid = [];
    var hovered;

    //不需要交互
    // var getInfoGridFromMouseTouchEvent =
    // function getInfoGridFromMouseTouchEvent(evt) {
    //   var canvas = evt.currentTarget;
    //   var rect = canvas.getBoundingClientRect();
    //   var clientX;
    //   var clientY;
    //   /** Detect if touches are available */
    //   if (evt.touches) {
    //     clientX = evt.touches[0].clientX;
    //     clientY = evt.touches[0].clientY;
    //   } else {
    //     clientX = evt.clientX;
    //     clientY = evt.clientY;
    //   }
    //   var eventX = clientX - rect.left;
    //   var eventY = clientY - rect.top;

    //   var x = Math.floor(eventX * ((canvas.width / rect.width) || 1) / g);
    //   var y = Math.floor(eventY * ((canvas.height / rect.height) || 1) / g);

    //   return infoGrid[x][y];
    // };

    // var wordcloudhover = function wordcloudhover(evt) {
    //   var info = getInfoGridFromMouseTouchEvent(evt);

    //   if (hovered === info) {
    //     return;
    //   }

    //   hovered = info;
    //   if (!info) {
    //     settings.hover(undefined, undefined, evt);

    //     return;
    //   }

    //   settings.hover(info.item, info.dimension, evt);

    // };

    // var wordcloudclick = function wordcloudclick(evt) {
    //   var info = getInfoGridFromMouseTouchEvent(evt);
    //   if (!info) {
    //     return;
    //   }

    //   settings.click(info.item, info.dimension, evt);
    //   evt.preventDefault();
    // };

    /* Get points on the grid for a given radius away from the center */
    var pointsAtRadius = [];
    var getPointsAtRadius = function getPointsAtRadius(radius) {
      if (pointsAtRadius[radius]) {
        return pointsAtRadius[radius];
      }

      // Look for these number of points on each radius
      var T = radius * 8;

      // Getting all the points at this radius
      var t = T;
      var points = [];

      if (radius === 0) {
        points.push([center[0], center[1], 0]);
      }

      while (t--) {
        // distort the radius to put the cloud in shape
        var rx = 1;
        if (settings.shape !== 'circle') {
          rx = settings.shape(t / T * 2 * Math.PI); // 0 to 1
        }

        // Push [x, y, t]; t is used solely for getTextColor()
        points.push([
          center[0] + radius * rx * Math.cos(-t / T * 2 * Math.PI),
          center[1] + radius * rx * Math.sin(-t / T * 2 * Math.PI) *
            settings.ellipticity,
          t / T * 2 * Math.PI]);
      }

      pointsAtRadius[radius] = points;
      return points;
    };

    /* Return true if we had spent too much time */
    var exceedTime = function exceedTime() {
      return ((settings.abortThreshold > 0) &&
        ((new Date()).getTime() - escapeTime > settings.abortThreshold));
    };

    /* Get the deg of rotation according to settings, and luck. */
    var getRotateDeg = function getRotateDeg() {
      if (settings.rotateRatio === 0) {
        return 0;
      }

      if (Math.random() > settings.rotateRatio) {
        return 0;
      }

      if (rotationRange === 0) {
        return minRotation;
      }

      if (rotationSteps > 0) {
        // Min rotation + zero or more steps * span of one step
        return minRotation +
          Math.floor(Math.random() * rotationSteps) *
          rotationRange / (rotationSteps - 1);
      }
      else {
        return minRotation + Math.random() * rotationRange;
      }
    };

    var mu = 1; //todo 
    var getTextInfo = async function getTextInfo(word, weight, rotateDeg) { //改为async函数
      // calculate the acutal font size
      // fontSize === 0 means weightFactor function wants the text skipped,
      // and size < minSize means we cannot draw the text.
      var debug = false;
      var fontSize = settings.weightFactor(weight);
      if (fontSize <= settings.minSize) {
        return false;
      }

      // Scale factor here is to make sure fillText is not limited by
      // the minium font size set by browser.
      // It will always be 1 or 2n.
      // var mu = 1;
      if (fontSize < minFontSize) {
        mu = (function calculateScaleFactor() {
          var mu = 2;
          while (mu * fontSize < minFontSize) {
            mu += 2;
          }
          return mu;
        })();
      }

      // Get fontWeight that will be used to set fctx.font
      var fontWeight;
      if (getTextFontWeight) {
        fontWeight = getTextFontWeight(word, weight, fontSize);
      } else {
        fontWeight = settings.fontWeight;
      }

      // var fcanvas = document.createElement('canvas');
      // var fctx = fcanvas.getContext('2d', { willReadFrequently: true });

      wxctx.font = fontWeight + ' ' +
        (fontSize * mu).toString(10) + 'px ' + settings.fontFamily;

      // Estimate the dimension of the text with measureText().
      var fw = wxctx.measureText(word).width / mu;
      var fh = Math.max(fontSize * mu,
                        wxctx.measureText('m').width,
                        wxctx.measureText('\uFF37').width) / mu;

      // Create a boundary box that is larger than our estimates,
      // so text don't get cut of (it sill might)
      var boxWidth = fw + fh * 2;
      var boxHeight = fh * 3;
      var fgw = Math.ceil(boxWidth / g);
      var fgh = Math.ceil(boxHeight / g);
      boxWidth = fgw * g;
      boxHeight = fgh * g;

      // Calculate the proper offsets to make the text centered at
      // the preferred position.

      // This is simply half of the width.
      var fillTextOffsetX = - fw / 2;
      // Instead of moving the box to the exact middle of the preferred
      // position, for Y-offset we move 0.4 instead, so Latin alphabets look
      // vertical centered.
      var fillTextOffsetY = - fh * 0.4;

      // Calculate the actual dimension of the canvas, considering the rotation.
      var cgh = Math.ceil((boxWidth * Math.abs(Math.sin(rotateDeg)) +
                           boxHeight * Math.abs(Math.cos(rotateDeg))) / g);
      var cgw = Math.ceil((boxWidth * Math.abs(Math.cos(rotateDeg)) +
                           boxHeight * Math.abs(Math.sin(rotateDeg))) / g);
      var width = cgw * g;
      var height = cgh * g;

        //这里可能有bug
      // fcanvas.setAttribute('width', width);
      // fcanvas.setAttribute('height', height);

      // if (debug) {
      //   // Attach fcanvas to the DOM
      //   // document.body.appendChild(fcanvas);
      //   // Save it's state so that we could restore and draw the grid correctly.
      //   fctx.save();
      // }

      // Scale the canvas with |mu|.
      wxctx.scale(1 / mu, 1 / mu);
      wxctx.translate(width * mu / 2, height * mu / 2); //todo
      wxctx.rotate(- rotateDeg);

      // Once the width/height is set, ctx info will be reset.
      // Set it again here.
      var wxctxfont = fontWeight + ' ' +
        (fontSize * mu).toString(10) + 'px ' + settings.fontFamily;
      wxctx.setFontSize(wxctxfont);
      // Fill the text into the fcanvas.
      // XXX: We cannot because textBaseline = 'top' here because
      // Firefox and Chrome uses different default line-height for canvas.
      // Please read https://bugzil.la/737852#c6.
      // Here, we use textBaseline = 'middle' and draw the text at exactly
      // 0.5 * fontSize lower.
      // wxctx.fillStyle = '#000';
      // wxctx.textBaseline = 'middle';
      // wxctx.fillText(word, fillTextOffsetX * mu,
      //               (fillTextOffsetY + fontSize * 0.5) * mu);
      // Get the pixels of the text
      // wxctx.draw(true)
      // console.log(fillTextOffsetX * mu,(fillTextOffsetY + fontSize * 0.5) * mu,77)
      await new Promise(function(reslove,reject){
        wxctx.draw(true,function(){
          reslove(true)
        })
      })
      var imageData = await new Promise(function(reslove,reject){
        wx.canvasGetImageData({
          canvasId: canvasId,
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight,
          success(res) {
            reslove(res.data); //imagedata
          },
          fail(err){
            reject({
              msg:'获取像素失败',
              err:err
            });
          }
        },that)
      })
      // var imageData = wxctx.getImageData(0, 0, width, height).data; //todo


      // if (exceedTime()) {
      //   return false;
      // }

      // if (debug) {
      //   // Draw the box of the original estimation
      //   fctx.strokeRect(fillTextOffsetX * mu,
      //                   fillTextOffsetY, fw * mu, fh * mu);
      //   fctx.restore();
      // }

      // Read the pixels and save the information to the occupied array
      var occupied = [];
      var gx = cgw, gy, x, y;
      var bounds = [cgh / 2, cgw / 2, cgh / 2, cgw / 2];
      while (gx--) {
        gy = cgh;
        while (gy--) {
          y = g;
          singleGridLoop: {
            while (y--) {
              x = g;
              while (x--) {
                if (imageData[((gy * g + y) * width +
                               (gx * g + x)) * 4 + 3]) {
                  occupied.push([gx, gy]);

                  if (gx < bounds[3]) {
                    bounds[3] = gx;
                  }
                  if (gx > bounds[1]) {
                    bounds[1] = gx;
                  }
                  if (gy < bounds[0]) {
                    bounds[0] = gy;
                  }
                  if (gy > bounds[2]) {
                    bounds[2] = gy;
                  }

                  // if (debug) {
                  //   fctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                  //   fctx.fillRect(gx * g, gy * g, g - 0.5, g - 0.5);
                  // }
                  break singleGridLoop;
                }
              }
            }
            // if (debug) {
            //   fctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
            //   fctx.fillRect(gx * g, gy * g, g - 0.5, g - 0.5);
            // }
          }
        }
      }

      // if (debug) {
      //   fctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      //   fctx.fillRect(bounds[3] * g,
      //                 bounds[0] * g,
      //                 (bounds[1] - bounds[3] + 1) * g,
      //                 (bounds[2] - bounds[0] + 1) * g);
      // }

      // Return information needed to create the text on the real canvas
      return {
        mu: mu,
        occupied: occupied,
        bounds: bounds,
        gw: cgw,
        gh: cgh,
        fillTextOffsetX: fillTextOffsetX,
        fillTextOffsetY: fillTextOffsetY,
        fillTextWidth: fw,
        fillTextHeight: fh,
        fontSize: fontSize
      };
    };

    /* Determine if there is room available in the given dimension */
    var canFitText = function canFitText(gx, gy, gw, gh, occupied) {
      // Go through the occupied points,
      // return false if the space is not available.
      var i = occupied.length;
      while (i--) {
        var px = gx + occupied[i][0];
        var py = gy + occupied[i][1];

        if (px >= ngx || py >= ngy || px < 0 || py < 0) {
          if (!settings.drawOutOfBound) {
            return false;
          }
          continue;
        }

        if (!grid[px][py]) {
          return false;
        }
      }
      return true;
    };

    /* Actually draw the text on the grid */
    var drawText = function drawText(gx, gy, info, word, weight,
                                     distance, theta, rotateDeg, attributes) {

      var fontSize = info.fontSize;
      var color;
      if (getTextColor) {
        color = getTextColor(word, weight, fontSize, distance, theta);
      } else {
        color = settings.color;
      }

      // get fontWeight that will be used to set ctx.font and font style rule
      var fontWeight;
      if (getTextFontWeight) {
        fontWeight = getTextFontWeight(word, weight, fontSize);
      } else {
        fontWeight = settings.fontWeight;
      }

      var classes;
      if (getTextClasses) {
        classes = getTextClasses(word, weight, fontSize);
      } else {
        classes = settings.classes;
      }

      var dimension;
      var bounds = info.bounds;
      dimension = {
        x: (gx + bounds[3]) * g,
        y: (gy + bounds[0]) * g,
        w: (bounds[1] - bounds[3] + 1) * g,
        h: (bounds[2] - bounds[0] + 1) * g
      };

      // (function() {
          // Save the current state before messing it
          wxctx.save();
          wxctx.scale(1 / mu, 1 / mu);

          wxctx.font = fontWeight + ' ' +
                     (fontSize * mu).toString(10) + 'px ' + settings.fontFamily;
                     wxctx.fillStyle = color;

          // Translate the canvas position to the origin coordinate of where
          // the text should be put.
          wxctx.translate((gx + info.gw / 2) * g * mu,
                        (gy + info.gh / 2) * g * mu);

          if (rotateDeg !== 0) {
            wxctx.rotate(- rotateDeg);
          }

          // Finally, fill the text.

          // XXX: We cannot because textBaseline = 'top' here because
          // Firefox and Chrome uses different default line-height for canvas.
          // Please read https://bugzil.la/737852#c6.
          // Here, we use textBaseline = 'middle' and draw the text at exactly
          // 0.5 * fontSize lower.
          wxctx.textBaseline = 'middle';
          wxctx.fillText(word, info.fillTextOffsetX * mu,
                             (info.fillTextOffsetY + fontSize * 0.5) * mu);
          // wxctx.draw();
          console.log(info.fillTextOffsetX * mu,(info.fillTextOffsetY + fontSize * 0.5) * mu)
          // The below box is always matches how <span>s are positioned
          /* ctx.strokeRect(info.fillTextOffsetX, info.fillTextOffsetY,
            info.fillTextWidth, info.fillTextHeight); */

          // Restore the state.
          wxctx.restore();
        
      // })();
    };

    /* Help function to updateGrid */
    var fillGridAt = function fillGridAt(x, y, drawMask, dimension, item) {
      if (x >= ngx || y >= ngy || x < 0 || y < 0) {
        return;
      }

      grid[x][y] = false;

      // if (drawMask) {
      //   var ctx = elements[0].getContext('2d');
      //   ctx.fillRect(x * g, y * g, maskRectWidth, maskRectWidth);
      // }

      // if (interactive) {
      //   infoGrid[x][y] = { item: item, dimension: dimension };
      // }
    };

    /* Update the filling information of the given space with occupied points.
       Draw the mask on the canvas if necessary. */
    var updateGrid = function updateGrid(gx, gy, gw, gh, info, item) {
      var occupied = info.occupied;
      var drawMask = settings.drawMask;
      var ctx;
      if (drawMask) { //todo rm
        ctx = elements[0].getContext('2d');
        ctx.save();
        ctx.fillStyle = settings.maskColor;
      }

      var dimension;
      if (interactive) {
        var bounds = info.bounds;
        dimension = {
          x: (gx + bounds[3]) * g,
          y: (gy + bounds[0]) * g,
          w: (bounds[1] - bounds[3] + 1) * g,
          h: (bounds[2] - bounds[0] + 1) * g
        };
      }

      var i = occupied.length;
      while (i--) {
        var px = gx + occupied[i][0];
        var py = gy + occupied[i][1];

        if (px >= ngx || py >= ngy || px < 0 || py < 0) {
          continue;
        }

        fillGridAt(px, py, drawMask, dimension, item);
      }

      if (drawMask) {
        ctx.restore();
      }
    };

    /* putWord() processes each item on the list,
       calculate it's size and determine it's position, and actually
       put it on the canvas. */
    var putWord = async function putWord(item) {
      var word, weight, attributes;
      if (Array.isArray(item)) {
        word = item[0];
        weight = item[1];
      } else {
        word = item.word;
        weight = item.weight;
        attributes = item.attributes;
      }
      var rotateDeg = getRotateDeg();
      // get info needed to put the text onto the canvas
      var info = await getTextInfo(word, weight, rotateDeg);

      // not getting the info means we shouldn't be drawing this one.
      // if (!info) {
      //   return false;
      // }

      // if (exceedTime()) {
      //   return false;
      // }


      // If drawOutOfBound is set to false,
      // skip the loop if we have already know the bounding box of
      // word is larger than the canvas.
      if (!settings.drawOutOfBound) {
        var bounds = info.bounds;
        if ((bounds[1] - bounds[3] + 1) > ngx ||
          (bounds[2] - bounds[0] + 1) > ngy) {
          return false;
        }
      }

      // Determine the position to put the text by
      // start looking for the nearest points
      var r = maxRadius + 1;

      var tryToPutWordAtPoint = function(gxy) {
        var gx = Math.floor(gxy[0] - info.gw / 2);
        var gy = Math.floor(gxy[1] - info.gh / 2);
        var gw = info.gw;
        var gh = info.gh;
        
        // If we cannot fit the text at this position, return false
        // and go to the next position.
        console.log(info)
        if (!canFitText(gx, gy, gw, gh, info.occupied)) {
          return false;
        }

        // Actually put the text on the canvas
        drawText(gx, gy, info, word, weight,
                 (maxRadius - r), gxy[2], rotateDeg, attributes);
        // Mark the spaces on the grid as filled
        updateGrid(gx, gy, gw, gh, info, item);

        // Return true so some() will stop and also return true.
        return true;
      };

      while (r--) {
        var points = getPointsAtRadius(maxRadius - r);

        if (settings.shuffle) {
          points = [].concat(points);
          shuffleArray(points);
        }

        // Try to fit the words by looking at each point.
        // array.some() will stop and return true
        // when putWordAtPoint() returns true.
        // If all the points returns false, array.some() returns false.
        var drawn = points.some(tryToPutWordAtPoint);

        if (drawn) {
          // leave putWord() and return true
          return true;
        }
      }
      // we tried all distances but text won't fit, return false
      return false;
    };

    /* Send DOM event to all elements. Will stop sending event and return
       if the previous one is canceled (for cancelable events). */
    var sendEvent = function sendEvent(type, cancelable, detail) {
      if (cancelable) {
        return !elements.some(function(el) {
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(type, true, cancelable, detail || {});
          return !el.dispatchEvent(evt);
        }, this);
      } else {
        elements.forEach(function(el) {
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(type, true, cancelable, detail || {});
          el.dispatchEvent(evt);
        }, this);
      }
    };

    /* Start drawing on a canvas */
    var grid = [];
    var start = function start() {
      // For dimensions, clearCanvas etc.,
      // we only care about the first element.
      // var canvas = elements[0];

        ngx = Math.ceil(canvasWidth / g);
        ngy = Math.ceil(canvasHeight / g);

      // Sending a wordcloudstart event which cause the previous loop to stop.
      // Do nothing if the event is canceled.
      // if (!sendEvent('wordcloudstart', true)) {
      //   return;
      // }

      // Determine the center of the word cloud
      center = (settings.origin) ?
        [settings.origin[0]/g, settings.origin[1]/g] :
        [ngx / 2, ngy / 2];

      // Maxium radius to look for space
      maxRadius = Math.floor(Math.sqrt(ngx * ngx + ngy * ngy));

      /* Clear the canvas only if the clearCanvas is set,
         if not, update the grid to the current canvas state */
      

      var gx, gy, i;
      // if (settings.clearCanvas) {
        // elements.forEach(function(el) {
        //   if (el.getContext) {
        //     var ctx = el.getContext('2d');
        //     ctx.fillStyle = settings.backgroundColor;
        //     ctx.clearRect(0, 0, ngx * (g + 1), ngy * (g + 1));
        //     ctx.fillRect(0, 0, ngx * (g + 1), ngy * (g + 1));
        //   } else {
        //     el.textContent = '';
        //     el.style.backgroundColor = settings.backgroundColor;
        //     el.style.position = 'relative';
        //   }
        // });

        // /* fill the grid with empty state */
        gx = ngx;
        while (gx--) {
          grid[gx] = [];
          gy = ngy;
          while (gy--) {
            grid[gx][gy] = true;
          }
        }
      // } else {
        //背景颜色的处理 注释掉
        /* Determine bgPixel by creating
           another canvas and fill the specified background color. */
        // var bctx = document.createElement('canvas').getContext('2d');

        // bctx.fillStyle = settings.backgroundColor;
        // bctx.fillRect(0, 0, 1, 1);
        // var bgPixel = bctx.getImageData(0, 0, 1, 1).data;

        // /* Read back the pixels of the canvas we got to tell which part of the
        //    canvas is empty.
        //    (no clearCanvas only works with a canvas, not divs) */
        // var imageData =
        //   canvas.getContext('2d').getImageData(0, 0, ngx * g, ngy * g).data;

        // gx = ngx;
        // var x, y;
        // while (gx--) {
        //   grid[gx] = [];
        //   gy = ngy;
        //   while (gy--) {
        //     y = g;
        //     singleGridLoop: while (y--) {
        //       x = g;
        //       while (x--) {
        //         i = 4;
        //         while (i--) {
        //           if (imageData[((gy * g + y) * ngx * g +
        //                          (gx * g + x)) * 4 + i] !== bgPixel[i]) {
        //             grid[gx][gy] = false;
        //             break singleGridLoop;
        //           }
        //         }
        //       }
        //     }
        //     if (grid[gx][gy] !== false) {
        //       grid[gx][gy] = true;
        //     }
        //   }
        // }

        // imageData = bctx = bgPixel = undefined;
      }

      // fill the infoGrid with empty state if we need it
      // if (settings.hover || settings.click) {

      //   interactive = true;

      //   /* fill the grid with empty state */
      //   gx = ngx + 1;
      //   while (gx--) {
      //     infoGrid[gx] = [];
      //   }

      //   if (settings.hover) {
      //     canvas.addEventListener('mousemove', wordcloudhover);
      //   }

      //   var touchend = function (e) {
      //     e.preventDefault();
      //   };

      //   if (settings.click) {
      //     canvas.addEventListener('click', wordcloudclick);
      //     canvas.addEventListener('touchstart', wordcloudclick);
      //     canvas.addEventListener('touchend', touchend);
      //     canvas.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)';
      //   }

      //   canvas.addEventListener('wordcloudstart', function stopInteraction() {
      //     canvas.removeEventListener('wordcloudstart', stopInteraction);

      //     canvas.removeEventListener('mousemove', wordcloudhover);
      //     canvas.removeEventListener('click', wordcloudclick);
      //     canvas.removeEventListener('touchstart', wordcloudclick);
      //     canvas.removeEventListener('touchend', touchend);
      //     hovered = undefined;
      //   });
      // }

      var i = 0;
      // var loopingFunction, stoppingFunction;
      // if (settings.wait !== 0) {
      //   loopingFunction = window.setTimeout;
      //   stoppingFunction = window.clearTimeout;
      // } else {
      //   loopingFunction = window.setImmediate;
      //   stoppingFunction = window.clearImmediate;
      // }

      // var addEventListener = function addEventListener(type, listener) {
      //   elements.forEach(function(el) {
      //     el.addEventListener(type, listener);
      //   }, this);
      // };

      // var removeEventListener = function removeEventListener(type, listener) {
      //   elements.forEach(function(el) {
      //     el.removeEventListener(type, listener);
      //   }, this);
      // };

      // var anotherWordCloudStart = function anotherWordCloudStart() {
      //   removeEventListener('wordcloudstart', anotherWordCloudStart);
      //   stoppingFunction(timer);
      // };

      // addEventListener('wordcloudstart', anotherWordCloudStart);

      //改递归
      // var timer = loopingFunction(function loop() {
        // if (i >= settings.list.length) {
          // stoppingFunction(timer);
          // sendEvent('wordcloudstop', false);
          // removeEventListener('wordcloudstart', anotherWordCloudStart);

          // return;
        // }
        // escapeTime = (new Date()).getTime();
        // var drawn = putWord(settings.list[i]);
        // var canceled = !sendEvent('wordclouddrawn', true, {
        //   item: settings.list[i], drawn: drawn });
        // if (exceedTime()) {
          // stoppingFunction(timer);
          // settings.abort();
          // sendEvent('wordcloudabort', false);
          // sendEvent('wordcloudstop', false);
          // removeEventListener('wordcloudstart', anotherWordCloudStart);
          // return;
        // }
      //   i++;
      //   timer = loopingFunction(loop, settings.wait);
      // }, settings.wait);
    // };

    // All set, start the drawing
    start();
    async function run(){
      if (i >= settings.list.length) {
        // stoppingFunction(timer);
        // sendEvent('wordcloudstop', false);
        // removeEventListener('wordcloudstart', anotherWordCloudStart);

        return;
      }
      escapeTime = (new Date()).getTime();
      var drawn = await putWord(settings.list[i]);
      i++;
      //递归
      setTimeout(run,0);
    }
    run();
  };

  WordCloud.isSupported = isSupported;
  WordCloud.minFontSize = minFontSize;

export default WordCloud;
