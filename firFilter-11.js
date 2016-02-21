/*============================================================
  Filename: firFilter-11.js
  By: A.R.Collins

  Kaiser FIR Filter generator object, based on c routines
  written for DSP work.

  Requires: Cango-6vxx.js
            dspUtils-11.js,
            CangoAxes-1v23.js.

  Kindly give credit to Dr A R Collins <http://www.arc.id.au/>
  Report bugs to tony at arc.id.au

  Date   |Description                                     |By
  ------------------------------------------------------------
  12Aug08 First Release                                    ARC
  25Sep09 Dark bkg color for filter plot                   ARC
  08Nov09 Updated to use latest library versions           ARC
  14Nov10 Updated to use dspUtils-08.js                    ARC
  13Oct12 Convert to use Cango                             ARC
  11Mar13 Convert to use setPropertyDefault                ARC
  08Aug13 Convert to use Cango-3v28                        ARC
  09Feb15 Convert to use Cango-6v00                        ARC
  05Mar15 Convert to use CangoAxes-1v23                    ARC
  15Mar15 Convert to use Cango-7v00                        ARC
 =============================================================*/

  function KaiserFIR(Fs, Fa, Fb, M, Att)
  {
    this.Fs = Fs;
    this.Fa = Fa;
    this.Fb = Fb;
    this.M = M;         // number of coeffs in filter (symetric)
    this.Np = (M-1)/2;  // actual munber of coeffs in array
    this.Att = Att;
    this.coeffs = calcFilter(this.Fs, this.Fa, this.Fb, this.M, this.Att)
  }

  KaiserFIR.prototype.plotCoeffs = function(cvsID)
  {
    "use strict";

    var g = new Cango(cvsID),
        max = this.coeffs[this.Np],
        data = [],
        i;

    g.setGridboxRHC();
    g.fillGridbox("#303f30");
    g.setGridboxRHC(15, 5, 80, g.heightPW-10);
    g.setWorldCoords(0, -0.6, this.M, 1.6);
    g.drawAxes(0, this.M, -0.6, 1, {
      yTickInterval: 0.5,
      yLabelInterval: 0.5,
      y10thsOK: true,
      xOrigin: 0,
      yOrigin: 0,
      strokeColor: "#eeeeee",
      fillColor: "#cccccc" });
    // draw as bar graph
    for (i=0; i<this.M; i++)
    {
      data.push('M',i,0, 'L',i, this.coeffs[i]/max);
    }
    g.drawPath(data, 0, 0, {strokeColor:"white", lineWidth:3});
  }

  KaiserFIR.prototype.plotFreqResp = function(cvsID)
  {
    "use strict";

    var g = new Cango(cvsID),
        dF = this.Fs/1024,
        max = Math.abs(this.coeffs[this.Np]),
        ar = [], ai = [],
        fr = [],
    //    fi = [],
        data = [],
        yMin, yMax,
        mx = -100,
        j;

    // initialise arrays
    for (j=0; j<1024; j++)
    {
      ar[j] = 0;
      ai[j] = 0;
    }
    // put filter coeffs in real array (centered on x=0, wrapping around 1024 pts)
    ar[0] = this.coeffs[this.Np]/max;
    for (j=1; j<=this.Np; j++)
    {
      ar[j] = this.coeffs[this.Np+j]/max;
      ar[1024-j] = ar[j];
    }
    fft(1, 1024, ar, ai);

    // now form data array to plot
    for (j=0; j<512; j++)
    {
      fr[j] = 10*Math.log(2*(ar[j]*ar[j] + ai[j]*ai[j]))/Math.LN10;
      // fi[j] = Math.atan2(this.ai[i], this.ar[i]);
      if (fr[j] > mx)
      {
        mx = fr[j];
      }
    }
    yMax = 0;
    yMin = -100;
    // pack data into array for polyline plot (clip data)
    for (j=0; j<512; j++)
    {
      data[2*j] = j*dF;
      if (fr[j]-mx>yMin)
      {
        data[2*j+1] = fr[j]-mx;
      }
      else
      {
        data[2*j+1] = yMin;
      }
    }

    g.clearCanvas("#303f30");
    g.setGridboxRHC(15, 6, 80, g.heightPW-12);
    g.setWorldCoords(0, yMin, 512*dF, yMax-yMin);
    g.setPropertyDefault("strokeColor", "#eeeeee");
    g.drawBoxAxes(0, 512*dF, yMin, yMax, {
      yTickInterval: 10,
      xUnits: "Hz",
      yUnits: "dB",
      title: "Freq Response" });
    g.drawPath(data, 0, 0, {strokeColor: "white"});
  }

  KaiserFIR.prototype.listCoeffs = function(txtAreaID)
  {
    "use strict";
    var taNode = document.getElementById(txtAreaID),
        firList, firListNode,
        j;
    // remove existing child txt node
    while (taNode.firstChild)
    {
      taNode.removeChild(taNode.firstChild);
    }

    // list the coeffs as a text node
    firList = "[";
    for (j=0; j<this.M-1; j++)
    {
      firList += this.coeffs[j].toFixed(6)+", \r";
    }
    firList += this.coeffs[this.M-1].toFixed(6)+"] ";

    firListNode = document.createTextNode(firList);
    taNode.appendChild(firListNode);
  }
