/*================================================================
  Ballistic-trajectory-06.js
  Plot ballistic trajectory of cannonball
  please give credit to A.R.Collins <www.arc.id.au>
  last rev: 08Mar16
  ================================================================*/

var bore, MuzzleVelocity, SphereDrag, GS_Drag, Newton_Drag, genTrack;

(function() {
  "use strict";
    /*---------------------------------------------------------------
      bezier4pt() finds approximate y from cubic Bezier given x
      worst case y(x + xerr) is returned (where xerr is optional parm)
      assumes fn is well behaved ie single valued for all x
      Adapted from [http://antigrain.com/research/adaptive_bezier/]
    */
    function bezier4pt(x, x1, y1, x2, y2, x3, y3, x4, y4, dx)
    {
      // Calculate mid-points of line segments
      var x12   = (x1 + x2) / 2,
          y12   = (y1 + y2) / 2,
          x23   = (x2 + x3) / 2,
          y23   = (y2 + y3) / 2,
          x34   = (x3 + x4) / 2,
          y34   = (y3 + y4) / 2,
          x123  = (x12 + x23) / 2,
          y123  = (y12 + y23) / 2,
          x234  = (x23 + x34) / 2,
          y234  = (y23 + y34) / 2,
          x1234 = (x123 + x234) / 2,
          y1234 = (y123 + y234) / 2,
          xerr = dx || 0.0005;  // acceptable x error

      if (x<=x1)
      {
        return y1;
      }

      if (x>=x4)
      {
        return y4;
      }

      // x1234, y1234 is on the curve and between x1 and x4
      if (x>=x1234) // x is on new shorter curve between x1234 and x4
      {
        if ((x-x1234) > xerr)
        {
          return bezier4pt(x, x1234, y1234, x234, y234, x34, y34, x4, y4);
        }
        else
        {
          return y1234;
        }
      }
      else   // x is on new shorter curve between x1 and x1234
      {
        if ((x1234-x) > xerr)
        {
          return bezier4pt(x, x1, y1, x12, y12, x123, y123, x1234, y1234);
        }
        else
        {
          return y1234;
        }
      }
    }

    /*---------------------------------------------------------------
      SphereDragVsRe() returns Reynolds number for flow past a sphere
      from "Data Correlation for Drag Coeff for Sphere" F.A.Morrison
      [chem.mtu.edu]
    */
    function SphereDragVsRe(Re)
    {
      var Cd;

      function log10(val)
      {
        return Math.log(val) / Math.log(10);
      }

      if (Re > 2E6)
      {
        Cd = 0.15;
      }
      if (Re > 1.2E6)
      {
        Cd = 0.19 - 8E4/Re;
      }
      else if (Re > 4.77E5)
      {
        Cd = -0.485 + 0.1*log10(Re);
      }
      else
      {
        Cd = 24/Re + (2.6*(Re/5))/(1+Math.pow(Re/5,1.52))+ (0.411*Math.pow(Re/263000,-7.94))/(1+Math.pow(Re/263000,-8)) + Math.pow(Re,0.8)/461000;
      }

      return Cd;
    }

    /*---------------------------------------------------------------
      SphereDrag() modifies Morrison drag coeff v Reynolds number for
      speeds near Mach 1 to match experiment data summarised in
      'Sphere Drag at Mach Numbers from 0.3 to 2.0'
      Miller & Bailey [J.Fluid Mech, 1979].
    */
    SphereDrag = function(v, d)  // speed, diameter
    {
      // Imperial units
      var SSpd = 1116,    // sound speed at sea level (340.2 m/s)
          rho = 0.074,    // density of air  (1.225 kg/m^3)
          eta = 3.75E-7,  // viscosity of air (1.81E-5 kg/m.s)
          Mn = v/SSpd,    // Mach number
          Re, k, t, sf,
          Cd;

      if (Mn<0.2)
      {
        Mn = 0.2;
      }
      if (Mn>1.5)
      {
        Mn = 1.5;
      }

      Re = v*d*rho/eta;    // Reynolds number
      k = (Mn>=1.5)? 1.0: bezier4pt(Mn, 0.1, 0.00, 0.95, 0.0, 0.55, 0.95, 1.5, 1.0);
      t = (Mn>1.0)? 0.0: bezier4pt(Mn, 0.0, 1.1, 0.85, 1.1, 0.57, 0.05, 1.0, 0.0);
      sf = 0.78+0.22*Math.atan(-12*(Mn-0.23));

      Cd = k + t*SphereDragVsRe(sf*Re);

      return Cd;
    };

    Newton_Drag = function(v, d)
    {
      var Cd = 0.47;              // constant

      return Cd;
    };

    GS_Drag = function(v, d)  // drag force on 9/16" diameter sphere
    {
      // Imperial units
      var SSpd = 1116,   // sound speed at sea level (340.2 m/s)
          A, B, C, D,
          Cd;

      if (v>1699)
      {
        A = 3.3858E-08;
        B = -2.4613E-04;
        C = 5.5726E-01;
        D = 7.1420E+02;
      }
      else if (v>1456)
      {
        A = 8.8584E-07;
        B = -4.4983E-03;
        C = 7.6408;
        D = -3.2244E+03;
      }
      else if (v>1007)
      {
        A = -1.0241E-06;
        B = 3.1777E-03;
        C = -2.4839;
        D = 1.1394E+03;
      }
      else if (v>565)
      {
        A = -1.4740E-06;
        B = 4.0459E-03;
        C = -2.9583;
        D = 1.1963E+03;
      }
      else
      {
        A = 1.2464E-07;
        B = -8.0988E-05;
        C = 6.7392E-02;
        D = 5.1586E+02;
      }

      Cd = (A*v*v*v + B*v*v + C*v + D)/SSpd;

      return Cd;
    };

    MuzzleVelocity = function(m, p) // mass of ball (lb), mass of charge (lb)
    {
      var d = bore[m]/12,   // bore (ft) from table at ./Cannonballs.html
          eta = 55,         // density of powder (lb/ft^3)
          rho = 62.4,       // density of water
          atm = 14.7*32.2*144,    // 14 psi x g atmospheric pressure (lbw/ft^2)
          R = 1600,         // gunpowder gas pressure ratio to atm
          L = d*21,         // (18 calibre) length barrel (ft)
          c = p*4/(Math.PI*d*d*eta);  // length of charge in (ft)

      return Math.sqrt(2*R*atm/eta)*Math.sqrt(p/(m+p/3)*Math.log(L/c));
    };

    genTrack = function(dragFn, d, m, u, theta, y0)
    {
      var g = 32.2,            // acceleration due to gravity (9.8 m/s)
          rho = 0.074,         // density of air  (1.225 kg/m^3)
          phi = 3.158E-5,      // atm density scale factor (9.626E-6 /m)
          Cd, decel, H,        // drag coeff, deceleration, altitude factor
          x = 0,               // range
          y = y0 || 7,         // height
          V = u || 1680,       // magnitude of velocity vector
          theta0 = theta || 40,
          vx = V*Math.cos(Math.PI*theta/180.0), // x vel component
          vy = V*Math.sin(Math.PI*theta/180.0),
          ax, ay,              // acceleration components
          dt = 0.02,           // time step size
          trackData,
          range;

      trackData = [x/3, y/3];
      while (y>0)    // stop track when bullet hits ground
      {
        Cd = dragFn(V, d);
        H = Math.exp(-phi*y);
        decel = Cd*rho*H*Math.PI*d*d/(m*8);
        ax = -decel*V*vx;
        ay = -g -decel*V*vy;
        vx = vx + ax*dt;
        vy = vy + ay*dt;
        V = Math.sqrt(vx*vx+vy*vy);
        x = x + vx*dt + ax*dt*dt/2;
        y = y + vy*dt + ay*dt*dt/2;
        trackData.push(x/3, y/3);
      }
      // range = sprintf("%d yd", Math.round(x/3));
      return trackData;
    };

    bore = [];
    bore[4] = 3.18;
    bore[6] = 3.65;
    bore[9] = 4.17;
    bore[12] = 4.58;
    bore[18] = 5.25;
    bore[24] = 5.78;
    bore[32] = 6.36;
    bore[42] = 6.96;
    bore[64] = 8.01;
}());