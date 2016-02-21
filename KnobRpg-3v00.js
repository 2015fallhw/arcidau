/*==========================================================================
  Filename: KnobRpg-3v00.js
  Rev: 3
  By: A.R.Collins
  Description: A rotary knob simulating a Rotary Pulse Generator. User
  defined callback function is called at each pulse emitted.
  Built using the HTML5 canvas element.
  License: Released into the public domain
  latest version at
  <http://www/arc.id.au/KnobRPG-XvXX.js>
  Report bugs to tony at arc.id.au

  Date   |Description                                                  |By
  --------------------------------------------------------------------------
  11Jul14 Rev 1.00 First release based on Cango-4v15                    ARC
  13Jul14 clearCanvas on every render (so use in an overlay)
          Use setDropShadow for more 3D effect
          Make knobTop adding outline segments not pie wedges           ARC
  14Jul14 Update to use Cango-5                                         ARC
  18Jul14 no need to dup top segment - concat copies values             ARC
  08Feb15 Update for Cango Ver 6                                        ARC
  15Feb15 Convert to use Cango-6v02 color gradient objects              ARC
  16Feb15 Released as Rev 2 based on Cango-6v03                         ARC
  07Mar15 Inverted version for inverted cartesian coords                ARC
  20Mar15 Revert to old gradient numbers after gradient bugfix in Cango ARC
  18Dec15 Expose knobDraw as a method of the KnobRpg object
          Release as Version 3v00                                       ARC
  ==========================================================================*/

  function KnobRpg(gc, cx, cy, diameter, zeroAng, callBack)
  {
    "use strict";
    var savThis = this,
        knobTop, knobPtr,   // 2 Cobj forming the knob
        seg = ['M',1.3515,-0.6508, 'A',1,1,0,0,0,1.6824,-0.2624,
             'A',0.32,0.32,0,0,1,1.6824,0.2624, 'A',1,1,0,0,0,1.3515,0.6508],
        ptrCmds = ['M', 0.6, 0, 'L', 1.5, 0],   // simple line pointer
        grad1,           // color gradients
        topSegment,      // template of one knob notch
        step = 360/7,    // top made from 7 segements
        size = diameter*0.25 || 25,   // correct for raw diameter = 4
        zeroAngle = zeroAng || 0,
        angle = 0,          // current 'as drawn' knob angle
        residue = 0,        // diff between requested drag angle and drawn
        radPerPulse = 0.049,// 128 pulses per revolution (arbitrary usually scaled by app)
        grabOfsAng = 0,     // offset of line to cursor from knob angle
        i;


    function trunc(x) {
      return x < 0 ? Math.ceil(x) : Math.floor(x);
    }

    function knobGrab(mousePos)
    {
      var csrX = mousePos.x - this.dwgOrg.x,
          csrY = mousePos.y - this.dwgOrg.y;
      grabOfsAng = Math.atan2(csrY, csrX) - angle;    // all angles in radians
    }

    function knobDrag(mousePos)
    {
      var csrX = mousePos.x - this.dwgOrg.x,     // this is the DnD object
          csrY = mousePos.y - this.dwgOrg.y,
          newA = Math.atan2(csrY, csrX) - grabOfsAng,   // new rotation angle
          pulses = 0,     // numers of pulses to emit from each drag
          da;

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
      // only redraw if degs change (more than 1 degree of movement)
      if (pulses && callBack)  // if the accumulated move > radPerPulse emit a pulse
      {
        callBack((gc.yscl>0)? pulses: -pulses);     // +ve clockwise
      }
      savThis.knobDraw();    // savThis is the KnobRpg object
    }

    function knobDrop(mousePos)
    {
      // reset the residue and degs to match the static position
      residue = 0;
    }

    this.knobDraw = function()    // draw Knob at current value of 'angle' in radians
    {
      var angleDeg = (gc.yscl>0)? -180*angle/Math.PI: 180*angle/Math.PI;

      gc.clearCanvas();
      gc.render([knobTop, knobPtr], cx, cy, 1, angleDeg);
    };

    // build the knob object
    grad1 = new LinearGradient(size, size, 1.2*size, -1.3*size);
    grad1.addColorStop(0, '#e8e8e8');
    grad1.addColorStop(1, '#909090');
    // make the segment template
    topSegment = new Cobj(seg, "SHAPE", {"fillColor":grad1});
    topSegment.scale(size);
    topSegment.rotate(zeroAngle);  // turn to reference angle
    knobTop = topSegment.dup();    // begin with new copy (not a reference)
    // rotate current segments and append copy of the template 6 times
    for (i=1; i<7; i++)
    {
      knobTop.rotate(-step); // rotate to put path end at start of template path
      knobTop.appendPath(topSegment, true);  // add another segment
    }
    // give the top a dropShadow
    knobTop.setProperty("shadowOffsetX",0.05*size);
    knobTop.setProperty("shadowOffsetY", -0.06*size);
    knobTop.setProperty("shadowBlur", 0.05*size);
    knobTop.setProperty("shadowColor", "#505050");
    // make knob index marker
    knobPtr = new Cobj(ptrCmds, "PATH", {
      strokeColor: 'white',
      lineWidthWC: 0.3,
      iso: true,
      lineCap: 'round' });
    knobPtr.scale(size);
    knobPtr.rotate(zeroAngle);        // turn to reference angle
    // make draggable knob base
    knobTop.enableDrag(knobGrab, knobDrag, knobDrop);
    // draw the knob at start position
    this.knobDraw();
  }
