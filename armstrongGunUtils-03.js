/*==========================================================================*
  Filename: armstrongGunUtils-03.js
  By: Dr A.R.Collins

  JavaScript Armstrong-Frederick gun drawing utilities.
  Requires:
  'CangoSVGtext-1v01.js'
  for use with Cango graphics library but Cgo2D data may be simply converted
  for use in SVG.

  Kindly give credit to Dr A.R.Collins <http://www.arc.id.au/>
  Report bugs to tony at arc.id.au

  Date   |Description                                                   |By
  --------------------------------------------------------------------------
  09Jan15 First public release                                           ARC
  13Jan15 Moved drawing origin to lower left of the scale                ARC
  15Mar15 Change "A" command sweep values to Cango Ver 7 convention      ARC
 *==========================================================================*/

  // exposed globals
  var calcGunDimensions, genGunPartOutlines, genGunSectionedOutlines, genScale,
      nature,                 // weight of round shot in pounds
      length,                 // in feet
      calibre,                // in inches
      calibreLength,          // in calibre
      barrel,
      muzzle,
      bore,
      reinforceRing1, reinforceRing2,
      astragal1, astragal2, astragal3, astragal1Plan,
      baseRing, baseRingPlan,
      ventfield, ventfieldPlan,
      trunnionFace, trunnionTopArm, trunnionBotArm,
      vent, ventPlan,
      cascable;

(function()
{
  "use strict";

      var patternTable = {"1":{calibre:2.019, breech:44, reinforce2:33, chase:24},
                          "3":{calibre:2.913, breech:44, reinforce2:33, chase:24},
                          "4":{calibre:3.204, breech:44, reinforce2:33, chase:24},
                          "6":{calibre:3.668, breech:44, reinforce2:33, chase:24},
                          "9":{calibre:4.2,   breech:42, reinforce2:32, chase:23},
                         "12":{calibre:4.623, breech:40, reinforce2:31, chase:22},
                         "18":{calibre:5.292, breech:38, reinforce2:30, chase:21},
                         "24":{calibre:5.823, breech:36, reinforce2:29, chase:20},
                         "32":{calibre:6.41,  breech:34, reinforce2:28, chase:19},
                         "42":{calibre:7.018, breech:32, reinforce2:27, chase:18}};

      var baseRingNmoulding,      // base ring plus fillet plus ogee
          ringNmoulding,          // other rings are 3/4 base ring width
          astragalNmoulding,      // astragals (with fillets) = 1/3 base ring width
          filletLen,              // all fillets are half astralgal width
          filletHgt,              // fillet projection is half fillet width
          astragalLen,            // astragal are 2*fillet length
          ringLen,                // ringNmoulding has 2 fillets, a ring and ogee
          ringNfillets,
          astragalRadius,         // astragal is semi-circular, radius=filletLen
          A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y,
          taper,
          ogeeLen,                // ogee width equals ring width
          ogeeHgt,
          ring1BotRadius,         // 1st reinforce ring radius at top of fillets
          ring1TopRadius,
          ring2BotRadius,         // 2nd reinforce ring radius at top of fillets
          ring2TopRadius,         // 2nd reinforce ring radius at top of fillets
          baseRingLen,            // base ring width minus (equal width) ogee and fillet in between
          baseOgeeLen,            // base ring width equals base ring ogee width
          // the base ring diameter set to be in line with tops of 1st & 2nd reinforce rings
          baseRingTaper,
          baseRingTopRadius,      // line through ring tops
          baseRingFilletRadius,   // base ring projects filletLen/2 above fillet
          baseOgeeTopRadius,      // base ring fillet projects filletLen/2 above ogee
          baseOgeeBotRadius,      // correct for taper at front edge of ogee
          baseOgeeHgt,
          ventFieldLen,           // vent field is from base ring to centre of vent astragal
          ventfieldWid,           // full width = 2.5 inches convert to calibre units
          astragal1BotRadius,     // ventfield astralgal radius (top of fillet)
          astragal2BotRadius,     // chase girdle astralgal radius (top of fillet)
          chaseTaper,
          astragal3BotRadius,
          ventFieldBackHgt,
          ventFieldFrontHgt,      // theoretical corner if not rounded
          trunnionWid,            // minimum half width from axis of trunnions
          filletCentre,           // fillet at back of bore 1/24 calibre radius
          ventWid,                // vent diameter = 2/10 inch, convert to calibre
          ventSlope,              // vent back wall goes through N then to a point 4/32 from back on bottom of bore
          filletCentre,           // fillet at back of bore 1/24 calibre radius
          vF,                     // vent intersection with top of bore
          ventTB, ventTF, ventBB, ventBF, // vent Top Back, vent Top Front, vent Bottom Back, vent Bottom Front
          // muzzle
          mN, mE, mK, mI, mR, mS,
          swellRadius,
          mOgeeTopRadius,
          mOgeeBotRadius,
          mOgeeLen,
          // cascable
          cA, cC, cE, cK, cG, cM, cN,
          // intermediate points for hidden line removal, r1 = 1st reinforce, r2 = 2nd reinforce, ch = chase, cs = cascable
          r1a, r1b, r1c, r1d, r2a, r2b,
          cha, chb, chc, chd, che, chf,
          csa, csb,
          // gun components (Cgo2D arrays)
          baseRingTopOgee, baseRingBotOgee,
          ringTopOgee, ringBotOgee,
          mTopOgee, mBotOgee,
          cTopOgee, cBotOgee,
          vff;

      // All unit in calibre (bore diameter)
      function Point(x, y)
      {
        this.x = x || 0;
        this.y = y || 0;
      }

      calcGunDimensions = function(shotWt, barrelLen)
      {
        nature = shotWt;
        length = barrelLen;                         // in feet
        calibre = patternTable[nature].calibre;     // in inches
        calibreLength = 12*length/calibre;          // in calibre
        baseRingNmoulding = calibreLength/32;       // base ring plus fillet plus ogee
        ringNmoulding = baseRingNmoulding*3/4;      // other rings are 3/4 base ring width
        astragalNmoulding = baseRingNmoulding/3;    // astragals (with fillets) = 1/3 base ring width
        filletLen = astragalNmoulding/4;            // all fillets are half astralgal width
        filletHgt = filletLen/2;                    // fillet projection is half fillet width
        astragalLen = 2*filletLen;                  // astragal are 2*fillet length
        ringLen = (ringNmoulding-2*filletLen)/2;    // ringNmoulding has 2 fillets, a ring and ogee
        ringNfillets = ringLen+2*filletLen;
        astragalRadius = filletLen;                 // astragal is semi-circular, radius=filletLen
        A = new Point(0, 0);
        B = new Point(calibreLength, 0);
//          C = new Point(0, 1/2);
        D = new Point(calibreLength, 1/2);
//          E = new Point(0, -1/2);
//          F = new Point(calibreLength, -1/2);
        G = new Point(2*calibreLength/7, 0);        // front of 1st reinforce
        I = new Point(3*calibreLength/7+1, 0);      // front of 2nd reinforce
        M = new Point(patternTable[nature].breech/32, 0);
        J = new Point(M.x+1/4+astragalNmoulding, 0);
        N = new Point(M.x, 1/2);
        O = new Point(M.x, N.y+patternTable[nature].breech/32); // max metal thickness (base of bore)
        P = new Point(I.x, 1/2);
        K = new Point(I.x, P.y+patternTable[nature].reinforce2/32);   // 2nd reinforce radius
        R = new Point(K.x, K.y+2/32);               // step size from reinforce2 to reinforce1
        taper = (R.y-O.y)/(R.x-O.x);
        Q = new Point(0, O.y-taper*O.x);
        H = new Point(G.x, Q.y+taper*G.x);
        S = new Point(G.x, K.y-taper*(I.x-G.x));
        T = new Point(K.x, K.y-2/32);
        ogeeLen = ringLen;                          // ogee width equals ring width
        ogeeHgt = 2/32-filletHgt-taper*ringLen;
        ring1BotRadius = H.y-taper*(ringLen+2*filletLen)+filletHgt;  // 1st reinforce ring radius at top of fillets
        ring1TopRadius = ring1BotRadius + filletHgt;
        ring2BotRadius = K.y-taper*(ringLen+2*filletLen)+filletHgt;  // 2nd reinforce ring radius at top of fillets
        ring2TopRadius = ring2BotRadius + filletHgt;// 2nd reinforce ring radius at top of fillets
        baseRingLen = (baseRingNmoulding - filletLen)/2;  // base ring width minus (equal width) ogee and fillet in between
        baseOgeeLen = baseRingLen;                  // base ring width equals base ring ogee width
        // the base ring diameter set to be in line with tops of 1st & 2nd reinforce rings
        baseRingTaper = (ring2TopRadius - ring1TopRadius)/(calibreLength/7+1);
        baseRingTopRadius = ring1TopRadius - baseRingTaper*2*calibreLength/7;  // line through ring tops
        baseRingFilletRadius = baseRingTopRadius - filletHgt; // base ring projects filletLen/2 above fillet
        baseOgeeTopRadius = baseRingFilletRadius - filletHgt; // base ring fillet projects filletLen/2 above ogee
        baseOgeeBotRadius = Q.y + taper*baseRingNmoulding + filletHgt;  // correct for taper at front edge of ogee
        baseOgeeHgt = baseOgeeTopRadius - baseOgeeBotRadius;
        L = new Point(calibreLength-2*ring2TopRadius, 0); // front of chase = front of muzzle astragal
        U = new Point(L.x, 1/2+patternTable[nature].chase/32);       // metal thickness at end of chase
        V = new Point(L.x, 1/2);                          // front of muzzle astragal
        ventFieldLen = J.x-astragalNmoulding/2-baseRingLen;   // vent field is from base ring to centre of vent astragal
        ventfieldWid = 2.5/calibre;           // full width = 2.5 inches convert to calibre units
        W = new Point(I.x+ventFieldLen, 0);   // front of astragal2 (chase girdle width = vent field width)
        astragal1BotRadius = Q.y + taper*(J.x - astragalNmoulding) + filletHgt;  // ventfield astralgal radius (top of fillet)
        astragal2BotRadius = T.y + taper*(W.x - T.x - astragalNmoulding) + filletHgt; // chase girdle astralgal radius (top of fillet)
        chaseTaper = (T.y - U.y)/(T.x - U.x);
        astragal3BotRadius = U.y - chaseTaper*astragalNmoulding + filletHgt;
        ventFieldBackHgt = baseRingTopRadius;
        ventFieldFrontHgt = ventFieldBackHgt + taper*ventFieldLen;  // theoretical corner if not rounded
        Y = new Point(baseRingLen,ventFieldBackHgt);
        X = new Point(3*calibreLength/7, -1/2);  // trunnion axis
        trunnionWid = ring2TopRadius+1;  // minimum half width from axis of trunnions
        filletCentre = new Point(N.x+1/24, N.y-1/24);  // fillet at back of bore 1/24 calibre radius
        ventWid = 0.2/calibre;          // vent diameter = 2/10 inch, convert to calibre
        ventSlope = -32/4;              // vent back wall goes through N then to a point 4/32 from back on bottom of bore
        filletCentre = new Point(N.x+1/24, N.y-1/24);  // fillet at back of bore 1/24 calibre radius
        vF = new Point(N.x+ventWid*Math.sqrt(1+1/(ventSlope*ventSlope)), N.y);  // vent intersection with top of bore
        // muzzle dimensions
        mN = new Point(U.x+2*ring2TopRadius/5, U.y+chaseTaper*2*ring2TopRadius/5);
        mE = new Point(B.x, mN.y);                                 // metal thickness at mN equals metal thickness at the muzzle mouth
        mK = new Point(B.x-ringNmoulding, ring2TopRadius);
        swellRadius = ringNmoulding/4;
        mI = new Point(mK.x, mK.y-swellRadius);
        mR = new Point(mI.x+swellRadius, mI.y);
        mS = new Point(mK.x-swellRadius/3, mI.y+swellRadius*Math.sqrt(8/9));
        mOgeeTopRadius = mR.y - filletLen;
        mOgeeBotRadius = mE.y + filletLen;
        mOgeeLen = mE.x - mR.x -2*filletLen;
        // cascable dimensions
        cA = new Point(-2-9/32, 0);
        cC = new Point(-4/32-filletLen, baseRingTopRadius-4/32);
        cE = new Point(-24/32, 24/32);    // diameter 1 16/32
        cK = new Point(cE.x+3/32+2*filletLen, cE.y+4/32+filletLen);
        cG = new Point(cA.x+20/32, 0);
        cM = new Point(cG.x+16/32, 30/32);   // 34/32 radius from cG and 34,30,16 is pythagorus triplet
        cN = new Point(cG.x+20/34*(16/32), 20/34*(30/32));  // by similar triangles
        // intermediate points for hidden line removal, r1 = 1st reinforce, r2 = 2nd reinforce, ch = chase, cs = cascable
        r1a = new Point(baseRingNmoulding, Q.y+taper*baseRingNmoulding);  // intersection of reinforce 1 and baseRing
        r1b = new Point(M.x+1/4, Q.y+taper*(M.x+1/4));
        r1c = new Point(J.x, Q.y+taper*J.x);
        r1d = new Point(G.x-ringNfillets, Q.y+taper*(G.x-ringNfillets));
        r2a = new Point(S.x+ogeeLen, S.y+taper*ogeeLen);                  // reinforce 2 barrel
        r2b = new Point(I.x-ringNfillets, S.y+taper*(I.x-S.x-ringNfillets));
        cha = new Point(T.x+ogeeLen, T.y+chaseTaper*ogeeLen);
        chb = new Point(W.x-astragalNmoulding, T.y+chaseTaper*(W.x-T.x-astragalNmoulding));
        chc = new Point(W.x, T.y+chaseTaper*(W.x-T.x));
        chd = new Point(U.x-astragalNmoulding, T.y+chaseTaper*(U.x-T.x-astragalNmoulding));
        che = U;
        chf = mN;
        csa = new Point(cG.x-filletLen/2, Math.sqrt(20/32*20/32-filletLen*filletLen/4));     // only a good approximation to y value
        csb = new Point(cG.x+filletLen/2, Math.sqrt(20/32*20/32-filletLen*filletLen/4));
        ventBB = calcCircleIntercept(N, ventSlope, filletCentre, 1/24);
        // In larger guns the bore fillet may extend past the vent hole, so calculate where front of vent intercepts the fillet
        if (vF.x < N.x+1/24)
        {
          ventBF = calcCircleIntercept(vF, ventSlope, filletCentre, 1/24); // vent front intercepts the fillet arc
        }
        else
        {
          ventBF = vF;     // vent intersection with top of bore
        }
        ventTB = calcLineIntercept(Y, taper, ventBB, ventSlope);
        ventTF = calcLineIntercept(Y, taper, ventBF, ventSlope);
        // calc dimensions of vent field fillet (vvf)
        vff = genBullnoseFillet(Y.x,Y.y, Y.x+ventFieldLen,ventFieldFrontHgt, ventFieldFrontHgt-(astragal1BotRadius+filletLen));
      };

      function ogee(dx, dy, vert)
      {
        // generate SVG string for ogee whose tangent starts and ends horizontal
        var a = dy/2,
            b = dx/2,
            sweep = vert ? 0: 1,    // SVG arc differently for vertical tangents
            backSweep = vert ? 1: 0,    //  flip for vertical tangents
            d = vert ? b : a,       // flip for vertical tangents
            r = (a*a + b*b)/(2*Math.abs(d)),
            up = (dy>=0),
            rgt = (dx>=0),
            dn = (dy<0),
            lft = (dx<0);

        if ((up && rgt) || (dn && lft))
        {
          return ["a", r, r, 0, 0, sweep, b, a, r, r, 0, 0, backSweep, b, a];
        }
        else  // (up && lft) || (dn && rgt)
        {
          return ["a", r, r, 0, 0, backSweep, b, a, r, r, 0, 0, sweep, b, a];
        }
      }

      function genBullnoseFillet(px, py, qx, qy, height)
      {
        // generate the fillet between 2 lines which intersect at Q,
        // one from P to Q, the other vertical through Q to R on the X axis.
        // The fillet starts tangent to the second PQ and
        // ends tangent to QR at 'height' down from Q.
        // Fillet end points and radius are returned.
        // Based on code generating tangent to  circle:
        // ref: http://stackoverflow.com/questions/1351746/find-a-tangent-point-on-circle
        // ref: http://jsfiddle.net/zxqCw/1/
        var theta = Math.atan((qx-px)/(py-qy)),   // angle of PQ from the vertical
            r = height/Math.tan(theta/2),
            x = r*Math.cos(theta),
            y = r*Math.sin(theta),
            sx = qx - r + x,
            sy = qy - height + y,
            ex = qx,
            ey = qy - height;

        return {x1:sx, y1:sy, x2:ex, y2:ey, radius:r};
      }

      function calcCircleIntercept(p, m, c, r)       // p, c are Point objects m is slope
      {
        // ref: http://stackoverflow.com/questions/1073336/circle-line-collision-detection
        // p is point on the line
        // m is slope of the line
        // c is the circle's center
        // r is the circle's radius
        var t1, t2, i1, i2,
            p1 = {x:p.x - c.x, y:p.y - c.y}, //shifted line points
            b = p1.y - m * p1.x, //y-intercept of line
            underRadical = r*r*(m*m+1)-b*b; //the value under the square root sign

        if (underRadical < 0)
        {
          //line completely missed
          return new Point();
        }
        else
        {
          t1 = (-2*m*b-2*Math.sqrt(underRadical))/(2*m*m + 2); //one of the intercept x's
          i1 = {x:t1,y:m*t1+b} //intercept point 1
        }

        return new Point(i1.x+c.x, i1.y+c.y);
      }

      function calcLineIntercept(p1, m1, p2, m2)       // p1, p2 are Point objects
      {
        // p1 is point on first line
        // m1 is slope of first line
        // p2 is point on second line
        // m2 is slope of second line, m2 !=  m1  or lines parallel
        var i = new Point(),
            b = p1.y - m1*p1.x,
            c = p2.y - m2*p2.x;

        i.x = (b - c)/(m2 - m1);
        i.y = m1*i.x + b;

        return i;
      }

      genScale = function(nat, len)
      {
        var clbr = patternTable[nat].calibre,     // in inches
            s = [],   // length scale in ft
            strObj,
            i;

        // ft-inches vernier scale
        s.push("M",0,0, "l",36/clbr,0, 0,10/clbr, -36/clbr,0,"z",    // 36"x 10" rectangle
               "M", 12/clbr,0, "l",0,10/clbr, "M", 24/clbr,0, "l",0,10/clbr);   // divide into 12" boxes

        for (i=0; i<=3; i++)                                                   // 0, 1, 2, 3 feet labels
        {
          strObj = stringToCgo2D(i.toString(), i*12/clbr, 10.2/clbr, 1.3/clbr, 8);
          s = s.concat(strObj.cgoData);
        }
        strObj = stringToCgo2D("ft", 36.75/clbr, 10.2/clbr, 1.3/clbr, 7);       // 'ft' labels after '3'
        s = s.concat(strObj.cgoData);

        for (i=0; i < 10; i++)
        {
          s.push("M",0,0, "m",0, i/clbr, "l",12/clbr,0);   // 10 horizontals in first box
        }
        for (i=0; i < 12; i++)
        {
          s.push("M",i/clbr,10/clbr, "l",1/clbr,-10/clbr);         // 1/10" vernier lines
        }

        for (i=1; i<11; i++)
        {
          strObj = stringToCgo2D(i.toString(), i/clbr, 10.2/clbr, 0.75/clbr, 8);   // 1 to 19 inch labels
          s = s.concat(strObj.cgoData);
        }
        strObj = stringToCgo2D("11", 10.7/clbr, 10.2/clbr, 0.75/clbr, 7);          // 11 inch label
        s = s.concat(strObj.cgoData);
        for (i=1; i<10; i++)                                                      // 1 to 10 1/10" labels
        {
          strObj = stringToCgo2D("."+i, -0.5/clbr, 10.2/clbr-i/clbr, 0.75/clbr, 6);
          s = s.concat(strObj.cgoData);
        }

        return s;
      };

      genGunPartOutlines = function()
      {
        barrel = ["M",r1a.x, r1a.y, "L",r1b.x,r1b.y, "M",r1c.x, r1c.y, "L",r1d.x,r1d.y,
            "M",r2a.x, r2a.y, "L",r2b.x,r2b.y,
            "M",cha.x, cha.y, "L",chb.x,chb.y, "M",chc.x, chc.y, "L",chd.x,chd.y, "M",che.x, che.y, "L",chf.x,chf.y,
            "M",r1a.x, -r1a.y, "L",r1b.x,-r1b.y, "M",r1c.x, -r1c.y, "L",r1d.x,-r1d.y,
            "M",r2a.x, -r2a.y, "L",r2b.x,-r2b.y,
            "M",cha.x, -cha.y, "L",chb.x,-chb.y, "M",chc.x, -chc.y, "L",chd.x,-chd.y, "M",che.x, -che.y, "L",chf.x,-chf.y];
        baseRingTopOgee = ogee(baseOgeeLen, -baseOgeeHgt);      // construct base ring ogee arcs in Cgo2D
        baseRingBotOgee = ogee(-baseOgeeLen, -baseOgeeHgt);     // construct flipped base ring ogee arcs
        baseRing = ["M",A.x,A.y,"l", 0,baseRingTopRadius, baseRingLen,0, 0, -2*baseRingTopRadius, -baseRingLen,0, 0,baseRingTopRadius,
            "M",baseRingLen, baseRingFilletRadius, 'l',filletLen,0, 0,-2*baseRingFilletRadius, -filletLen,0, 0,baseRingFilletRadius,
            "M",baseRingLen+filletLen,baseOgeeTopRadius].concat(baseRingTopOgee, ["l",0,-2*baseOgeeBotRadius], baseRingBotOgee);
        astragal1 = ["M",J.x-filletLen-astragalLen,0, "l",0,astragal1BotRadius,"a",astragalRadius, astragalRadius,0,0,0,astragalLen,0,
            "l",0,-2*astragal1BotRadius, "a",astragalRadius, astragalRadius,0,0,0,-astragalLen,0, "l",0,astragal1BotRadius,
            "M",J.x-filletLen-astragalLen,astragal1BotRadius, "l",-filletLen,0, 0,-2*astragal1BotRadius, filletLen,0,
            "M",J.x-filletLen,astragal1BotRadius, "l",filletLen,0, 0, -2*astragal1BotRadius, -filletLen,0];
        ringTopOgee = ogee(ogeeLen, -ogeeHgt);
        ringBotOgee = ogee(-ogeeLen, -ogeeHgt);
        reinforceRing1 = ["M",G.x-ringLen-filletLen,0, 'l',0,ring1TopRadius, ringLen,0, 0,-2*ring1TopRadius, -ringLen,0, 0, ring1TopRadius,
            "M", G.x-ringLen-filletLen, ring1BotRadius, "l", -filletLen,0, 0,-2*ring1BotRadius, filletLen,0,
            "M",G.x-filletLen,ring1BotRadius, 'l',filletLen,0, 0,-2*ring1BotRadius, -filletLen,0,
            "M",G.x,ring1BotRadius-filletHgt].concat(ringTopOgee, ['l', 0,-2*(ring1BotRadius-filletHgt-ogeeHgt)], ringBotOgee);
        reinforceRing2 = ["M",I.x-ringLen-filletLen, 0, "l",0,ring2TopRadius, ringLen,0, 0,-2*ring2TopRadius, -ringLen,0, 0, ring2TopRadius,
            "M",I.x-ringLen-filletLen,ring2BotRadius, "l",-filletLen,0, 0,-2*ring2BotRadius, filletLen,0,
            "M",I.x-filletLen,ring2BotRadius, "l",filletLen,0, 0,-2*ring2BotRadius, -filletLen,0,
            "M",I.x,ring2BotRadius-filletHgt].concat(ringTopOgee, ['l', 0,-2*(ring2BotRadius-filletHgt-ogeeHgt)], ringBotOgee);
        astragal2 = ["M",W.x-filletLen-astragalLen,0, "l",0,astragal2BotRadius,"a",astragalRadius, astragalRadius,0,0,0,astragalLen,0,
            "l",0,-2*astragal2BotRadius, "a",astragalRadius, astragalRadius,0,0,0,-astragalLen,0, "l",0,astragal2BotRadius,
            "M",W.x-filletLen-astragalLen,astragal2BotRadius, "l",-filletLen,0, 0,-2*astragal2BotRadius, filletLen,0,
            "M",W.x-filletLen,astragal2BotRadius, "l",filletLen,0, 0, -2*astragal2BotRadius, -filletLen,0];
        astragal3 = ["M",L.x-filletLen-astragalLen,0, "l",0,astragal3BotRadius,"a",astragalRadius, astragalRadius,0,0,0,astragalLen,0,
            "l",0,-2*astragal3BotRadius, "a",astragalRadius, astragalRadius,0,0,0,-astragalLen,0, "l",0,astragal3BotRadius,
            "M",L.x-filletLen-astragalLen,astragal3BotRadius, "l",-filletLen,0, 0,-2*astragal3BotRadius, filletLen,0,
            "M",L.x-filletLen,astragal3BotRadius, "l",filletLen,0, 0, -2*astragal3BotRadius, -filletLen,0];
        trunnionFace = ["M",X.x,X.y].concat(shapeDefs.circle(1));
        trunnionTopArm = ["M",X.x-1/2, S.y+taper*(X.x-S.x-1/2),"L", X.x-1/2,trunnionWid, X.x+1/2,trunnionWid, X.x+1/2,S.y+taper*(X.x-S.x+1/2)];
        trunnionBotArm = ["M",X.x-1/2, -(S.y+taper*(X.x-S.x-1/2)),"L", X.x-1/2,-trunnionWid, X.x+1/2,-trunnionWid, X.x+1/2,-(S.y+taper*(X.x-S.x+1/2))];
        ventfield = ["M",baseRingLen,ventFieldBackHgt, "L",vff.x1,vff.y1, "A",vff.radius,vff.radius,0,0,0,vff.x2,vff.y2];
        vent = ["M",ventBB.x,ventBB.y, "L",ventTB.x, ventTB.y, "M",ventBF.x,ventBF.y, "L",ventTF.x, ventTF.y];
        bore = ["M", D.x,D.y, "L",N.x+1/24,N.y, "A", 1/24,1/24,0,0,1,N.x,N.y-1/24,
            "L",N.x,-N.y+1/24, "A",1/24,1/24,0,0,1,N.x+1/24,-N.y,"L",D.x,-D.y];
        mTopOgee = ogee(mOgeeLen, mOgeeBotRadius-mOgeeTopRadius);
        mBotOgee = ogee(-mOgeeLen, mOgeeBotRadius-mOgeeTopRadius);
        muzzle = ["M",mN.x,mN.y, "A",5,5,0,0,1,mS.x,mS.y, swellRadius,swellRadius,0,0,0,mR.x,mR.y, "l",0,-2*mR.y,
            "A",swellRadius,swellRadius,0,0,0,mS.x,-mS.y,5,5,0,0,1,mN.x,-mN.y,
            "M",mR.x,mR.y, "l",filletLen,0, 0,-2*mR.y, -filletLen,0, "M", mR.x+filletLen, mR.y-filletLen].concat(mTopOgee,
            ["l",0,-2*(mE.y+filletLen)], mBotOgee, ["M",mE.x-filletLen, mE.y, "l",filletLen,0, 0,-2*mE.y, -filletLen,0]);
        cTopOgee = ogee(cK.x-cC.x, cK.y-cC.y, true);
        cBotOgee = ogee(cC.x-cK.x, cK.y-cC.y, true);
        cascable = ["M",0,baseRingTopRadius, "A",4/32,4/32,0,0,1,cC.x+filletLen,cC.y, "l",0,-2*cC.y, "A",4/32,4/32,0,0,1,0,-baseRingTopRadius,
            "M",cC.x+filletLen,cC.y,"l",-filletLen,0, 0,-2*cC.y, filletLen,0,
            "M",cC.x,cC.y].concat(cTopOgee, ["l",0,-2*cK.y], cBotOgee,
            ["M",cK.x,cK.y,"l",-filletLen,0, 0,-2*cK.y, filletLen,0,
            "M",cK.x-filletLen,cK.y-filletLen, "A",4/32,4/32,0,0,1,cE.x+filletLen,cE.y,"l",0,-2*cE.y,
            "A",4/32,4/32,0,0,1,cK.x-filletLen,-cK.y+filletLen,
            "M",cE.x+filletLen,cE.y,"l",-filletLen,0, 0,-2*cE.y, filletLen,0,
            "M",cE.x,cE.y, "A",14/32,14/32,0,0,0,cN.x,cN.y,20/32,20/32,0,0,1,csb.x,csb.y,
            "M",cE.x,-cE.y, "A",14/32,14/32,0,0,1,cN.x,-cN.y,20/32,20/32,0,0,0,csb.x,-csb.y,
            "M",cG.x-filletLen/2,0, "l",0,20/32,"a",filletLen/2,filletLen/2,0,0,0,filletLen,0,"l",0,-40/32,
            "a",filletLen/2,filletLen/2,0,0,0,-filletLen,0,"l",0,20/32,
            "M",csa.x,csa.y, "a",20/32,20/32,0,1,1,0,-2*csa.y]);


        baseRingPlan = ["M",A.x,A.y,"l",0,baseRingTopRadius, baseRingLen,0, 0, -baseRingTopRadius+ventfieldWid/2,
            "m",0,-ventfieldWid, "l",0,-baseRingTopRadius+ventfieldWid/2, -baseRingLen,0, 0,baseRingTopRadius,
            "M",baseRingLen, baseRingFilletRadius, 'l',filletLen,0, 0,-baseRingFilletRadius+ventfieldWid/2,
            "m",0,-ventfieldWid, "l",0,-baseRingFilletRadius+ventfieldWid/2, -filletLen,0,
            "M",baseRingLen+filletLen,baseOgeeTopRadius].concat(baseRingTopOgee, ["l",0,-baseOgeeBotRadius+ventfieldWid/2,
            "m",0, -ventfieldWid, "l",0,-baseOgeeBotRadius+ventfieldWid/2], baseRingBotOgee);
        ventPlan = ["M",ventTB.x+ventWid/2,ventWid/2, "L",M.x, ventWid/2, "M",ventTB.x+ventWid/2,-ventWid/2, "L",M.x,-ventWid/2];
        ventfieldPlan = ["M",baseRingLen, -ventfieldWid/2, "l",0,ventfieldWid, ventFieldLen,0, 0,-ventfieldWid, -ventFieldLen,0,
            "M",ventTB.x+ventWid/2,0].concat(shapeDefs.circle(ventWid));  // touch hole
        astragal1Plan = ["M",J.x-filletLen-astragalLen,ventfieldWid/2, "l",0,astragal1BotRadius-ventfieldWid/2,
            "a",astragalRadius, astragalRadius,0,0,0,astragalLen,0,
            "l",0,-2*astragal1BotRadius, "a",astragalRadius, astragalRadius,0,0,0,-astragalLen,0, "l",0,astragal1BotRadius-ventfieldWid/2,
            "M",J.x-filletLen-astragalLen,astragal1BotRadius, "l",-filletLen,0, 0,-astragal1BotRadius+ventfieldWid/2,
            "m",0,-ventfieldWid, "l",0,-astragal1BotRadius+ventfieldWid/2, filletLen,0,
            "M",J.x-filletLen,astragal1BotRadius, "l",filletLen,0, 0, -2*astragal1BotRadius, -filletLen,0];
      };

      genGunSectionedOutlines = function()
      {
        barrel = ["M",Q.x, Q.y, "L",H.x,H.y,                    // 1st reinforce
            "M",S.x,S.y, "L",K.x,K.y,                           // 2nd reinforce
            "M",T.x, T.y, "L",mN.x,mN.y,                        // chase
            "M",A.x, A.y, "L", Q.x, -Q.y, H.x, -H.y, G.x, G.y,  // 1st reinforce
            "M",S.x, -S.y, "L", K.x, -K.y, I.x, I.y,            // 2nd reinforce
            "M", T.x, -T.y, "L", mN.x, -mN.y, mN.x, 0,          // chase
            "M",mN.x, -mN.y, mE.x,-mE.y, B.x,B.y];              // muzzle
        baseRingTopOgee = ogee(baseOgeeLen, -baseOgeeHgt);      // construct base ring ogee arcs in Cgo2D
        baseRing = ["M",A.x,A.y,"l", 0,baseRingTopRadius, baseRingLen,0, 0,-baseRingTopRadius,
            "M",baseRingLen,baseRingFilletRadius, 'l',filletLen,0, 0,-baseRingFilletRadius,
            "M",baseRingLen+filletLen,baseOgeeTopRadius].concat(baseRingTopOgee, ["l",0,-baseOgeeBotRadius]);
        astragal1 = ["M",J.x-filletLen-astragalLen,0, "l",0,astragal1BotRadius,"a",astragalRadius,astragalRadius,0,0,0,astragalLen,0,
            "l",0,-astragal1BotRadius,
            "M",J.x-filletLen-astragalLen,astragal1BotRadius, "l",-filletLen,0, 0,-astragal1BotRadius,
            "M",J.x-filletLen,astragal1BotRadius, "l",filletLen,0, 0,-astragal1BotRadius];
        ringTopOgee = ogee(ogeeLen, -ogeeHgt);
        reinforceRing1 = ["M",G.x-ringLen-filletLen,0, 'l',0,ring1TopRadius, ringLen,0, 0,-ring1TopRadius,
            "M",G.x-ringLen-filletLen,ring1BotRadius, "l",-filletLen,0, 0,-ring1BotRadius,
            "M",G.x-filletLen,ring1BotRadius, 'l',filletLen,0, 0,-ring1BotRadius,
            "M",G.x,ring1BotRadius-filletHgt].concat(ringTopOgee, ['l', 0,-(ring1BotRadius-filletHgt-ogeeHgt)]);
        reinforceRing2 = ["M",I.x-ringLen-filletLen, 0, "l",0,ring2TopRadius, ringLen,0, 0,-ring2TopRadius,
            "M",I.x-ringLen-filletLen,ring2BotRadius, "l",-filletLen,0, 0,-ring2BotRadius,
            "M",I.x-filletLen,ring2BotRadius, "l",filletLen,0, 0,-ring2BotRadius,
            "M",I.x,ring2BotRadius-filletHgt].concat(ringTopOgee, ['l', 0,-(ring2BotRadius-filletHgt-ogeeHgt)]);
        astragal2 = ["M",W.x-filletLen-astragalLen,0, "l",0,astragal2BotRadius,"a",astragalRadius, astragalRadius,0,0,0,astragalLen,0,
            "l",0,-astragal2BotRadius,
            "M",W.x-filletLen-astragalLen,astragal2BotRadius, "l",-filletLen,0, 0,-astragal2BotRadius,
            "M",W.x-filletLen,astragal2BotRadius, "l",filletLen,0, 0,-astragal2BotRadius];
        astragal3 = ["M",L.x-filletLen-astragalLen,0, "l",0,astragal3BotRadius,"a",astragalRadius, astragalRadius,0,0,0,astragalLen,0,
            "l",0,-astragal3BotRadius,
            "M",L.x-filletLen-astragalLen,astragal3BotRadius, "l",-filletLen,0, 0,-astragal3BotRadius,
            "M",L.x-filletLen,astragal3BotRadius, "l",filletLen,0, 0,-astragal3BotRadius];
        trunnionFace = ["M",X.x,X.y].concat(shapeDefs.circle(1));
        trunnionTopArm = ["M",X.x-1/2, S.y+taper*(X.x-S.x-1/2),"L", X.x-1/2,trunnionWid, X.x+1/2,trunnionWid, X.x+1/2,S.y+taper*(X.x-S.x+1/2)];
        ventfield = ["M",baseRingLen,ventFieldBackHgt, "L",vff.x1,vff.y1, "A",vff.radius,vff.radius,0,0,0,vff.x2,vff.y2];
        vent = ["M",ventBB.x,ventBB.y, "L",ventTB.x, ventTB.y, "M",ventBF.x,ventBF.y, "L",ventTF.x, ventTF.y];
        ventfieldPlan = ["M",baseRingLen, -ventfieldWid/2, "l",0,ventfieldWid, ventFieldLen,0, 0,-ventfieldWid, -ventFieldLen,0,
            "M",ventTB.x+ventWid/2,0].concat(shapeDefs.circle(ventWid));  // touch hole
        bore = ["M", D.x,D.y, "L",N.x+1/24,N.y, "A",1/24,1/24,0,0,1,N.x,N.y-1/24,
            "L",N.x,-N.y+1/24, "A",1/24,1/24,0,0,1,N.x+1/24,-N.y, "L",D.x,-D.y];
        mTopOgee = ogee(mOgeeLen, mOgeeBotRadius-mOgeeTopRadius);
        muzzle = ["M",mN.x,mN.y, "A",5,5,0,0,1,mS.x,mS.y, swellRadius,swellRadius,0,0,0,mR.x,mR.y, "l",0,-mR.y,   // cavetto radius = 5
            "M",mR.x,mR.y, "l",filletLen,0, 0,-mR.y, "M", mR.x+filletLen,mR.y-filletLen].concat(mTopOgee,
            ["l",0,-(mE.y+filletLen), "M",mE.x-filletLen, mE.y, "l",filletLen,0, 0,-mE.y]);
        cTopOgee = ogee(cK.x-cC.x, cK.y-cC.y, true);
        cascable = ["M",0,baseRingTopRadius, "A",4/32,4/32,0,0,1,cC.x+filletLen,cC.y, "l",0,-cC.y,
            "M",cC.x+filletLen,cC.y,"l",-filletLen,0, 0,-cC.y,
            "M",cC.x,cC.y].concat(cTopOgee, ["l",0,-cK.y,
            "M",cK.x,cK.y,"l",-filletLen,0, 0,-cK.y,
            "M",cK.x-filletLen,cK.y-filletLen, "A",4/32,4/32,0,0,1,cE.x+filletLen,cE.y,"l",0,-cE.y,
            "M",cE.x+filletLen,cE.y,"l",-filletLen,0, 0,-cE.y,
            "M",cE.x,cE.y, "A",14/32,14/32,0,0,0,cN.x,cN.y,20/32,20/32,0,0,1,csb.x,csb.y,       // neck
            "M",cG.x-filletLen/2,0, "l",0,20/32,"a",filletLen/2,filletLen/2,0,0,0,filletLen,0,"l",0,-20/32,   // ridge
            "M",csa.x,csa.y, "A",20/32,20/32,0,0,1,cA.x,cA.y]);                                 // button
      };

}());