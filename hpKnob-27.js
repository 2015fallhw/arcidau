/*===============================================================
  Filename: hpKnob-27.js
  Javascript simulation of the HP knob control used of HP
  instruments.

  Please give credit to arc <http://www.arc.id.au/>

  Date     Description                                       By
  -------|-------------------------------------------------|----
  21Sep07 First release just knob motion                    arc
  22Sep07 Full rotary pulse generation functionality        arc
  23Sep07 bugfix: use documentElement not body for scroll   arc
  04Oct07 Added setTimeout to limit number of interrupts    arc
  08Oct07 Remove timeout - didn't work in IE 6              arc
  30Oct07 Made interval timer work with IE                  arc
  08Jul08 Stop Mozilla drag n drop of knob face             arc
  13Jul08 don't pass obj to event handler, 'this' is same   arc
  14Jul08 use stopDefault from 'Pro JS techniques' p121     arc
  04Dec08 bugfix: divide by 0 in drag handler               arc
  06Jul10 bugfix: mouse position fixed for chrome browser   arc
  13Nov10 move dent to cursor pos on click to avoid jump on
          first move                                        arc
  12Dec10 tidy up closures remove unneccessary vars         arc
  24Apr12 scrap em's and resize code, work in pixels        arc
  25Apr12 major rewrite, using drag object                  arc
  07Jul12 bugfix: getPosition now includes border offsets
  19Nov12 All new getPosition, update to use Drag-06.js     arc
  09Apr15 Use latest CSS selectors etc                      arc
 *===============================================================*/

    function Knob(knobId, callBackFn)
    {
      var knobNode = document.getElementById(knobId),
          dent, face,
          radius,
          angle = Math.PI,     // start with dent over on the left
          residue = 0,
          radPerPulse = 0.049,  // s ~128 pulse per revolution
          grabOfsAng = 0;     // offset of line to cursor from knob angle

      function getCsrPos(evt)
      {
        // pass in any mouse event, returns the position of the cursor in raw pixel coords
        var e = evt||window.event,
            rect = face.getBoundingClientRect();

        return {x: e.clientX - rect.left, y: e.clientY - rect.top};
      }

      function stopDefault(e)
      {
        if (e && e.preventDefault) // Prevent default browser action (W3C)
        {
          e.preventDefault();
        }
        else                       // A shortcut for stopping the browser action in IE
        {
          window.event.returnValue = false;
        }
        return false;
      }

      function trunc(x)
      {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
      }

      function grab(e)
      {
        var csrPos = getCsrPos(e),     // update mouse pos to pass to the owner
            csrX = csrPos.x - knobNode.offsetWidth/2,  // cursor coords relative to rotation centre
            csrY = csrPos.y - knobNode.offsetHeight/2;   // new rotation angle

        document.onmouseup = function()
        {
          document.onmouseup = null;
          document.onmousedown = null;
          document.onmousemove = null;
        };

        document.onmousemove = drag;
        stopDefault(e);

        grabOfsAng = Math.atan2(-csrY, csrX) - angle;    // all angles in radians

        return false;
    	}

      function drag(e)
      {
        var csrPos = getCsrPos(e),     // update mouse pos to pass to the owner
            pulses,       // number to return to callback function proportional to angular movement
            da,           // change in rotation angle since last call
            csrX = csrPos.x - knobNode.offsetWidth/2,  // cursor coords relative to rotation centre
            csrY = csrPos.y - knobNode.offsetHeight/2,
            newA = Math.atan2(-csrY, csrX) - grabOfsAng;   // new rotation angle

        // calc change in angle
        if (newA - angle > 6)    // da will jump > when newA wraps around (jumps by 2PI)
        {
          // newA has wrapped around wrap 'angle' to match
          angle += 2*Math.PI;
        }
        if (newA - angle < -6)
        {
          angle -= 2*Math.PI;
        }
        da = newA - angle + residue;     // change in rotation angle since last call
        pulses = trunc(da/radPerPulse);  // calc pulses
        residue = da - pulses*radPerPulse;     // recalc the residue after a pulse movement
        angle = newA;                    // save the new requested angle
        // now move the dimple to reflect rotation, to limit reflow of page only do this if pulses generated
        if (pulses)
        {
          knobPaint();
          if (callBackFn)
          {
            callBackFn(-pulses);        // +ve clockwise
          }
        }

      	return false;
      }

      function knobPaint()
      {
        var dentX = radius*Math.cos(angle),   // center of dent relative to knob center
            dentY = -radius*Math.sin(angle);

        dent.style.left = (knobNode.offsetWidth/2 + dentX - dent.offsetWidth/2) + "px";
        dent.style.top = (knobNode.offsetHeight/2 + dentY - dent.offsetHeight/2) + "px";
      }

      face = knobNode.children[0];
      dent = knobNode.children[1];
      radius = 0.65*dent.offsetWidth;    // radius of motion of dent
      // move the dent to the initial angle just assigned
      knobPaint();
      // inhibit default drag action of browser by shoving a stopper in the handler chain
      knobNode.onmousedown = stopDefault;
      knobNode.onmousemove = stopDefault;
      // now make the 'dent' draggable
      dent.onmousedown = grab;
    }
