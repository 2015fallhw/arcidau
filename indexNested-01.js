/*=============================================================
  Filename: indexNested-01.js

  Support code for web site nested menu items

  Date    Description                                       By
  -------|-------------------------------------------------|---
  03Sep17 First release                                     ARC
 ==============================================================*/

 var indexData = [
  {"title":"CALENDARS", "url":"Calendar.html",
    "chapters":[
    {"title":"Historical Calendar", "url":"Calendar.html"}
               ]
  },
  {"title":"Cango GRAPHICS", "url":"CanvasAnimation.html",
    "chapters":[
    {"title":"Cango Graphics Library", "url":"CanvasGraphics.html"},
    {"title":"Cango User Guide", "url":"CangoUserGuide.html"},
    {"title":"Cango Axes Module", "url":"CangoAxesManual.html"}
               ]
  },
  {"title":"Cango3D GRAPHICS", "url":"Canvas3DGraphics.html",
    "chapters":[
    {"title":"Cango3D Graphics Library", "url":"Canvas3DGraphics.html"},
    {"title":"Cango3D User Guide", "url":"Canvas3DManual.html"}
               ]
  },
  {"title":"Cango TECH DRAWING", "url":"HelixDrawing.html",
    "chapters":[
    {"title":"Screw Thread Drawing", "url":"ThreadDrawing.html"},
    {"title":"Helix Drawing", "url":"HelixDrawing.html"},
    {"title":"Involute Gear Drawing", "url":"GearDrawing.html"}
               ]
  },
  {"title":"HISTORIC ORDNANCE", "url":"Cannonballs.html",
    "chapters":[
  {"title":"Royal Ordnance 1637", "url":"Ordnance1637.html"},
  {"title":"British Cannon Design", "url":"Cannon.html"},
  {"title":"Armstrong Pattern Guns", "url":"ArmstrongPattern.html"},
  {"title":"Cannonball Sizes", "url":"Cannonballs.html"},
  {"title":"Cannonball Aerodynamic Drag", "url":"CannonballDrag.html"},
  {"title":"Smooth Bore Cannon Ballistics", "url":"CannonBallistics.html"},
  {"title":"Robins On Ballistics", "url":"RobinsOnBallistics.html"},
  {"title":"Flintlock Animation", "url":"Flintlock.html"},
  {"title":"Wheellock Animation", "url":"Wheellock.html"}
               ]
  },
  {"title":"WEB PAGE GRAPHICS", "url":"SphereShading.html",
    "chapters":[
    {"title":"Javascript Animation", "url":"JsAnimation.html"},
    {"title":"Canvas Layers", "url":"CanvasLayers.html"},
    {"title":"Javascript Xeyes", "url":"XEyes.html"},
    {"title":"Sphere Shading with CSS", "url":"SphereShading.html"}
               ]
  },
  {"title":"SIGNAL PROCESSING", "url":"SpectrumAnalyser.html",
    "chapters":[
    {"title":"Spectrum Analyser", "url":"SpectrumAnalyser.html"},
    {"title":"FIR Filter Design", "url":"FilterDesign.html"},
    {"title":"Zoom FFT", "url":"ZoomFFT.html"}
               ]
  },
  {"title":"UNDERWATER ACOUSTICS", "url":"UWAcoustics.html",
    "chapters":[
    {"title":"Sound Propagation", "url":"UWAcoustics.html"},
    {"title":"Sonar Ray Tracing", "url":"SonarRayTracing.html"},
    {"title":"Sound Pressure Levels", "url":"SoundLevels.html"}
    ]
  }
];

/* -------------------------------------------------------------------------
  * buildMenu(dataArray)
  *
  * dataArray should be in JSON format as follows
  * [ {"url":"url of file", "title":"String to display in index"},
  *   {"url":"url of file", "title":"String to display in index",
  *    "chapters": [
  *       {"url":"url of file", "title":"String to display in index"},
  *       {"url":"url of file", "title":"String to display in index"},
  *       ...
  *       {"url":"url of file", "title":"String to display in index"}
  *     ]
  *   },
  *   {"url":"url of file", "title":"String to display in index"},
  *   ...
  * ]
  * Then build HTML anchors from the array.
  *--------------------------------------------------------------------------*/
function buildMenu(dataArray)
{
  var menuNode = document.getElementById("sideNav"),
      htmlStr = "",
      currPage,
      i;

  function subStringReplaceAt(str, index, newSubStr, oldSubStrLength)
  {
    return str.slice(0, index) + newSubStr + str.slice(index+oldSubStrLength);
  }

  function parseAry(obj)
  {
    var currPage = document.URL.replace(/^.*[\\\/]/, ''),   // split off the page name (cross platform)
        i;
    for (i=0; i<obj.length; i++)
    {
      if (obj[i].chapters)
      {
        htmlStr += "<ul>";
        htmlStr += "<li class='sectClosed'><input type='button' onclick='toggleSection(this)' value='"+obj[i].title+"'><ul class='options'>";
        parseAry(obj[i].chapters);
        htmlStr += "</ul></li>";
      }
      else
      {
        htmlStr += "<li><a href='"+obj[i].url+"' target='_top'>"+obj[i].title+"</a></li>";
        // check if this index entry is the current page, if open this section to show link
        if (currPage == obj[i].url)
        {
          htmlStr = subStringReplaceAt(htmlStr, htmlStr.lastIndexOf("sectClosed"), "sectOpen", 10);
        }
      }
    }
  }

  parseAry(dataArray);
  menuNode.innerHTML += htmlStr;
}

function toggleSection(btn)
{
  if (btn && btn.parentNode.className === "sectClosed")
  {
    btn.parentNode.className = "sectOpen";
  }
  else if (btn && btn.parentNode.className === "sectOpen")
  {
    btn.parentNode.className = "sectClosed";
  }
  return false;   // is used with anchor will prevent going to href
}
