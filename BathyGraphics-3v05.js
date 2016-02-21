/*=========================================================
  Filename: BathyGraphics-3v05.js
  Rev: 3
  By: Dr A.R.Collins

  Description: Bathythermograph utilities.

  License: Released into the public domain
  link to latest version at
  <http://www/arc.id.au>
  Report bugs to tony at arc.id.au

  Date   |Description                                  |By
  ---------------------------------------------------------
  19Jul08 Rev1.00 First release                         ARC
  22Jul08 Use polyLine to speed up drawing              ARC
  17Nov12 Convert to Cango                              ARC
  12Apr14 Update to Cango-3v33                          ARC
  13Apr14 Update to Cango-3v35 invertable Y axis        ARC
  15Mar15 Update to Cango-7v00 SVG coordinates          ARC
  09Apr15 Use pre-existing Cango contexts               ARC
  13Apr15 Use gradient not drop shadow for bottom       ARC
  14Apr15 Allow non-zero topDepth for under ice sound   ARC
  19Apr15 Handle new bathy style with no missing points ARC
  03May15 Don't try to fraw rays past +/-90             ARC
  05May15 Make ray spacing a parameter                  ARC
  =========================================================*/

  var Bathy, plotTemp, plotSpeed, plotFan;

  (function(){
    'use strict';

  Bathy = function(depthAry, tempAry, dUnits, tUnits)
  {
    var savThis = this,
        depth, slab,
        prevSpd, nextSpd,
        slope,
        stepLimit,
        dzInc, spdInc, topSlab, btmSlab,
        i;

    function calcSpeed(idx)
    {
      if ((savThis.tempData[idx] === undefined) || (savThis.tempData[idx] > 1000))
      {
        return null;
      }
      return (1448.5+4.21*savThis.tempData[idx]-0.037*savThis.tempData[idx]*savThis.tempData[idx]+0.017*savThis.depthData[idx]);
    }

    this.depthData = depthAry || [];
    this.tempData = tempAry || [];
    this.btmDepth = 0;
    this.topDepth = 0;
    this.speed = [];
    this.dz = [];       // array of slab thicknesses 1 for each speed value

    // find top and bottom depths
    topSlab = 0;
    this.topDepth = this.depthData[topSlab];
    btmSlab = this.tempData.length - 1;
    this.btmDepth = this.depthData[btmSlab];

    // convert all depth data to meters and temp data to Celsius
    if (dUnits && this.depthData.length && (dUnits.toLowerCase() === "ft" ||  dUnits.toLowerCase() === "feet"))
    {
      this.depthData = this.depthData.map(function(d){return 0.3048*d;});
      this.btmDepth *= 0.3048;
      this.topDepth *= 0.3048;
    }
    if (dUnits && this.depthData.length && (dUnits.toLowerCase() === "fm" || dUnits.toLowerCase() === "fathoms"))
    {
      this.depthData = this.depthData.map(function(d){return 1.8288*d;});
      this.btmDepth *= 1.8288;
      this.topDepth *= 1.8288;
    }
    if (tUnits && this.tempData.length && (tUnits.toLowerCase().charAt(0) === "f"))   // fahrenheit
    {
      for (i=topSlab; i<=btmSlab; i++)
      {
        this.tempData[i] = 5*(this.tempData[i]-32)/9;
      }
    }

    slab = 0;          // output slab counter
    i = topSlab;       // index stepping through temp data
    depth = this.depthData[i];
    this.speed[slab] = calcSpeed(i);
    this.dz[slab] = 1.0;                    // dz[0]=thickness of top (surface) slab = 1m
    for(i++; i<this.tempData.length; i++)
    {
      prevSpd = this.speed[slab];
      nextSpd = calcSpeed(i);
      slope = (this.depthData[i] - this.depthData[i-1])/(nextSpd-prevSpd);
      dzInc = Math.abs(0.5*slope);
      if (depth < 100.0)
      {
        stepLimit = 1.0;
      }
      else if (depth < 500.0)
      {
        stepLimit = 5.0;
      }
      else if (depth < 2000.0)
      {
        stepLimit = 10.0;
      }
      else
      {
        stepLimit = 20.0;
      }
      if (dzInc > stepLimit)
      {
        dzInc = stepLimit;
      }
      spdInc = dzInc/slope;
      while ((depth <= this.depthData[i]) && (depth < this.btmDepth))
      {
        slab++;
        depth += dzInc;
        this.dz[slab] = dzInc;                          // thickness of slab[i]
        this.speed[slab] = this.speed[slab-1] + spdInc;   // sound speed for slab[i]
      }
      if (depth >= this.btmDepth)
      {
        this.speed[slab+1] = 10E6; // force reflection at the bottom
        break;
      }
    }
    this.speed[0] = 10E6; // force reflection at the top slab (surface?)
  };

  plotTemp = function(g, bthy, depthScale)
  {
    var xmin = -5,
        xmax = 35,
        ymin = 0.0,
        ymax = depthScale,   // extents of plotting area (ymax>ymin)
        data = [],
        slab,
        gradObj;

    g.clearCanvas("#ffffff");
    g.setWorldCoords(xmin, ymin, xmax-xmin, ymax-ymin);
    g.drawAxes(xmin, xmax, ymin, ymax, {
      xUnits:"deg C",
      yUnits: "m",
    //  y10thsOK: true,
      xLabel: "Temp",
      yLabel: "Depth",
      fontSize: 11,
      strokeColor: "#888888",      // axes
      fillColor: "#404040" });     // text
      // plot bottom if on screen
    if (bthy.btmDepth < ymax)
    {
      gradObj = new LinearGradient(xmin, bthy.btmDepth, xmin, bthy.btmDepth+10/g.yscl);
      gradObj.addColorStop(0, 'gray');
      gradObj.addColorStop(1, 'white');
      g.drawPath([xmin, bthy.btmDepth, xmax, bthy.btmDepth]);
      g.drawShape(["M",xmin, bthy.btmDepth, 'l', xmax-xmin, 0, 0, 15/g.yscl, xmin-xmax, 0, 'z'], 0, 0, {fillColor:gradObj});
    }
    if (bthy.topDepth > 0)
    {
      g.drawPath([xmin, bthy.topDepth, xmax, bthy.topDepth]);    // draw bottom face of ice
    }
    for(slab=0; slab < bthy.tempData.length; slab++)
    {
      if(bthy.depthData[slab] >= bthy.btmDepth)      // plot just past btmDepth
      {
        data.push(bthy.tempData[slab]);       // data is a one dimensional array
        data.push(bthy.btmDepth);
        break;
      }
      if(bthy.depthData[slab] >= ymax)      // clip at ymax
      {
        data.push(bthy.tempData[slab]);
        data.push(ymax);
        break;
      }
      data.push(bthy.tempData[slab]);
      data.push(bthy.depthData[slab]);
    }
    g.drawPath(data);
  };

  plotSpeed = function(g, bthy, depthScale)
  {
    var xmin = 1430.0,
        xmax = 1560.0,
        ymin = 0.0,
        ymax = depthScale,   // extents of plotting area (ymax>ymin)
        data = [],
        i,
        dpth,
        gradObj;

    g.clearCanvas("#ffffff");
    g.setWorldCoords(xmin, ymin, xmax-xmin, ymax-ymin);
    g.drawAxes(xmin, xmax, ymin, ymax, {
      xUnits:"m/sec",
      yUnits: "m",
   //   y10thsOK: true,
      xLabel: "Sound Speed",
      yLabel: "Depth",
      fontSize: 11,
      strokeColor: "#888888",      // axes
      fillColor: "#404040" });
    // plot bottom if on screen
    if (bthy.btmDepth < ymax)
    {
      gradObj = new LinearGradient(xmin, bthy.btmDepth, xmin, bthy.btmDepth+10/g.yscl);
      gradObj.addColorStop(0, 'gray');
      gradObj.addColorStop(1, 'white');
      g.drawPath([xmin, bthy.btmDepth, xmax, bthy.btmDepth]);
      g.drawShape(["M",xmin, bthy.btmDepth, 'l', xmax-xmin, 0, 0, 15/g.yscl, xmin-xmax, 0, 'z'], 0, 0, {fillColor:gradObj});
    }
    if (bthy.topDepth > 0)
    {
      g.drawPath([xmin, bthy.topDepth, xmax, bthy.topDepth]);    // draw bottom face of ice
    }
    dpth = bthy.topDepth;
    data.push(bthy.speed[1]);      // don't use speed[0] its 100000 to force reflection
    data.push(dpth);   // depth at topSlab (surface?)
    for (i=1; i < bthy.speed.length; i++)
    {
      dpth += bthy.dz[i];
      data.push(bthy.speed[i]);
      data.push(dpth);
      if ((dpth > bthy.btmDepth)||(dpth>ymax))   // stop at bottom of graph or bottom of ocean
      {
        break;
      }
    }
    g.drawPath(data);
  };

  function scaleGraph(g, bthy, rangeScale, depthScale)
  {
    var xmin = 0.0,
        xmax = rangeScale,
        ymin = 0.0,
        ymax = depthScale,
        gradObj;

    g.clearCanvas("white");
    g.setWorldCoords(xmin, ymin, xmax-xmin, ymax-ymin);
    g.drawAxes(xmin, xmax, ymin, ymax, {
      xUnits: "m",
      yUnits: "m",
      y10thsOK: true,
      xLabel: "Range",
      yLabel: "Depth",
      fontSize: 11,
      strokeColor: "#888888",      // axes
      fillColor: "#404040" });
    // plot bottom if on screen
    if (bthy.btmDepth < ymax)
    {
      gradObj = new LinearGradient(xmin, bthy.btmDepth, xmin, bthy.btmDepth+15/g.yscl);
      gradObj.addColorStop(0, 'gray');
      gradObj.addColorStop(1, 'white');
      g.drawPath([xmin, bthy.btmDepth, xmax, bthy.btmDepth]);
      g.drawShape(["M",xmin, bthy.btmDepth, 'l', xmax-xmin, 0, 0, 10/g.yscl, xmin-xmax, 0, 'z'], 0, 0, {fillColor:gradObj});
    }
    if (bthy.topDepth > 0)
    {
      g.drawPath([xmin, bthy.topDepth, xmax, bthy.topDepth]);    // draw bottom face of ice
    }
  }

  function plotRay(g, bthy, angleDegs, sourceDepth, rangeScale)
  {
    var startAngle = angleDegs || 3,
        srcDepth = sourceDepth || bthy.topDepth+10,
        xmax = rangeScale || 20000,
        x = 0,
        y = bthy.topDepth,
        i = 0,    // slab counter
        v = [],
        cos2b, cos3b,
        sgnb,
        data = [], // array to hold output plot points
        b;         // current ray angle (in Rad)

    /* run through the slabs until we are at source depth */
    do
    {
      y += bthy.dz[++i];
    } while ((i<bthy.dz.length)&&(y < srcDepth));

    if (startAngle < 0)
    {
      y -= bthy.dz[i];    // y is set to the depth of slab nearest source depth, i is slab index
    }
    data.push(0, srcDepth);
    data.push(Math.abs((srcDepth-y)/Math.tan(Math.abs(b))), y);

    v[0] = bthy.speed[i];
    b = startAngle*Math.PI/180.0;     // b is ray angle (in radians)
    sgnb = (b<0.0)? -1: 1;
    do
    {
      if (i + sgnb >= 0)
      {
        v[1] = bthy.speed[i + sgnb];
        cos2b = (v[1]/v[0])*(1.0-b*b/2.0);
      }
      else
      {
        v[1] = bthy.speed[0];
        cos2b = 1.0;          // force a reflection
      }
      if ((cos2b >= 1.0)||(y >= bthy.btmDepth))
      {
        b = -b;     // immediate reflection
        sgnb = -sgnb;
      }
      else
      {
        if (bthy.speed[i+2*sgnb])
        {
          v[2] = bthy.speed[i+2*sgnb];
        }
        else
        {
          v[2] = bthy.speed[0];
        }
        cos3b = v[2]*cos2b/v[1];
        if (cos3b >= 1.0)
        {
          // reflection so bthy slab has 2 lines plotted, incident and reflected
          data.push(x+2*bthy.dz[i+sgnb]/Math.abs(b));
          data.push(y+sgnb*bthy.dz[i+sgnb]);
          x += 4.0*bthy.dz[i+sgnb]/Math.abs(b);
          b = -b;
          sgnb = -sgnb;
        }
        else
        {
          b = sgnb*Math.sqrt(2*(1-cos2b));    // refracted
          i += sgnb;
          v[0] = v[1];
        }
      }
      y += sgnb*bthy.dz[i];
      x += bthy.dz[i]/Math.abs(b);
      data.push(x, y);
    }
    while(x < xmax);

    g.drawPath(data);
  }

  plotFan = function(g, bthy, midAngle, numRays, raySpacing, srcDepth, dpthScale, rngScale)
  {
    var hNum = (numRays - 1)/2,
        rayAng,
        r;     // ray number

    scaleGraph(g, bthy, rngScale, dpthScale);
    for (r=-hNum; r<=hNum; r+=1)
    {
      rayAng = midAngle+r*raySpacing;
      if ((rayAng >= -90) && (rayAng <= 90))
      {
        plotRay(g, bthy, midAngle+r*raySpacing, srcDepth, rngScale);
      }
    }
  };

  }());