/*============================================================
  Filename: dspPlot-29.js
  By: A.R.Collins

  A JavaScript library for DSP graph plotting

  Requires: Cango-11v00 or later,
            CangoAxes-4v00.js or later.

  Kindly give credit to Dr A R Collins <http://www.arc.id.au/>
  Report bugs to tony at arc.id.au

  Date   |Description                                      |By
  -------------------------------------------------------------
  05Nov10 Adapted from SpectrumAnalyserCvs                  ARC
  06Nov10 Added zommfft plotting                            ARC
  07Nov10 Allow nPts<tSize for zoom spectrum
          Allow offset startBin for time data               ARC
  13Nov10 Added support for marker in overlay               ARC
  13Oct12 Converted to use Cango                            ARC
  27Oct12 Converted to Cango 1v08                           ARC
  28Feb13 Replaced call to defunct clearViewport            ARC
  06Mar13 Converted to use CanvasStack1v04                  ARC
  11Mar13 Convert to use setPropertyDefault                 ARC
  12Mar13 Update to use enhanced drawText                   ARC
  22Jul13 Tidy code for JSLint                              ARC
  27Jul13 Use createLayer method from Cango Ver3            ARC
  08Aug13 Update to use Cango-3v28                          ARC
  26Mar14 Moved scaling utilities from CangoAxes to here    ARC
  13May14 Update to Cango Ver 4                             ARC
  20Nov14 Set fontSize to null to use default               ARC
  10Feb15 Update to Cango Ver 6                             ARC
  06Mar15 Update to use CangoAxes-1v24                      ARC
  15Mar15 Update to Cango Ver 7                             ARC
  21Mar15 clearCanvas before upper/lower plots it clear gap ARC
  06Apr17 Update to Cango Ver 9v04                          ARC
  22Jul17 Update to Cango Ver 11                            ARC
  21Sep17 Add check for mkr == true to moveMkr              ARC
 ==============================================================*/

var DspPlot, dType;

(function()
{
  "use strict";

  dType = {TM:1, MP:2, PW:3, RI:4};  // enum of disp modes

  function getMax(A) {
    return Math.max.apply(null, A);
  }

  function getMin(A) {
    return Math.min.apply(null, A);
  }

  function getMaxAbs(Ar, Ai)
  {
    return getMax(Ar.concat(Ai).map(Math.abs));
  }

  /* find first value in 2,4,8,20, ... past val
     this max may then be divided by 4 and have stepVal 1,2,5,10 ... */
  function scale248max(val)
  {
    var t = 1E-6,
        pwr, exp, h, nxt;

    for(pwr=-6; pwr<=6; pwr+=3)
    {
      for(exp=1; exp<1000; exp*=10)
      {
        for(h=0; h<3; h++)
        {
          nxt = 2*Math.pow(2, h)*exp*Math.pow(10, pwr); // generates 2,4,8, 20 ... 800
          if ((val < 0) && (-nxt < val))
          {
            return -t;
          }
          t = nxt;
          if ((val >= 0) && (t >= val))
          {
            return t;
          }
        }
      }
    }
    return t*Math.pow(10, pwr-3);
  };

  function scaleLog(val)
  {
    var t;

    for (t=-200; t<=200; t+=10)
    {
      if (t>val)
      {
        return t;
      }
    }
    return t;
  };

  function DispDesc(vpOfs, vpH)
  {
    this.drawGC = null;
    this.fullGC = null;
    this.o_drawGC = null;
    this.o_fullGC = null;
    this.dBuf = null;
    this.nPts = 0;
    this.yMin = 0;
    this.yMax = 0;
    this.xMin = 0;
    this.xMax = 0;
    this.dx = 0;
    this.log = false;
    this.vpOffset = vpOfs;
    this.vpHeight = vpH;
  }

  DspPlot = function(cvsId, tSize)
  {
    var cgo = new Cango(cvsId),
        ovlId = cgo.createLayer(),
        fgHgt = cgo.heightPW,
        lftMgn = 13,
        botMgn = 6,
        rgtMgn = 2,
        topMgn = 6;

    //create an overlay canvas for the cursors
    this.mkr = false;
    this.mkrX = 0;                    // bin number (not frequency!)
    this.scrnCol = "#303f30";         // very dark greenish
    this.tSize = tSize || 512;

    this.fullDisp = new DispDesc(0, fgHgt);
    this.fullDisp.drawGC = new Cango(cvsId);
    this.fullDisp.drawGC.gridboxPadding(lftMgn, botMgn, rgtMgn, topMgn);
    this.fullDisp.drawGC.setWorldCoordsRHC(0, 0, 100);
    this.fullDisp.fullGC = cgo;    // already created, so use it
    this.fullDisp.fullGC.setWorldCoordsRHC(0, 0, 100);
    this.fullDisp.o_drawGC = new Cango(ovlId);
    this.fullDisp.o_drawGC.dupCtx(this.fullDisp.drawGC);
    this.fullDisp.o_fullGC = new Cango(ovlId);
    this.fullDisp.o_fullGC.dupCtx(this.fullDisp.fullGC);

    this.upperDisp = new DispDesc(fgHgt/2, fgHgt/2);
    this.upperDisp.drawGC = new Cango(cvsId);
    this.upperDisp.drawGC.gridboxPadding(lftMgn, fgHgt/2+botMgn, rgtMgn, topMgn);
    this.upperDisp.drawGC.setWorldCoordsRHC(0, 0, 100);
    this.upperDisp.fullGC = new Cango(cvsId);
    this.upperDisp.fullGC.gridboxPadding(0, this.upperDisp.vpOffset, 0, 0);
    this.upperDisp.fullGC.setWorldCoordsRHC(0, 0, 100);
    this.upperDisp.o_drawGC = new Cango(ovlId);
    this.upperDisp.o_drawGC.dupCtx(this.upperDisp.drawGC);
    this.upperDisp.o_fullGC = new Cango(ovlId);
    this.upperDisp.o_fullGC.dupCtx(this.upperDisp.fullGC);

    this.lowerDisp =  new DispDesc(0, fgHgt/2);
    this.lowerDisp.drawGC = new Cango(cvsId);
    this.lowerDisp.drawGC.gridboxPadding(lftMgn, botMgn, rgtMgn, fgHgt/2+topMgn);
    this.lowerDisp.drawGC.setWorldCoordsRHC(0, 0, 100);
    this.lowerDisp.fullGC = new Cango(cvsId);
    this.lowerDisp.fullGC.gridboxPadding(0, 0, 0, fgHgt/2);
    this.lowerDisp.fullGC.setWorldCoordsRHC(0, 0, 100);
    this.lowerDisp.o_drawGC = new Cango(ovlId);
    this.lowerDisp.o_drawGC.dupCtx(this.lowerDisp.drawGC);
    this.lowerDisp.o_fullGC = new Cango(ovlId);
    this.lowerDisp.o_fullGC.dupCtx(this.lowerDisp.fullGC);

    this.ovlTop = null;
    this.ovlBot = null;
  };

  DspPlot.prototype.plotTimeData = function(tBuf, nPts, fs, startBin, xMin)
  {
    var log = false;

    this.configDispDesc(dType.TM, tBuf, null, nPts, fs, log, startBin, xMin);
  };

  DspPlot.prototype.plotSpectrum = function(type, rBuf, iBuf, nPts, fs, log)
  {
    /*
     * Plot nPts positive frequencies of an FFT spectrum.
     * F[0] .. F[tSize/2] hod the positive requencies (of real, symetric FFT).
     * plot both nPts should be < tSzie/2
     * log: boolean, if true plot log F[n]
     */

    if (type == dType.TM)
    {
      alert("Error: To plot time domain data use 'plotTimeData'");
      return;
    }

    this.configDispDesc(type, rBuf, iBuf, nPts, fs, log, 0, 0);
  };

  DspPlot.prototype.plotFullSpectrum = function(type, fftReal, fftImag, nPts, fs, log, f0)
  {
    /*
     * Plot all FFT spectrum data. Data is unfolded as follows:
     * F[tSize/2+1] ==> bin[0] .. F[tSize-1] ==> bin[tSize/2-2] then
     * F[0] ==> bin[tSize/2-1] .. F[tsize/2] ==> bin [tSize-1].
     * plot both -ve and +ve frequencies (if not frequency translated)
     * or full spectrum if zoomed.
     * f0: is the value of FFT output bin 0. If baseband this is DC=0Hz
     * if frequency translated this is zoom frequency, appears in F[0]
     * plotted in bin[tSize/2-1].
     * tSize: must be full size of FFT (a power of 2)
     */
    var startBin,
        fMin,
        rBuf = [], iBuf = [];

    if (type == dType.TM)
    {
      alert("Error: To plot time domain data use 'plotTimeData'");
      return;
    }
    if (nPts > this.tSize)
    {
      nPts = this.tSize;
    }
    startBin = Math.floor((this.tSize - nPts)/2);
    this.df = fs/this.tSize;
    fMin = f0 - (this.tSize/2-1-startBin)*this.df;
//    fMax = fMin + (this.tSize-1)*this.df;
    this.unfoldSpectrum(fftReal, fftImag, rBuf, iBuf);
    this.configDispDesc(type, rBuf, iBuf, nPts, fs, log, startBin, fMin);
  };

  DspPlot.prototype.configDispDesc = function(type, rBuf, iBuf, nPts, fs, log, firstBin, minX)
  {
    var i, mx, dd,
        fr = [], fi = [],
        dx,
        xMin = minX || 0,
        xMax,
        startBin = firstBin || 0;

    this.dt = 1/fs;
    this.df = fs/this.tSize;
    dx = (type === dType.TM)? this.dt: this.df;
    xMax = xMin + (nPts-1)*dx;

    switch (type)
    {
      case dType.TM:
        this.dispType = type;
        this.ovlTop = this.fullDisp;
        this.ovlBot = null;
        dd = this.fullDisp;
        dd.dBuf = fr;
        dd.nPts = nPts;
        dd.dx = dx;
        dd.xMin = xMin;
        dd.xMax = xMax;

        for (i=0; i<dd.nPts; i++)
        {
          fr[i] = rBuf[startBin+i];
        }
        mx = getMax(fr);
        dd.yMax = scale248max(mx);
        dd.yMin = -dd.yMax;
        this.drawGraph(dd, "sec", "V", "TIME BUFFER");
        if (this.mkr)
        {
          this.hideMkr();
        }
      break;
      case dType.RI:
        this.dispType = type;
        this.ovlTop = this.upperDisp;
        this.ovlBot = this.lowerDisp;
        // clear the canvas of any previous drawing (in case of gaps in upper and lower plots)
        this.fullDisp.fullGC.clearCanvas();
        dd = this.upperDisp;
        dd.dBuf = fr;
        dd.nPts = nPts;
        dd.dx = dx;
        dd.xMin = xMin;
        dd.xMax = xMax;

        for (i=0; i<dd.nPts; i++)
        {
          fr[i] = 2*rBuf[startBin+i];
          fi[i] = 2*iBuf[startBin+i];
        }
        mx = getMaxAbs(fr, fi);
        dd.yMax = scale248max(mx);
        dd.yMin = -(dd.yMax);

        this.drawGraph(dd, "Hz", "V", "REAL");

        dd = this.lowerDisp;
        dd.dBuf = fi;
        dd.nPts = nPts;
        dd.dx = dx;
        dd.xMin = xMin;
        dd.xMax = xMax;
        dd.yMax = scale248max(mx);
        dd.yMin = -(dd.yMax);

        this.drawGraph(dd, "Hz", "V", "IMAG");
        if (this.mkr)
        {
          this.showMkr();
        }
        else
        {
          this.hideMkr();
        }
      break;
      case dType.PW:
        this.dispType = type;
        this.ovlTop = this.fullDisp;
        this.ovlBot = null;
        dd = this.fullDisp;
        dd.dBuf = fr;
        dd.nPts = nPts;
        dd.dx = dx;
        dd.xMin = xMin;
        dd.xMax = xMax;

        if (log)
        {
          for (i=0; i<dd.nPts; i++)
          {
            fr[i] = 10*Math.log(2*(rBuf[startBin+i]*rBuf[startBin+i] + iBuf[startBin+i]*iBuf[startBin+i]))/Math.LN10;
            fi[i] = 0;
          }
          mx = getMax(fr);
          dd.yMax = scaleLog(mx);
          dd.yMin = dd.yMax - 80;

          this.drawGraph(dd, "Hz", "dBV", "POWER");
        }
        else   // linear
        {
          for (i=0; i<dd.nPts; i++)
          {
            fr[i] = 2*(rBuf[startBin+i]*rBuf[startBin+i] + iBuf[startBin+i]*iBuf[startBin+i]);
            fi[i] = 0;
          }
          mx = getMax(fr);
          dd.yMax = scale248max(mx);
          dd.yMin = 0;

          this.drawGraph(dd, "Hz", "V\u00B2", "POWER");
        }
        if (this.mkr)
        {
          this.showMkr();
        }
        else
        {
          this.hideMkr();
        }
      break;
      case dType.MP:
      default:
        this.dispType = dType.MP;
        this.ovlTop = this.upperDisp;
        this.ovlBot = this.lowerDisp;
        // clear the canvas of any previous drawing (in case of gaps in upper and lower plots)
        this.fullDisp.fullGC.clearCanvas();
        dd = this.upperDisp;
        dd.dBuf = fr;
        dd.nPts = nPts;
        dd.dx = dx;
        dd.xMin = xMin;
        dd.xMax = xMax;

        if (log)
        {
          for (i=0; i<dd.nPts; i++)
          {
            fr[i] = 10*Math.log(2*(rBuf[startBin+i]*rBuf[startBin+i] + iBuf[startBin+i]*iBuf[startBin+i]))/Math.LN10;
            fi[i] = Math.atan2(iBuf[startBin+i], rBuf[startBin+i]);
          }
          // fix the missing freq=0 phase point
          fi[0] = fi[1];
          mx = getMax(fr);
          dd.yMax = scaleLog(mx);
          dd.yMin = dd.yMax - 40;    // only 4 steps on half sceeen displays

          this.drawGraph(dd, "Hz", "dBV", "MAGNITUDE");
        }
        else  // linear
        {
          for (i=0; i<dd.nPts; i++)
          {
            fr[i] = Math.sqrt(2*(rBuf[startBin+i]*rBuf[startBin+i] + iBuf[startBin+i]*iBuf[startBin+i]));
            fi[i] = Math.atan2(iBuf[startBin+i], rBuf[startBin+i]);
          }
          // fix the missing freq=0 phase point
          fi[0] = fi[1];
          mx = getMax(fr);
          dd.yMax = scale248max(mx);
          dd.yMin = 0;

          this.drawGraph(dd, "Hz", "V", "MAGNITUDE");
        }

        dd = this.lowerDisp;
        dd.dBuf = fi;
        dd.nPts = nPts;
        dd.dx = dx;
        dd.xMin = xMin;
        dd.xMax = xMax;
        dd.yMax = 4;        // don't use this.ymin etc (they are for magnitude values)
        dd.yMin = -4;

        this.drawGraph(dd, "Hz", "rad", "PHASE");

        if (this.mkr)
        {
          this.showMkr();
        }
        else
        {
          this.hideMkr();
        }
    }
  };

  DspPlot.prototype.drawGraph = function(dd, xUnits, yUnits, title)
  {
    var yTics,
        data = [],
        i;

    if ((this.dispType == dType.TM)||(this.dispType == dType.PW))    // full height display
    {
      yTics = (dd.yMax-dd.yMin)/8;   // force 8 tics up the y axis
    }
    else
    {
      yTics = (dd.yMax-dd.yMin)/4;   // force 4 tics up the y axis for half height
    }
    dd.fullGC.fillGridbox(this.scrnCol);            // clear to bkgColor
    dd.o_fullGC.clearCanvas();                       // clear any marks from overlay
    // Label freq domain graph using native unit coords
    if (this.dispType != dType.TM)
    {
      dd.fullGC.drawText("RBW: "+toEngPrec(dd.dx, 4).toString()+"Hz", {x:33, y:dd.vpHeight-4, fillColor:"#aaaaaa", lorg:7});
    }
    // setup the world coords
    dd.drawGC.setWorldCoordsRHC(dd.xMin, dd.yMin, dd.xMax-dd.xMin, dd.yMax-dd.yMin);
    // setup the overlay for marker clear on this plot
    dd.o_drawGC.dupCtx(dd.drawGC); // (source)
    // Draw axes (box axes have their own color setting)
    dd.drawGC.drawBoxAxes(dd.xMin, dd.xMax, dd.yMin, dd.yMax, {
      xTickInterval:"auto",
      yTickInterval:yTics,
      xUnits: xUnits,
      yUnits: yUnits,
      title: title });
    // Plot data
    for (i=0; i < dd.nPts; i++)
    {
      data[2*i] = dd.xMin+i*dd.dx;
      if (dd.dBuf[i] > dd.yMin)
      {
        data[2*i+1] = dd.dBuf[i];
      }
      else
      {
        data[2*i+1] = dd.yMin;
      }
    }
    // now plot data
    dd.drawGC.drawPath(data, {strokeColor:'white'});
  };

  DspPlot.prototype.unfoldSpectrum = function(ar, ai, opReal, opImag)
  {
    /*
     * FFT frequency domain output has negative frequencies stored after
     * positive frequencies. This function shifts negatives to the front
     * and then the positive putting the data in correct order.
     * useful for non-symetric specra (eg zoomed FFT).
     * Output pointer is swapped with input so unfold appears in-place.
     */
    var i, iPtr;

    for (i=0, iPtr=this.tSize/2+1; iPtr<this.tSize; i++, iPtr++)
    {
      opReal[i] = ar[iPtr];
      opImag[i] = ai[iPtr];
    }
    for (iPtr=0; i<this.tSize; i++, iPtr++)
    {
      opReal[i] = ar[iPtr];
      opImag[i] = ai[iPtr];
    }
  };

  DspPlot.prototype.showMkr = function()
  {
    var yVal, xVal,
        mkrWid = 0.017*(this.ovlTop.xMax - this.ovlTop.xMin);    // 2% of x axis span

    // show upper display marker   (for full screen ovlTop is set to fullDisp
    xVal = this.mkrX * this.ovlTop.dx;
    yVal = this.ovlTop.dBuf[this.mkrX];
    if (yVal < this.ovlTop.yMin)
    {
      yVal = this.ovlTop.yMin;
    }
    // draw a little square marker over the data point xVal, yVal
    this.ovlTop.o_drawGC.drawPath(shapeDefs.square(mkrWid), {x:xVal, y:yVal, strokeColor:"#ffffff", iso:true});
    this.writeLabel(this.ovlTop, xVal, yVal);
    this.mkr = true;
    if (this.ovlBot == null)
    {
      return;
    }
    // show lower display marker
    xVal = this.mkrX * this.ovlTop.dx;
    yVal = this.ovlBot.dBuf[this.mkrX];
    if (yVal < this.ovlBot.yMin)
    {
      yVal = this.ovlBot.yMin;
    }
    this.ovlBot.o_drawGC.drawPath(shapeDefs.square(mkrWid), {x:xVal, y:yVal, strokeColor:"#ffffff", iso:true});
    this.writeLabel(this.ovlBot, xVal, yVal);
  };

  DspPlot.prototype.hideMkr = function()
  {
    this.ovlTop.o_fullGC.clearCanvas();

    this.mkr = false;
  };

  DspPlot.prototype.moveMkr = function(inc)
  {
    var xBin,
        xVal, yVal,
        mkrWid = 0.017*(this.ovlTop.xMax - this.ovlTop.xMin);    // 1.7% of x axis span

    if (!this.mkr)
    {
      return;
    }
    xBin = this.mkrX + inc;
    if (xBin<0)
    {
      xBin = 0;
    }
    if (xBin >= this.ovlTop.nPts)
    {
      xBin = this.ovlTop.nPts-1;
    }
    this.mkrX = xBin;

    xVal = this.mkrX * this.ovlTop.dx;
    yVal = this.ovlTop.dBuf[this.mkrX];
    if (yVal < this.ovlTop.yMin)
    {
      yVal = this.ovlTop.yMin;
    }

    this.ovlTop.o_fullGC.clearCanvas();

    this.ovlTop.o_drawGC.drawPath(shapeDefs.square(mkrWid), {x:xVal, y:yVal, strokeColor:"#ffffff", iso:true});
    this.writeLabel(this.ovlTop, xVal, yVal);

    if (this.ovlBot == null)
    {
      return;
    }
    yVal = this.ovlBot.dBuf[this.mkrX];
    if (yVal < this.ovlBot.yMin)
    {
      yVal = this.ovlBot.yMin;
    }

    this.ovlBot.o_drawGC.drawPath(shapeDefs.square(mkrWid), {x:xVal, y:yVal, strokeColor:"#ffffff", iso:true});
    this.writeLabel(this.ovlBot, xVal, yVal);
  };

  DspPlot.prototype.writeLabel = function(dd, xVal, yVal)
  {
    dd.o_fullGC.drawText("Mkr X:", {x:72, y:dd.vpHeight-4, fillColor:"#aaaaaa", lorg:9});
    dd.o_fullGC.drawText("Y:", {x:85, y:dd.vpHeight-4, fillColor:"#aaaaaa", lorg:9});
    dd.o_fullGC.drawText(toEngPrec(xVal, 3).toString(), {x:81, y:dd.vpHeight-4, fillColor:"#ffffff", lorg:9});
    dd.o_fullGC.drawText(toEngPrec(yVal, 3).toString(), {x:97, y:dd.vpHeight-4, fillColor:"#ffffff", lorg:9});
  };

}());
