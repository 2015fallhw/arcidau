/*================================================================
  Filename: xEyes-17.js
  By: A.R.Collins

  Javascript implementation of xEyes.

  Kindly give credit to Dr A R Collins <http://www.arc.id.au/>
  Report bugs to tony at arc.id.au

  Date    |Description                                       |By
  ----------------------------------------------------------------
  19Nov14  Major re-write in modern style                     ARC
  20Nov14 Support multiple instances on the same page         ARC
 *================================================================*/

  function Xeyes(faceId, e1Id, e1Lft, e1Top, e1Radius, e2Id, e2Lft, e2Top, e2Radius)
  {
    var faceObj = document.getElementById(faceId),
        eye1Obj = document.getElementById(e1Id),
        eye2Obj = document.getElementById(e2Id),
        e1x, e1y,    // eye centre relative to top left of doc
        r1,
        e1xLoc, e1yLoc,   // eye top left relative to top left of parent
        e2x, e2y,
        r2,          // eye radii
        e2xLoc, e2yLoc;

    // setup initial eye locations
    function eyesInit()
    {
      var faceWidth = faceObj.offsetWidth,
          faceHeight = faceObj.offsetHeight,
          tmp;

      function getPosition(element)
      {
        var xPosition = 0,
            yPosition = 0;

        while(element)
        {
          xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
          yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
          element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
      }

      // get left,top of eyes relative to parent
      e1xLoc = 0.01*e1Lft*faceWidth - eye1Obj.offsetWidth/2;
      e1yLoc = 0.01*e1Top*faceHeight - eye1Obj.offsetHeight/2;
      e2xLoc = 0.01*e2Lft*faceWidth - eye2Obj.offsetWidth/2;
      e2yLoc = 0.01*e2Top*faceHeight - eye2Obj.offsetHeight/2;
      // get absolute position of centre of eyes wrt to top left of document body
      tmp = getPosition(faceObj);
      e1x= tmp.x+0.01*e1Lft*faceWidth;
      e1y= tmp.y+0.01*e1Top*faceHeight;
      e2x= tmp.x+0.01*e2Lft*faceWidth;
      e2y= tmp.y+0.01*e2Top*faceHeight;

      r1 = 0.01*e1Radius*faceWidth;
      r2 = 0.01*e2Radius*faceWidth;
      // now move the eyes to a less goggle-eye position until mouse moves
      eye1Obj.style.left = e1xLoc+"px";        // "12.4em";
      eye1Obj.style.top = e1yLoc+r1/1.5+"px";    // "16.3em";
      eye2Obj.style.left = e2xLoc+"px";        // "21.0em";
      eye2Obj.style.top = e2yLoc+r2/1.5+"px";    // "16.3em";
    }

    function moveEyes(e)
    {
      var csrX, csrY,
          x, y,
          dx, dy,
          R, d;

      if (e.pageX)
      {
        csrX = e.pageX;
        csrY = e.pageY;
      }
      else
      {
        // IE case
        d = (document.documentElement && document.documentElement.scrollLeft != null) ?
               document.documentElement : document.body;
        csrX = e.clientX + d.scrollLeft;
        csrY = e.clientY + d.scrollTop;
      }
      // eye 1 first
      dx = csrX - e1x;
      dy = csrY - e1y;
      R = Math.sqrt(dx*dx+dy*dy);     // distance from eye centre to csr
      x = (R < r1)? dx : dx*r1/R;
      y = (R < r1)? dy : dy*r1/R;
      eye1Obj.style.left = x + e1xLoc + "px";
      eye1Obj.style.top = y + e1yLoc + "px";
      // now for eye 2
      dx = csrX - e2x;
      dy = csrY - e2y;
      R = Math.sqrt(dx*dx+dy*dy);
      x = (R < r2)? dx : dx*r2/R;
      y = (R < r2)? dy : dy*r2/R;
      eye2Obj.style.left = x + e2xLoc + "px";
      eye2Obj.style.top = y + e2yLoc + "px";
    }

    eyesInit();
    // if the browser window is resized eye locations must be re-calculated
    addEvent(window, "resize", eyesInit);
    // setup handler for cursor move
    addEvent(document, "mousemove", moveEyes);
    // for debug use     document.onclick = moveEyes;
  }
