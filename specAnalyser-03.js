/*============================================================
  Filename: specAnalyser-03.js
  By: A.R.Collins

  A JavaScript spectrum analyser simulation

  Requires: dspUtils-09.js or later.

  Kindly give credit to Dr A.R.Collins <http://www.arc.id.au/>
  Report bugs to tony at arc.id.au

  Date   |Description                                     |By
  ------------------------------------------------------------
  16Oct12 Renamed from SpecAnalyser for consistancy        ARC
  22Jul13 Tidy code for JSLint                             ARC
  ============================================================*/

 var SpectrumAnalyser, wType;

(function()
{
  "use strict";

  wType = {RECT:0, HANN:1, KB:2};  // enum of window types

  SpectrumAnalyser = function(tSize)
  {
    this.Npair = tSize;
    this.aaf = true;      // anti-aliasing filter
    this.wnd = wType.RECT;   // time domain window type
    this.w = [];
    this.tBuf = [];
    this.ar = [];
    this.ai = [];

    this.H = // Kaiser-Bessel Window LP filter: M=161, Att=-40dB, Fs=32768, Fa=0, Fb=820Hz
[0.000007,-0.000092,-0.000206,-0.000332,-0.000466,-0.000606,-0.000746,-0.000882,-0.001009,
-0.001120,-0.001210,-0.001274,-0.001305,-0.001300,-0.001253,-0.001163,-0.001026,-0.000842,
-0.000611,-0.000336,-0.000020,0.000331,0.000711,0.001109,0.001518,0.001924,0.002316,
0.002682,0.003006,0.003277,0.003481,0.003606,0.003640,0.003574,0.003401,0.003116,0.002716,
0.002202,0.001578,0.000852,0.000034,-0.000862,-0.001818,-0.002813,-0.003823,-0.004823,
-0.005784,-0.006677,-0.007471,-0.008136,-0.008642,-0.008959,-0.009061,-0.008923,-0.008524,
-0.007847,-0.006880,-0.005616,-0.004051,-0.002191,-0.000045,0.002373,0.005039,0.007928,
0.011006,0.014238,0.017580,0.020989,0.024417,0.027815,0.031131,0.034317,0.037322,0.040100,
0.042607,0.044801,0.046648,0.048117,0.049184,0.049832,0.050049,0.049832,0.049184,0.048117,
0.046648,0.044801,0.042607,0.040100,0.037322,0.034317,0.031131,0.027815,0.024417,0.020989,
0.017580,0.014238,0.011006,0.007928,0.005039,0.002373,-0.000045,-0.002191,-0.004051,-0.005616,
-0.006880,-0.007847,-0.008524,-0.008923,-0.009061,-0.008959,-0.008642,-0.008136,-0.007471,
-0.006677,-0.005784,-0.004823,-0.003823,-0.002813,-0.001818,-0.000862,0.000034,0.000852,
0.001578,0.002202,0.002716,0.003116,0.003401,0.003574,0.003640,0.003606,0.003481,0.003277,
0.003006,0.002682,0.002316,0.001924,0.001518,0.001109,0.000711,0.000331,-0.000020,-0.000336,
-0.000611,-0.000842,-0.001026,-0.001163,-0.001253,-0.001300,-0.001305,-0.001274,-0.001210,
-0.001120,-0.001009,-0.000882,-0.000746,-0.000606,-0.000466,-0.000332,-0.000206,-0.000092,
0.000007];       // anti-aliasing filter coeffs
  }

  SpectrumAnalyser.prototype.analyseTimeFn = function(funcStr, fsmp)
  {
    var dt = 1/fsmp,
        Hlen = this.H.length,
        subSmp = 16,
        buf = [subSmp*(this.Npair+Hlen)],     // temp buffer for raw time domain data
        Np,
        i, t,
        abs = function(x){return Math.abs(x);},
        acos = function(x){return Math.acos(x);},
        asin = function(x){return Math.asin(x);},
        atan = function(x){return Math.atan(x);},
        atan2 = function(y,x){return Math.atan2(y,x);},
        ceil = function(x){return Math.ceil(x);},
        cos = function(x){return Math.cos(x);},
        exp = function(x){return Math.exp(x);},
        floor = function(x){return Math.floor(x);},
        log = function(x){return Math.log(x);},
        max = function(){return Math.max.apply(this, arguments);},
        min = function(){return Math.min.apply(this, arguments);},
        pow = function(x,y){return Math.pow(x,y);},
        random = function(){return Math.random();},
        round = function(x){return Math.round(x);},
        sin = function(x){return Math.sin(x);},
        sqrt = function(x){return Math.sqrt(x);},
        tan = function(x){return Math.tan(x);},
        E = Math.E,
        PI = Math.PI,
        SQRT2 = Math.SQRT2,
        SQRT1_2 = Math.SQRT1_2,
        LN2 = Math.LN2,
        LN10 = Math.LN10,
        LOG2E = Math.LOG2E,
        LOG10E = Math.LOG10E;

    try
    {
      for (i=0; i<subSmp*(this.Npair+Hlen); i++)
      {
        t = i*dt/subSmp;            // funcStr is a funtion of this 't'
        buf[i] = eval(funcStr);
      }
    }
    catch(err)
    {
      alert("Function syntax error: "+err.message);
      return;
    }
    // anti-alias filter
    if (this.aaf)
    {
      convFilter(this.H, buf, this.ar, this.Npair, subSmp);
      for (i=0; i<this.Npair; i++)
      {
        this.ai[i] = 0;
      }
    }
    else
    {
      Np = (Hlen-1)/2;
      for (i=0; i<this.Npair; i++)
      {
        this.ar[i] = buf[Np+i*subSmp];      // offset so that with and without filter have same phase
        this.ai[i] = 0;
      }
    }
    // apply window
    if (this.wnd == wType.KB)
    {
      this.w = kbWnd(this.Npair, 2.5);
      for (i=0; i<this.Npair; i++)
      {
        this.ar[i] *= this.w[i];
        this.ai[i] = 0;
      }
    }
    else if (this.wnd == wType.HANN)
    {
      this.w = hannWnd(this.Npair);
      for (i=0; i<this.Npair; i++)
      {
        this.ar[i] *= this.w[i];
        this.ai[i] = 0;
      }
    }
    for (i=0; i<this.Npair; i++)
    {
      this.tBuf[i] = this.ar[i];          // grab a copy to plot time data
    }

    fft(1, this.Npair, this.ar, this.ai);
  };

}());
