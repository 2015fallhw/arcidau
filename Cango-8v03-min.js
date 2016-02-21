var Cango,Cobj,LinearGradient,RadialGradient,DrawCmd,svgToCgoRHC,svgToCgoSVG,cgoRHCtoSVG,shapeDefs
!function(){"use strict"
function t(t,s,i){return t.attachEvent?t.attachEvent("on"+s,i):t.addEventListener(s,i,!0)}function s(t){var i,e=Array.isArray(t)?[]:{}
for(i in t)t[i]&&"object"==typeof t[i]?e[i]=s(t[i]):e[i]=t[i]
return e}function i(t){return"[object Array]"===Object.prototype.toString.call(t)}function e(t){return i(t)?t.reduce(function(t,s){var r=[].concat(s).some(i)
return t.concat(r?e(s):s)},[]):[t]}function r(t){this.type="PATH",this.drawCmds=d(t),this.dwgOrg={x:0,y:0},this.dragNdrop=null,this.iso=!1,this.border=!1,this.strokeCol=null,this.lineWidth=null,this.lineWidthWC=null,this.lineCap=null,this.shadowOffsetX=0,this.shadowOffsetY=0,this.shadowBlur=0,this.shadowColor="#000000",this.dashed=null,this.dashOffset=0}function a(t){r.call(this,t),this.type="SHAPE",this.iso=!0}function o(t){this.type="IMG","string"==typeof t?(this.drawCmds=t,this.imgBuf=new Image,this.imgBuf.src=t):t instanceof Image&&(this.imgBuf=t,this.drawCmds=t.src),this.bBoxCmds=[],this.dwgOrg={x:0,y:0},this.width=0,this.height=0,this.imgX=0,this.imgY=0,this.imgLorgX=0,this.imgLorgY=0,this.imgXscale=1,this.imgYscale=1,this.imgDegs=0,this.lorg=1,this.dragNdrop=null,this.border=!1,this.strokeCol=null,this.lineWidth=null,this.lineWidthWC=null,this.lineCap=null,this.shadowOffsetX=0,this.shadowOffsetY=0,this.shadowBlur=0,this.shadowColor="#000000"}function n(t){this.type="TEXT",this.drawCmds=t,this.bBoxCmds=[],this.dwgOrg={x:0,y:0},this.imgX=0,this.imgY=0,this.imgLorgX=0,this.imgLorgY=0,this.imgXscale=1,this.imgYscale=1,this.imgDegs=0,this.lorg=1,this.dragNdrop=null,this.border=!1,this.fillCol=null,this.fontSize=null,this.fontSizeWC=null,this.fontWeight=null,this.fontFamily=null,this.shadowOffsetX=0,this.shadowOffsetY=0,this.shadowBlur=0,this.shadowColor="#000000"}function h(t,s){this.id=t,this.cElem=s,this.dragObjects=[]}var c,d,l=0
c=function(){function t(t,s,i){return 0===i&&"string"!=typeof s&&t.push("M"),"string"==typeof s&&(f.hasOwnProperty(s.toUpperCase())||(console.log("unknown command string '"+s+"'"),t.badCmdFound=!0,t.length=0)),t.badCmdFound||t.push(s),t}function s(t,s,i,e){var r
if(0===i&&(t.nextCmdPos=0),"string"==typeof s){if(i<t.nextCmdPos)return console.log("bad number of parameters for '"+s+"' at index "+i),t.badParameter=!0,t.push(0),t
t.currCmd=s.toUpperCase(),t.uc=s.toUpperCase()===s,t.nextCmdPos=i+f[t.currCmd].parmCount+1,t.push(s)}else i<t.nextCmdPos?t.push(s):(t.currCmd=f[t.currCmd].extCmd,r=t.uc?t.currCmd:t.currCmd.toLowerCase(),t.push(r,s),t.nextCmdPos=i+f[t.currCmd].parmCount)
return i===e.length-1&&t.badParameter&&(t.length=0),t}function e(t,s){return"string"==typeof s&&t.push([]),t[t.length-1].push(s),t}function r(t,s,i){var e,r
return void 0===t.px&&(t.px=0,t.py=0),e=f[s[0].toUpperCase()],r=e.toAbs(t,s,i),t.push(r),t}function a(t,s,i){var e=s[0],r=f[e]
return r.toCangoVersion(t,s,i),t}function o(t){var s=t[0],i=t.slice(1)
return new DrawCmd(f[s].canvasMethod,i)}function n(t,s){var i,e,r=s[0]
return t.push(r),i=s.slice(1),e=i.match(/\S+/g),e&&e.forEach(function(s){var i=parseFloat(s)
isNaN(i)||t.push(i)}),t}function h(t){var s=t[0],i=f[s]
return i.invertCoords(t)}function c(t){var s=t[0],i=f[s],e=this.xOfs||0,r=this.yOfs||0
return i.addXYoffset(t,e,r)}function d(t,s){return t.concat(s)}var l=function(t,s,i,e,r,a,o,n){var h=n*r,c=-o*a,d=o*r,l=n*a,p=.5*(e-i),f=8/3*Math.sin(.5*p)*Math.sin(.5*p)/Math.sin(p),g=t+Math.cos(i)-f*Math.sin(i),u=s+Math.sin(i)+f*Math.cos(i),C=t+Math.cos(e),m=s+Math.sin(e),x=C+f*Math.sin(e),y=m-f*Math.cos(e)
return[h*g+c*u,d*g+l*u,h*x+c*y,d*x+l*y,h*C+c*m,d*C+l*m]},p=function(t,s,i,e,r,a,o,n,h){function c(t){return Math.abs(t)<1e-5?0:t}var d,p,f,g,u,C,m,x,y,v,w,b,O,W,M,k,P,X,Y,S,H,A,L=r*(Math.PI/180),T=Math.sin(L),B=Math.cos(L),E=Math.abs(i),N=Math.abs(e),I=B*(t-n)*.5+T*(s-h)*.5,j=B*(s-h)*.5-T*(t-n)*.5,D=I*I/(E*E)+j*j/(N*N),G=[]
for(D>1&&(D=Math.sqrt(D),E*=D,N*=D),d=B/E,p=T/E,f=-T/N,g=B/N,u=d*t+p*s,C=f*t+g*s,m=d*n+p*h,x=f*n+g*h,y=(m-u)*(m-u)+(x-C)*(x-C),v=1/y-.25,0>v&&(v=0),w=Math.sqrt(v),o===a&&(w=-w),b=.5*(u+m)-w*(x-C),O=.5*(C+x)+w*(m-u),W=Math.atan2(C-O,u-b),M=Math.atan2(x-O,m-b),k=M-W,0>k&&1===o?k+=2*Math.PI:k>0&&0===o&&(k-=2*Math.PI),P=Math.ceil(Math.abs(k/(.5*Math.PI+.001))),S=0;P>S;S++)H=W+S*k/P,A=W+(S+1)*k/P,X=l(b,O,H,A,E,N,T,B),Y=X.map(c),G.push(Y)
return G},f={M:{canvasMethod:"moveTo",parmCount:2,extCmd:"L",toAbs:function(t,s){var i,e=s[0].toUpperCase(),r=s[1],a=s[2]
return e!==s[0]&&(r+=t.px,a+=t.py),i=[e,r,a],t.px=r,t.py=a,i},toCangoVersion:function(t,s){var i=s[1],e=s[2]
t.px=i,t.py=e,t.push(s)},addXYoffset:function(t,s,i){var e=t[1],r=t[2]
return e+=s,r+=i,["M",e,r]},invertCoords:function(t){var s=t[1],i=t[2]
return["M",s,-i]}},L:{canvasMethod:"lineTo",parmCount:2,extCmd:"L",toAbs:function(t,s){var i,e=s[0].toUpperCase(),r=s[1],a=s[2]
return e!==s[0]&&(r+=t.px,a+=t.py),i=[e,r,a],t.px=r,t.py=a,i},toCangoVersion:function(t,s){var i=s[1],e=s[2]
t.px=i,t.py=e,t.push(s)},addXYoffset:function(t,s,i){var e=t[1],r=t[2]
return e+=s,r+=i,["L",e,r]},invertCoords:function(t){var s=t[1],i=t[2]
return["L",s,-i]}},H:{parmCount:1,extCmd:"H",toAbs:function(t,s){var i,e=s[0].toUpperCase(),r=s[1]
return e!==s[0]&&(r+=t.px),i=[e,r],t.px=r,i},toCangoVersion:function(t,s){var i=s[1],e=t.py,r=["L",i,e]
t.px=i,t.push(r)},addXYoffset:function(t,s,i){var e=t[1]
return e+=s,["H",e]},invertCoords:function(t){var s=t[1]
return["H",s]}},V:{parmCount:1,extCmd:"V",toAbs:function(t,s){var i,e=s[0].toUpperCase(),r=s[1]
return e!==s[0]&&(r+=t.py),i=[e,r],t.py=r,i},toCangoVersion:function(t,s){var i=t.px,e=s[1],r=["L",i,e]
t.py=e,t.push(r)},addXYoffset:function(t,s,i){var e=t[1]
return e+=i,["V",e]},invertCoords:function(t){var s=t[1]
return["V",-s]}},C:{canvasMethod:"bezierCurveTo",parmCount:6,extCmd:"C",toAbs:function(t,s){var i,e=s[0].toUpperCase(),r=s[1],a=s[2],o=s[3],n=s[4],h=s[5],c=s[6]
return e!==s[0]&&(r+=t.px,a+=t.py,o+=t.px,n+=t.py,h+=t.px,c+=t.py),i=[e,r,a,o,n,h,c],t.px=h,t.py=c,i},toCangoVersion:function(t,s){var i=s[5],e=s[6]
t.px=i,t.py=e,t.push(s)},addXYoffset:function(t,s,i){var e=t[1],r=t[2],a=t[3],o=t[4],n=t[5],h=t[6]
return e+=s,r+=i,a+=s,o+=i,n+=s,h+=i,["C",e,r,a,o,n,h]},invertCoords:function(t){var s=t[1],i=t[2],e=t[3],r=t[4],a=t[5],o=t[6]
return["C",s,-i,e,-r,a,-o]}},S:{parmCount:4,extCmd:"S",toAbs:function(t,s){var i,e=s[0].toUpperCase(),r=s[1],a=s[2],o=s[3],n=s[4]
return e!==s[0]&&(r+=t.px,a+=t.py,o+=t.px,n+=t.py),i=[e,r,a,o,n],t.px=o,t.py=n,i},toCangoVersion:function(t,s,i){var e,r=0,a=0,o=s[1],n=s[2],h=s[3],c=s[4],d=t[i-1]
"C"===d[0]&&(r=t.px-d[d.length-4],a=t.py-d[d.length-3]),r+=t.px,a+=t.py,e=["C",r,a,o,n,h,c],t.px=h,t.py=c,t.push(e)},addXYoffset:function(t,s,i){var e=t[1],r=t[2],a=t[3],o=t[4]
return e+=s,r+=i,a+=s,o+=i,["S",e,r,a,o]},invertCoords:function(t){var s=t[1],i=t[2],e=t[3],r=t[4]
return["S",s,-i,e,-r]}},Q:{canvasMethod:"quadraticCurveTo",parmCount:4,extCmd:"Q",toAbs:function(t,s){var i,e=s[0].toUpperCase(),r=s[1],a=s[2],o=s[3],n=s[4]
return e!==s[0]&&(r+=t.px,a+=t.py,o+=t.px,n+=t.py),i=[e,r,a,o,n],t.px=o,t.py=n,i},toCangoVersion:function(t,s){var i=s[3],e=s[4]
t.px=i,t.py=e,t.push(s)},addXYoffset:function(t,s,i){var e=t[1],r=t[2],a=t[3],o=t[4]
return e+=s,r+=i,a+=s,o+=i,["Q",e,r,a,o]},invertCoords:function(t){var s=t[1],i=t[2],e=t[3],r=t[4]
return["Q",s,-i,e,-r]}},T:{parmCount:2,extCmd:"T",toAbs:function(t,s){var i,e=s[0].toUpperCase(),r=s[1],a=s[2]
return e!==s[0]&&(r+=t.px,a+=t.py),i=[e,r,a],t.px=r,t.py=a,i},toCangoVersion:function(t,s,i){var e,r=0,a=0,o=s[1],n=s[2],h=t[i-1]
"Q"===h[0]&&(r=t.px-h[h.length-4],a=t.py-h[h.length-3]),r+=t.px,a+=t.py,e=["Q",r,a,o,n],t.px=o,t.py=n,t.push(e)},addXYoffset:function(t,s,i){var e=t[1],r=t[2]
return e+=s,r+=i,["T",e,r]},invertCoords:function(t){var s=t[1],i=t[2]
return["T",s,-i]}},A:{parmCount:7,extCmd:"A",toAbs:function(t,s){var i,e=s[0].toUpperCase(),r=s[1],a=s[2],o=s[3],n=s[4],h=s[5],c=s[6],d=s[7]
return e!==s[0]&&(c+=t.px,d+=t.py),i=[e,r,a,o,n,h,c,d],t.px=c,t.py=d,i},toCangoVersion:function(t,s){var i,e=s[1],r=s[2],a=s[3],o=s[4],n=s[5],h=s[6],c=s[7]
i=p(t.px,t.py,e,r,a,o,n,h,c),i.forEach(function(s){t.push(["C"].concat(s))}),t.px=h,t.py=c},addXYoffset:function(t,s,i){var e=t[1],r=t[2],a=t[3],o=t[4],n=t[5],h=t[6],c=t[7]
return h+=s,c+=i,["A",e,r,a,o,n,h,c]},invertCoords:function(t){var s=t[1],i=t[2],e=t[3],r=t[4],a=t[5],o=t[6],n=t[7]
return["A",s,i,-e,r,1-a,o,-n]}},Z:{canvasMethod:"closePath",parmCount:0,toAbs:function(t,s){var i=s[0].toUpperCase(),e=[i]
return e},toCangoVersion:function(t,s){t.push(s)},addXYoffset:function(t,s,i){return["Z"]},invertCoords:function(t){return["Z"]}}}
return{svg2cartesian:function(i,a,o){var l,p,f=a||0,g=o||0
return"string"!=typeof i||0===i.length?[]:(l=i.replace(RegExp(",","g")," "),p=l.split(/(?=[a-df-z])/i),p.reduce(n,[]).reduce(t,[]).reduce(s,[]).reduce(e,[]).reduce(r,[]).map(c,{xOfs:f,yOfs:g}).map(h).reduce(d,[]))},svg2cgosvg:function(i,a,o){var h,l,p=a||0,f=o||0
return"string"!=typeof i||0===i.length?[]:(h=i.replace(RegExp(",","g")," "),l=h.split(/(?=[a-df-z])/i),l.reduce(n,[]).reduce(t,[]).reduce(s,[]).reduce(e,[]).reduce(r,[]).map(c,{xOfs:p,yOfs:f}).reduce(d,[]))},cartesian2svg:function(t){return""+t.reduce(s,[]).reduce(e,[]).reduce(r,[]).map(h).reduce(d,[])},cgo2drawcmds:function(n){return i(n)&&0!==n.length?n.reduce(t,[]).reduce(s,[]).reduce(e,[]).reduce(r,[]).reduce(a,[]).map(o):[]}}}(),svgToCgoRHC=c.svg2cartesian,svgToCgoSVG=c.svg2cgosvg,cgoRHCtoSVG=c.cartesian2svg,d=c.cgo2drawcmds,void 0===shapeDefs&&(shapeDefs={circle:function(t){var s=t||1
return["m",-.5*s,0,"c",0,-.27614*s,.22386*s,-.5*s,.5*s,-.5*s,"c",.27614*s,0,.5*s,.22386*s,.5*s,.5*s,"c",0,.27614*s,-.22386*s,.5*s,-.5*s,.5*s,"c",-.27614*s,0,-.5*s,-.22386*s,-.5*s,-.5*s]},ellipse:function(t,s){var i=t||1,e=i
return"number"==typeof s&&s>0&&(e=s),["m",-.5*i,0,"c",0,-.27614*e,.22386*i,-.5*e,.5*i,-.5*e,"c",.27614*i,0,.5*i,.22386*e,.5*i,.5*e,"c",0,.27614*e,-.22386*i,.5*e,-.5*i,.5*e,"c",-.27614*i,0,-.5*i,-.22386*e,-.5*i,-.5*e]},square:function(t){var s=t||1
return["m",.5*s,-.5*s,"l",0,s,-s,0,0,-s,"z"]},rectangle:function(t,s,i){var e,r=.55228475
return void 0===i||0>=i?["m",-t/2,-s/2,"l",t,0,0,s,-t,0,"z"]:(e=Math.min(t/2,s/2,i),["m",-t/2+e,-s/2,"l",t-2*e,0,"c",r*e,0,e,(1-r)*e,e,e,"l",0,s-2*e,"c",0,r*e,(r-1)*e,e,-e,e,"l",-t+2*e,0,"c",-r*e,0,-e,(r-1)*e,-e,-e,"l",0,-s+2*e,"c",0,-r*e,(1-r)*e,-e,e,-e])},triangle:function(t){var s=t||1
return["m",.5*s,-.289*s,"l",-.5*s,.866*s,-.5*s,-.866*s,"z"]},cross:function(t){var s=t||1
return["m",-.5*s,0,"l",s,0,"m",-.5*s,-.5*s,"l",0,s]},ex:function(t){var s=t||1
return["m",-.3535*s,-.3535*s,"l",.707*s,.707*s,"m",-.707*s,0,"l",.707*s,-.707*s]},arrow:function(t,s,i,e,r,a,o){function n(t,s){return{x:t,y:s}}function h(t,s){return Math.sqrt((t.x-s.x)*(t.x-s.x)+(t.y-s.y)*(t.y-s.y))}function c(t,s){var i=Math.sin(s),e=Math.cos(s)
return{x:t.x*e-t.y*i,y:t.x*i+t.y*e}}function d(t,s,i){return{x:t.x+s,y:t.y+i}}var l,p,f,g,u,C,m,x,y,v,w,b,O,W=1,M=r||1,k=a||4,P=.5*M,X=i-t,Y=e-s,S=0,H=21*Math.PI/180,A=k*M,L=A*Math.cos(H)
return o instanceof Cango&&(W=Math.abs(o.yscl/o.xscl),Y*=W),S=Math.atan2(Y,X),l=new n(t,s*W),p=new n(i,e*W),f=h(l,p),g=new n(0,P),u=new n(f-L,P),C=new n(u.x,A*Math.sin(H)),v=new n(f,0),m=new n(C.x,-C.y),x=new n(u.x,-u.y),y=new n(g.x,-g.y),w=[g,u,C,v,m,x,y],b=w.map(function(t){var s=c(t,S),i=d(s,l.x,l.y)
return i}),O=b.reduce(function(t,s){return t.push(s.x,s.y),t},["M"]),O.splice(3,0,"L"),O.push("Z"),O},arrowArc:function(t,s,i,e,r,a,o){function n(t){for(;0>t;)t+=360
for(;t>=360;)t-=360
return parseFloat(t)}var h,c,d,l,p,f,g,u,C,m,x,y,v,w,b,O,W,M,k,P,X,Y,S=n(s),H=n(i),A=e?1:0,L=S>H?1:0,T=Math.PI/180,B=r||1,E=a||4,N=.5*B,I=t-N,j=t+N,D=.95*E*B,G=D/t,z=-1
return d=L?S-H:H-S,(L&&!A||!L&&A)&&(d=360-d),l=T*d,p=d>180?1:0,G>l&&(G=l),o instanceof Cango&&o.yscl>0?(p=1-p,z=1):A=1-A,h=z*T*H,c=z*T*S,f=A?h-z*G:h+z*G,C=t-.35*D,m=t+.35*D,b=I*Math.cos(c),O=I*Math.sin(c)*z,W=I*Math.cos(f),M=I*Math.sin(f)*z,k=j*Math.cos(c),P=j*Math.sin(c)*z,X=j*Math.cos(f),Y=j*Math.sin(f)*z,g=t*Math.cos(h),u=t*Math.sin(h)*z,x=C*Math.cos(f),y=C*Math.sin(f)*z,v=m*Math.cos(f),w=m*Math.sin(f)*z,["M",k,P,"A",j,j,0,p,A,X,Y,"L",v,w,"A",m,m,0,0,A,g,u,"A",C,C,0,0,1-A,x,y,"L",W,M,"A",I,I,0,p,1-A,b,O,"Z"]}}),LinearGradient=function(t,s,i,e){this.grad=[t,s,i,e],this.colorStops=[],this.addColorStop=function(){this.colorStops.push(arguments)}},RadialGradient=function(t,s,i,e,r,a){this.grad=[t,s,i,e,r,a],this.colorStops=[],this.addColorStop=function(){this.colorStops.push(arguments)}},DrawCmd=function(t,s){var i
for(this.drawFn=t,this.parms=[],i=0;i<s.length;i+=2)this.parms.push(s.slice(i,i+2))
this.parmsPx=[]},r.prototype.translate=function(t,s){this.drawCmds.forEach(function(i){i.parms=i.parms.map(function(i){return[i[0]+t,i[1]+s]})})},r.prototype.rotate=function(t){var s=Math.PI*t/180,i=Math.sin(s),e=Math.cos(s)
this.drawCmds.forEach(function(t){t.parms=t.parms.map(function(t){return[t[0]*e-t[1]*i,t[0]*i+t[1]*e]})})},r.prototype.scale=function(t,s){var i=t||1,e=s||i
this.drawCmds.forEach(function(t){t.parms=t.parms.map(function(t){return[t[0]*i,t[1]*e]})}),this.lineWidthWC&&(this.lineWidthWC*=i)},r.prototype.appendPath=function(t,i){var e=s(t.drawCmds)
i?this.drawCmds=this.drawCmds.concat(e.slice(1)):this.drawCmds=this.drawCmds.concat(e)},r.prototype.revWinding=function(){function t(t){return t.reduceRight(function(t,s){return t.push(s[0],s[1]),t},[])}var s,i,e,r,a,o=null,n=[]
for("closePath"===this.drawCmds[this.drawCmds.length-1].drawFn?(s=this.drawCmds.slice(0,-1),o=this.drawCmds.slice(-1)):s=this.drawCmds.slice(0),i=s.length-1,e=s[i].parms.length,a=new DrawCmd("moveTo",s[i].parms[e-1]),n.push(a),s[i].parms=s[i].parms.slice(0,-1);i>0;)r=t(s[i].parms),e=s[i-1].parms.length,r=r.concat(s[i-1].parms[e-1]),a=new DrawCmd(s[i].drawFn,r),n.push(a),s[i-1].parms=s[i-1].parms.slice(0,-1),i--
o&&n.push(o),this.drawCmds=n},a.prototype=new r,o.prototype.translate=function(t,s){this.imgX+=t,this.imgY+=s},o.prototype.rotate=function(t){this.imgDegs+=t},o.prototype.scale=function(t,s){var i=t||1,e=s||i
this.imgXscale*=i,this.imgYscale*=e,this.imgX*=i,this.imgY*=e,this.lineWidthWC&&(this.lineWidthWC*=i)},o.prototype.formatImg=function(){var t,s,i,e,r,a,o,n,h,c,d,l,p,f=0,g=0
this.imgBuf.width||console.log("in image onload handler yet image NOT loaded!"),this.width&&this.height?(t=this.width,s=this.height):this.width&&!this.height?(t=this.width,s=this.height||t*this.imgBuf.height/this.imgBuf.width):this.height&&!this.width?(s=this.height,t=this.width||s*this.imgBuf.width/this.imgBuf.height):(t=this.imgBuf.width,s=this.imgBuf.height),i=t/2,e=s/2,p=[0,[0,0],[i,0],[t,0],[0,e],[i,e],[t,e],[0,s],[i,s],[t,s]],void 0!==p[this.lorg]&&(f=-p[this.lorg][0],g=-p[this.lorg][1]),this.imgLorgX=f,this.imgLorgY=g,this.width=t,this.height=s,r=this.imgX+f,a=this.imgY+g,o=this.imgX+f,n=this.imgY+g+s,h=this.imgX+f+t,c=this.imgY+g+s,d=this.imgX+f+t,l=this.imgY+g,this.bBoxCmds[0]=new DrawCmd("moveTo",[r,-a]),this.bBoxCmds[1]=new DrawCmd("lineTo",[o,-n]),this.bBoxCmds[2]=new DrawCmd("lineTo",[h,-c]),this.bBoxCmds[3]=new DrawCmd("lineTo",[d,-l]),this.bBoxCmds[4]=new DrawCmd("closePath",[])},n.prototype.translate=function(t,s){this.imgX+=t,this.imgY+=s},n.prototype.rotate=function(t){this.imgDegs+=t},n.prototype.scale=function(t,s){var i=t||1,e=s||i
this.imgXscale*=i,this.imgYscale*=e,this.imgX*=i,this.imgY*=e},n.prototype.formatText=function(t){var s,i,e,r,a,o,n,h,c,d,l,p,f,g=this.fontSize||t.fontSize,u=this.fontFamily||t.fontFamily,C=this.fontWeight||t.fontWeight,m=this.lorg||1,x=0,y=0
this.orgXscl||(this.orgXscl=t.xscl),this.fontSizeWC=g/this.orgXscl,t.ctx.save(),t.ctx.font=C+" "+g+"px "+u,s=t.ctx.measureText(this.drawCmds).width,t.ctx.restore(),s/=this.orgXscl,i=g/this.orgXscl,e=s/2,r=i/2,a=[0,[0,i],[e,i],[s,i],[0,r],[e,r],[s,r],[0,0],[e,0],[s,0]],void 0!==a[m]&&(x=-a[m][0],y=-a[m][1]),this.imgLorgX=x,this.imgLorgY=y+.25*i,this.width=s,this.height=i,o=this.imgX+x,n=this.imgY-y,h=this.imgX+x,c=this.imgY-y-i,d=this.imgX+x+s,l=this.imgY-y-i,p=this.imgX+x+s,f=this.imgY-y,this.bBoxCmds[0]=new DrawCmd("moveTo",[o,-n]),this.bBoxCmds[1]=new DrawCmd("lineTo",[h,-c]),this.bBoxCmds[2]=new DrawCmd("lineTo",[d,-l]),this.bBoxCmds[3]=new DrawCmd("lineTo",[p,-f]),this.bBoxCmds[4]=new DrawCmd("closePath",[])},Cobj=function(t,s,i){var e,h,c,d=r
switch(s){case"PATH":d=r
break
case"SHAPE":d=a
break
case"IMG":d=o
break
case"TEXT":d=n}d.call(this,t),e=new d
for(c in e)"function"==typeof e[c]&&(this[c]=e[c])
h="object"==typeof i?i:{}
for(c in h)h.hasOwnProperty(c)&&this.setProperty(c,h[c])},Cobj.prototype.setProperty=function(t,s){if("string"==typeof t&&void 0!==s)switch(t.toLowerCase()){case"fillcolor":this.fillCol=s
break
case"strokecolor":this.strokeCol=s
break
case"linewidth":case"strokewidth":"number"==typeof s&&s>0&&(this.lineWidth=s)
break
case"linewidthwc":"number"==typeof s&&s>0&&(this.lineWidthWC=s)
break
case"linecap":if("string"!=typeof s)return;("butt"===s||"round"===s||"square"===s)&&(this.lineCap=s)
break
case"iso":case"isotropic":1==s||"iso"===s||"isotropic"===s?this.iso=!0:this.iso=!1
break
case"dashed":i(s)&&s[0]?this.dashed=s:this.dashed=null
break
case"dashoffset":this.dashOffset=s||0
break
case"border":1==s&&(this.border=!0),0==s&&(this.border=!1)
break
case"fontsize":"number"==typeof s&&s>0&&(this.fontSize=s)
break
case"fontweight":("string"==typeof s||"number"==typeof s&&s>=100&&900>=s)&&(this.fontWeight=s)
break
case"fontfamily":"string"==typeof s&&(this.fontFamily=s)
break
case"imgwidth":this.width=Math.abs(s)
break
case"imgheight":this.height=Math.abs(s)
break
case"lorg":[1,2,3,4,5,6,7,8,9].indexOf(s)>-1&&(this.lorg=s)
break
case"shadowoffsetx":this.shadowOffsetX=s||0
break
case"shadowoffsety":this.shadowOffsetY=s||0
break
case"shadowblur":this.shadowBlur=s||0
break
case"shadowcolor":this.shadowColor=s
break
default:return}},Cobj.prototype.dup=function(){var t=new Cobj
return t.type=this.type,t.drawCmds=s(this.drawCmds),t.imgBuf=this.imgBuf,t.bBoxCmds=s(this.bBoxCmds),t.dwgOrg=s(this.dwgOrg),t.iso=this.iso,t.border=this.border,t.strokeCol=this.strokeCol,t.fillCol=this.fillCol,t.lineWidth=this.lineWidth,t.lineWidthWC=this.lineWidthWC,t.lineCap=this.lineCap,t.width=this.width,t.height=this.height,t.imgX=this.imgX,t.imgY=this.imgY,t.imgLorgX=this.imgLorgX,t.imgLorgY=this.imgLorgY,t.imgXscale=this.imgXscale,t.imgYscale=this.imgYscale,t.imgDegs=this.imgDegs,t.lorg=this.lorg,t.dragNdrop=null,t.fontSize=this.fontSize,t.fontWeight=this.fontWeight,t.fontFamily=this.fontFamily,t.shadowOffsetX=this.shadowOffsetX,t.shadowOffsetY=this.shadowOffsetY,t.shadowBlur=this.shadowBlur,t.shadowColor=this.shadowColor,t.dashed=this.dashed,t.dashOffset=this.dashOffset,t},Cango=function(s){function i(){var t,s,i=a.bkgCanvas.offsetTop+a.bkgCanvas.clientTop,e=a.bkgCanvas.offsetLeft+a.bkgCanvas.clientLeft,r=a.bkgCanvas.offsetWidth,o=a.bkgCanvas.offsetHeight
if(a.bkgCanvas.timeline&&a.bkgCanvas.timeline.animTasks.length&&a.deleteAllAnimations(),a.rawWidth=r,a.rawHeight=o,a.aRatio=r/o,a.bkgCanvas===a.cnvs)for(a.cnvs.setAttribute("width",r),a.cnvs.setAttribute("height",o),a.buffered&&(a.cnvs.buf.setAttribute("width",r),a.cnvs.buf.setAttribute("height",o)),t=1;t<a.bkgCanvas.layers.length;t++)s=a.bkgCanvas.layers[t].cElem,s&&(s.style.top=i+"px",s.style.left=e+"px",s.style.width=r+"px",s.style.height=o+"px",s.setAttribute("width",r),s.setAttribute("height",o),s.buf&&(s.buf.setAttribute("width",r),s.buf.setAttribute("height",o)))}var e,r,a=this
return this.cId=s,this.cnvs=document.getElementById(s),null===this.cnvs?void alert("can't find canvas "+s):(this.bkgCanvas=this.cnvs,-1!==s.indexOf("_ovl_")&&(e=s.slice(0,s.indexOf("_ovl_")),this.bkgCanvas=document.getElementById(e)),this.rawWidth=this.cnvs.offsetWidth,this.rawHeight=this.cnvs.offsetHeight,this.aRatio=this.rawWidth/this.rawHeight,this.widthPW=100,this.heightPW=this.widthPW/this.aRatio,this.bkgCanvas.hasOwnProperty("layers")||(this.bkgCanvas.layers=[],r=new h(this.cId,this.cnvs),this.bkgCanvas.layers[0]=r,t(this.bkgCanvas,"resize",i)),"undefined"==typeof CgoTimeline||this.bkgCanvas.hasOwnProperty("timeline")||(this.bkgCanvas.timeline=new CgoTimeline),this.cnvs.hasOwnProperty("resized")||(this.cnvs.setAttribute("width",this.rawWidth),this.cnvs.setAttribute("height",this.rawHeight),this.cnvs.resized=!0),this.buffered&&!this.cnvs.buf&&(this.cnvs.buf=document.createElement("canvas"),this.cnvs.buf.setAttribute("width",this.rawWidth),this.cnvs.buf.setAttribute("height",this.rawHeight),this.bufCtx=this.cnvs.buf.getContext("2d")),this.ctx=this.cnvs.getContext("2d"),this.yDown=!1,this.vpW=this.rawWidth,this.vpH=this.rawHeight,this.vpOrgX=0,this.vpOrgY=this.rawHeight,this.xscl=1,this.yscl=-1,this.xoffset=0,this.yoffset=0,this.savWC={xscl:this.xscl,yscl:this.yscl,xoffset:this.xoffset,yoffset:this.yoffset},this.ctx.textAlign="left",this.ctx.textBaseline="alphabetic",this.penCol="rgba(0, 0, 0, 1.0)",this.penWid=1,this.lineCap="butt",this.paintCol="rgba(128,128,128,1.0)",this.fontSize=12,this.fontWeight=400,this.fontFamily="Consolas, Monaco, 'Andale Mono', monospace",this.clipCount=0,this.getUnique=function(){return l+=1},void this.initModules())},Cango.prototype.initModules=function(){},Cango.prototype.getHostLayer=function(){var t,s=this.bkgCanvas.layers[0]
for(t=1;t<this.bkgCanvas.layers.length;t++)if(this.bkgCanvas.layers[t].id===this.cId){s=this.bkgCanvas.layers[t]
break}return s},Cango.prototype.toPixelCoords=function(t,s){var i=this.vpOrgX+this.xoffset+t*this.xscl,e=this.vpOrgY+this.yoffset+s*this.yscl
return{x:i,y:e}},Cango.prototype.toWorldCoords=function(t,s){var i=(t-this.vpOrgX-this.xoffset)/this.xscl,e=(s-this.vpOrgY-this.yoffset)/this.yscl
return{x:i,y:e}},Cango.prototype.getCursorPosWC=function(t){var s=t||window.event,i=this.cnvs.getBoundingClientRect(),e=(s.clientX-i.left-this.vpOrgX-this.xoffset)/this.xscl,r=(s.clientY-i.top-this.vpOrgY-this.yoffset)/this.yscl
return{x:e,y:r}},Cango.prototype.clearCanvas=function(t){function s(t){var s=r.toPixelCoords(t.grad[0],t.grad[1]),i=r.toPixelCoords(t.grad[2],t.grad[3]),e=r.ctx.createLinearGradient(s.x,s.y,i.x,i.y)
return t.colorStops.forEach(function(t){e.addColorStop(t[0],t[1])}),e}function i(t){var s=r.toPixelCoords(t.grad[0],t.grad[1]),i=t.grad[2]*r.xscl,e=r.toPixelCoords(t.grad[3],t.grad[4]),a=t.grad[5]*r.xscl,o=r.ctx.createRadialGradient(s.x,s.y,i,e.x,e.y,a)
return t.colorStops.forEach(function(t){o.addColorStop(t[0],t[1])}),o}var e,r=this
t?(this.ctx.save(),t instanceof LinearGradient?this.ctx.fillStyle=s(t):t instanceof RadialGradient?this.ctx.fillStyle=i(t):this.ctx.fillStyle=t,this.ctx.fillRect(0,0,this.rawWidth,this.rawHeight),this.ctx.restore()):this.ctx.clearRect(0,0,this.rawWidth,this.rawHeight),e=this.getHostLayer(),e.dragObjects.length=0,this.cnvs.alphaOvl&&this.cnvs.alphaOvl.parentNode&&this.cnvs.alphaOvl.parentNode.removeChild(this.cnvs.alphaOvl)},Cango.prototype.setGridboxRHC=function(t,s,i,e){e&&i&&e>0&&i>0?(this.vpW=i*this.rawWidth/100,this.vpH=e*this.rawWidth/100,this.vpOrgX=t*this.rawWidth/100,this.vpOrgY=this.rawHeight-s*this.rawWidth/100):(this.vpW=this.rawWidth,this.vpH=this.rawHeight,this.vpOrgX=0,this.vpOrgY=this.rawHeight),this.yDown=!1,this.setWorldCoords()},Cango.prototype.setGridboxSVG=function(t,s,i,e){e&&i&&e>0&&i>0?(this.vpW=i*this.rawWidth/100,this.vpH=e*this.rawWidth/100,this.vpOrgX=t*this.rawWidth/100,this.vpOrgY=(this.heightPW-s)*this.rawWidth/100):(this.vpW=this.rawWidth,this.vpH=this.rawHeight,this.vpOrgX=0,this.vpOrgY=0),this.yDown=!0,this.setWorldCoords()},Cango.prototype.fillGridbox=function(t){function s(t){var s=e.toPixelCoords(t.grad[0],t.grad[1]),i=e.toPixelCoords(t.grad[2],t.grad[3]),r=e.ctx.createLinearGradient(s.x,s.y,i.x,i.y)
return t.colorStops.forEach(function(t){r.addColorStop(t[0],t[1])}),r}function i(t){var s=e.toPixelCoords(t.grad[0],t.grad[1]),i=t.grad[2]*e.xscl,r=e.toPixelCoords(t.grad[3],t.grad[4]),a=t.grad[5]*e.xscl,o=e.ctx.createRadialGradient(s.x,s.y,i,r.x,r.y,a)
return t.colorStops.forEach(function(t){o.addColorStop(t[0],t[1])}),o}var e=this,r=t||this.paintCol,a=this.yscl>0?this.vpOrgY:this.vpOrgY-this.vpH
this.ctx.save(),r instanceof LinearGradient?this.ctx.fillStyle=s(r):r instanceof RadialGradient?this.ctx.fillStyle=i(r):this.ctx.fillStyle=r,this.ctx.fillRect(this.vpOrgX,a,this.vpW,this.vpH),this.ctx.restore()},Cango.prototype.setWorldCoords=function(t,s,i,e){var r=t||0,a=s||0
i&&i>0?this.xscl=this.vpW/i:this.xscl=1,e&&e>0?this.yscl=this.yDown?this.vpH/e:-this.vpH/e:this.yscl=this.yDown?this.xscl:-this.xscl,this.xoffset=-r*this.xscl,this.yoffset=-a*this.yscl,this.savWC={xscl:this.xscl,yscl:this.yscl,xoffset:this.xoffset,yoffset:this.yoffset}},Cango.prototype.setPropertyDefault=function(t,s){if("string"==typeof t&&void 0!==s&&null!==s)switch(t.toLowerCase()){case"fillcolor":("string"==typeof s||"object"==typeof s)&&(this.paintCol=s)
break
case"strokecolor":("string"==typeof s||"object"==typeof s)&&(this.penCol=s)
break
case"linewidth":case"strokewidth":this.penWid=s
break
case"linecap":"string"!=typeof s||"butt"!==s&&"round"!==s&&"square"!==s||(this.lineCap=s)
break
case"fontfamily":"string"==typeof s&&(this.fontFamily=s)
break
case"fontsize":this.fontSize=s
break
case"fontweight":("string"==typeof s||s>=100&&900>=s)&&(this.fontWeight=s)
break
case"steptime":s>=15&&500>=s&&(this.stepTime=s)
break
default:return}},Cango.prototype.dropShadow=function(t){var s=t.shadowOffsetX||0,i=t.shadowOffsetY||0,e=t.shadowBlur||0,r=t.shadowColor||"#000000",a=1,o=1
void 0!==this.ctx.shadowOffsetX&&("SHAPE"===t.type||"PATH"===t.type&&!t.iso?(a*=this.xscl,o*=this.yscl):(a*=this.xscl,o*=-this.xscl),this.ctx.shadowOffsetX=s*a,this.ctx.shadowOffsetY=i*o,this.ctx.shadowBlur=e*a,this.ctx.shadowColor=r)},Cango.prototype.render=function(s,r,a,o,n){function h(s){function i(){s.formatImg(),c.paintImg(s,r,a,o,n)}return"object"==typeof s&&s instanceof Cobj?void("IMG"===s.type?s.imgBuf.complete?i():t(s.imgBuf,"load",i):"TEXT"===s.type?(s.formatText(c),c.paintText(s,r,a,o,n)):c.paintPath(s,r,a,o,n)):void console.warn("Cango.render: object not instanceof of Cobj")}var c=this
i(s)?e(s).forEach(h):s&&h(s)},Cango.prototype.paintImg=function(t,s,i,e,r){function a(t){return[t[0]*h-t[1]*n,t[0]*n+t[1]*h]}var o,n,h,c,d,l=this,p=t.imgBuf,f=s||0,g=i||0,u=e||1,C=u*t.imgXscale,m=r||0
this.ctx.save(),this.dropShadow(t),this.ctx.translate(this.vpOrgX+this.xoffset+f*this.xscl,this.vpOrgY+this.yoffset+g*this.yscl),m+=t.imgDegs,m&&(o=this.yscl>0?-m*Math.PI/180:m*Math.PI/180,n=Math.sin(o),h=Math.cos(o),this.ctx.rotate(-o)),this.ctx.drawImage(p,this.xscl*C*(t.imgX+t.imgLorgX),this.xscl*C*(t.imgY+t.imgLorgY),this.xscl*C*t.width,this.xscl*C*t.height),this.ctx.restore(),t.bBoxCmds.forEach(function(t){var s,i
t.parms.length&&(s=m?a(t.parms[0]):[t.parms[0][0],t.parms[0][1]],s[0]*=C*l.xscl,s[1]*=-C*l.xscl,i=l.toPixelCoords(f,g),t.parmsPx[0]=s[0]+i.x,t.parmsPx[1]=s[1]+i.y)}),t.border&&(this.ctx.save(),this.ctx.beginPath(),t.bBoxCmds.forEach(function(t){l.ctx[t.drawFn].apply(l.ctx,t.parmsPx)}),t.lineWidthWC?this.ctx.lineWidth=t.lineWidthWC*C*this.xscl:this.ctx.lineWidth=t.lineWidth||this.penWid,this.ctx.strokeStyle=t.strokeCol||this.penCol,this.ctx.lineCap=t.lineCap||this.lineCap,this.ctx.stroke(),this.ctx.restore()),t.dwgOrg.x=f,t.dwgOrg.y=g,null!==t.dragNdrop&&(c=this.getHostLayer(),c!==t.dragNdrop.layer&&t.dragNdrop.layer&&(d=t.dragNdrop.layer.dragObjects.indexOf(this),-1!==d&&t.dragNdrop.layer.dragObjects.splice(d,1)),t.dragNdrop.cgo=this,t.dragNdrop.layer=c,-1===t.dragNdrop.layer.dragObjects.indexOf(t)&&t.dragNdrop.layer.dragObjects.push(t))},Cango.prototype.paintPath=function(t,s,i,e,r){function a(t,s){var i,e=t.grad[0],r=t.grad[1],a=t.grad[2],o=t.grad[3],n=C.xscl,h=C.yscl
return s&&(h=C.yscl>0?C.xscl:-C.xscl),i=C.ctx.createLinearGradient(n*e,h*r,n*a,h*o),t.colorStops.forEach(function(t){i.addColorStop(t[0],t[1])}),i}function o(t,s){var i,e=t.grad[0],r=t.grad[1],a=t.grad[2],o=t.grad[3],n=t.grad[4],h=t.grad[5],c=C.xscl,d=C.yscl
return s&&(d=C.yscl>0?C.xscl:-C.xscl),i=C.ctx.createRadialGradient(c*e,d*r,c*a,c*o,d*n,c*h),t.colorStops.forEach(function(t){i.addColorStop(t[0],t[1])}),i}function n(t){return[t[0]*d-t[1]*c,t[0]*c+t[1]*d]}var h,c,d,l,p,f,g,u,C=this,m=s||0,x=i||0,y=e||1,v=r||0,w=this.vpOrgX+this.xoffset+m*this.xscl,b=this.vpOrgY+this.yoffset+x*this.yscl,O=this.xscl,W=this.yscl
t.iso&&(W=this.yscl>0?this.xscl:-this.xscl),v&&(h=this.yscl>0?-v*Math.PI/180:v*Math.PI/180,c=Math.sin(h),d=Math.cos(h)),this.ctx.save(),this.dropShadow(t),this.ctx.translate(w,b),this.ctx.beginPath(),t.drawCmds.forEach(function(t){t.parmsPx=[],t.parms.forEach(function(s){var i
i=v?n(s):[s[0],s[1]],i[0]*=y*O,i[1]*=y*W,t.parmsPx.push(i[0],i[1])}),C.ctx[t.drawFn].apply(C.ctx,t.parmsPx)}),"SHAPE"===t.type&&(p=t.fillCol||this.paintCol,p instanceof LinearGradient?(f=a(p,t.iso),this.ctx.fillStyle=f):p instanceof RadialGradient?(f=o(p,t.iso),this.ctx.fillStyle=f):this.ctx.fillStyle=p,this.ctx.fill(),this.ctx.shadowOffsetX=0,this.ctx.shadowOffsetY=0,this.ctx.shadowBlur=0),("PATH"===t.type||t.border)&&(t.dashed&&(this.ctx.setLineDash(t.dashed),this.ctx.lineDashOffset=t.dashOffset),t.lineWidthWC?this.ctx.lineWidth=t.lineWidthWC*y*this.xscl:this.ctx.lineWidth=t.lineWidth||this.penWid,this.ctx.strokeStyle=t.strokeCol||this.penCol,this.ctx.lineCap=t.lineCap||this.lineCap,this.ctx.stroke()),this.ctx.restore(),t.drawCmds.forEach(function(t){for(l=0;l<t.parms.length;l++)t.parmsPx[2*l]=t.parmsPx[2*l]*y+w,t.parmsPx[2*l+1]=t.parmsPx[2*l+1]*y+b}),t.dwgOrg.x=m,t.dwgOrg.y=x,null!==t.dragNdrop&&(g=this.getHostLayer(),g!==t.dragNdrop.layer&&t.dragNdrop.layer&&(u=t.dragNdrop.layer.dragObjects.indexOf(this),-1!==u&&t.dragNdrop.layer.dragObjects.splice(u,1)),t.dragNdrop.cgo=this,t.dragNdrop.layer=g,-1===t.dragNdrop.layer.dragObjects.indexOf(t)&&t.dragNdrop.layer.dragObjects.push(t))},Cango.prototype.paintText=function(t,s,i,e,r){function a(t){return[t[0]*n-t[1]*o,t[0]*o+t[1]*n]}var o,n,h,c,d,l,p,f=this,g=0,u=s||0,C=i||0,m=e||1,x=m*t.imgXscale,y=r||0
this.ctx.save(),this.dropShadow(t),this.ctx.translate(this.vpOrgX+this.xoffset+u*this.xscl,this.vpOrgY+this.yoffset+C*this.yscl),y+=t.imgDegs,y&&(g=this.yscl>0?-y*Math.PI/180:y*Math.PI/180,o=Math.sin(g),n=Math.cos(g),this.ctx.rotate(-g)),c=this.xscl*x*t.fontSizeWC,d=t.fontFamily||this.fontFamily,h=t.fontWeight||this.fontWeight,this.ctx.font=h+" "+c+"px "+d,this.ctx.fillStyle=t.fillCol||this.paintCol,this.ctx.fillText(t.drawCmds,this.xscl*x*(t.imgX+t.imgLorgX),-this.xscl*x*(t.imgY+t.imgLorgY)),t.border&&(this.ctx.shadowOffsetX=0,this.ctx.shadowOffsetY=0,this.ctx.shadowBlur=0,t.lineWidthWC?this.ctx.lineWidth=t.lineWidthWC*this.xscl:this.ctx.lineWidth=t.lineWidth||this.penWid,this.ctx.strokeStyle=t.strokeCol||this.penCol,this.ctx.lineCap=t.lineCap||this.lineCap,this.ctx.strokeText(t.drawCmds,this.xscl*x*(t.imgX+t.imgLorgX),-this.xscl*x*(t.imgY+t.imgLorgY))),this.ctx.restore(),t.bBoxCmds.forEach(function(t){var s,i
t.parms.length&&(s=y?a(t.parms[0]):[t.parms[0][0],t.parms[0][1]],s[0]*=x*f.xscl,s[1]*=-x*f.xscl,i=f.toPixelCoords(u,C),t.parmsPx[0]=s[0]+i.x,t.parmsPx[1]=s[1]+i.y)}),t.dwgOrg.x=u,t.dwgOrg.y=C,null!==t.dragNdrop&&(l=this.getHostLayer(),l!==t.dragNdrop.layer&&t.dragNdrop.layer&&(p=t.dragNdrop.layer.dragObjects.indexOf(this),-1!==p&&t.dragNdrop.layer.dragObjects.splice(p,1)),t.dragNdrop.cgo=this,t.dragNdrop.layer=l,-1===t.dragNdrop.layer.dragObjects.indexOf(t)&&t.dragNdrop.layer.dragObjects.push(t))},Cango.prototype.drawPath=function(t,s,i,e){var r=new Cobj(t,"PATH",e)
return this.render(r,s,i),r},Cango.prototype.drawShape=function(t,s,i,e){var r=new Cobj(t,"SHAPE",e)
return this.render(r,s,i),r},Cango.prototype.drawText=function(t,s,i,e){var r=new Cobj(t,"TEXT",e)
return this.render(r,s,i),r},Cango.prototype.drawImg=function(t,s,i,e){var r=new Cobj(t,"IMG",e)
return this.render(r,s,i),r},Cango.prototype.clipPath=function(t,s,i,e,r){function a(t){return[t[0]*h-t[1]*n,t[0]*n+t[1]*h]}var o,n,h,c=this,d=s||0,l=i||0,p=e||1,f=r||0,g=this.vpOrgX+this.xoffset+d*this.xscl,u=this.vpOrgY+this.yoffset+l*this.yscl,C=this.xscl,m=this.yscl
"IMG"!==t.type&&"TEXT"!==t.type&&(t.iso&&(m=this.yscl>0?this.xscl:-this.xscl),f&&(o=this.yscl>0?-f*Math.PI/180:f*Math.PI/180,n=Math.sin(o),h=Math.cos(o)),this.ctx.save(),this.ctx.beginPath(),t.drawCmds.forEach(function(t){t.parmsPx=[],t.parms.forEach(function(s){var i
i=f?a(s):[s[0],s[1]],i[0]=g+C*p*i[0],i[1]=u+m*p*i[1],t.parmsPx.push(i[0],i[1])}),c.ctx[t.drawFn].apply(c.ctx,t.parmsPx)}),this.ctx.clip(),this.clipCount++)},Cango.prototype.resetClip=function(){for(;this.clipCount>0;)this.ctx.restore(),this.clipCount--},Cango.prototype.createLayer=function(){var t,s,i,e,r,a,o=this.rawWidth,n=this.rawHeight,c=this.bkgCanvas.layers.length
return-1!==this.cId.indexOf("_ovl_")?(console.log("canvas layers can't create layers"),""):(i=this.getUnique(),e=this.cId+"_ovl_"+i,t="<canvas id='"+e+"' style='position:absolute' width='"+o+"' height='"+n+"'></canvas>",a=this.bkgCanvas.layers[c-1].cElem,a.insertAdjacentHTML("afterend",t),s=document.getElementById(e),s.style.backgroundColor="transparent",s.style.left=this.bkgCanvas.offsetLeft+this.bkgCanvas.clientLeft+"px",s.style.top=this.bkgCanvas.offsetTop+this.bkgCanvas.clientTop+"px",s.style.width=this.bkgCanvas.offsetWidth+"px",s.style.height=this.bkgCanvas.offsetHeight+"px",r=new h(e,s),this.bkgCanvas.layers.push(r),e)},Cango.prototype.deleteLayer=function(t){var s,i
for(i=1;i<this.bkgCanvas.layers.length;i++)this.bkgCanvas.layers[i].id===t&&(s=this.bkgCanvas.layers[i].cElem,s&&(s.alphaOvl&&s.alphaOvl.parentNode&&s.alphaOvl.parentNode.removeChild(s.alphaOvl),s.parentNode.removeChild(s)),this.bkgCanvas.layers.splice(i,1))},Cango.prototype.deleteAllLayers=function(){var t,s
for(t=this.bkgCanvas.layers.length-1;t>0;t--)s=this.bkgCanvas.layers[t].cElem,s&&(s.alphaOvl&&s.alphaOvl.parentNode&&s.alphaOvl.parentNode.removeChild(s.alphaOvl),s.parentNode.removeChild(s)),this.bkgCanvas.layers.splice(t,1)},Cango.prototype.dupCtx=function(t){this.vpW=t.vpW,this.vpH=t.vpH,this.vpOrgX=t.vpOrgX,this.vpOrgY=t.vpOrgY,this.xscl=t.xscl,this.yscl=t.yscl,this.xoffset=t.xoffset,this.yoffset=t.yoffset,this.savWC=s(t.savWC),this.penCol=t.penCol.slice(0),this.penWid=t.penWid,this.lineCap=t.lineCap.slice(0),this.paintCol=t.paintCol.slice(0),this.fontFamily=t.fontFamily.slice(0),this.fontSize=t.fontSize,this.fontWeight=t.fontWeight},Cango.prototype.toImgObj=function(t){var s,i,e,r,a,o,n,h,c,d,l,p,f=this.xscl,g=this.yscl,u=new Cobj("","IMG")
if("PATH"!==t.type&&"SHAPE"!==t.type)return null
for(t.iso&&(g=this.yscl>0?this.xscl:-this.xscl),r=i=t.drawCmds[0].parms[0][0],e=s=t.drawCmds[0].parms[0][1],l=1;l<t.drawCmds.length;l++)for(p=0;p<t.drawCmds[l].parms.length;p++)t.drawCmds[l].parms[p][0]>i&&(i=t.drawCmds[l].parms[p][0]),t.drawCmds[l].parms[p][0]<r&&(r=t.drawCmds[l].parms[p][0]),t.drawCmds[l].parms[p][1]>s&&(s=t.drawCmds[l].parms[p][1]),t.drawCmds[l].parms[p][1]<e&&(e=t.drawCmds[l].parms[p][1])
return a=r*f-2,o=this.yscl>0?e*g-2:e*g+2,n=(i-r)*f+4,h=this.yscl>0?(s-e)*g+4:(e-s)*g+4,c=document.createElement("canvas"),c.setAttribute("width",n),c.setAttribute("height",h),d=new Cango(this.cId),d.dupCtx(this),d.cnvs=c,d.cId="_sprite_",d.ctx=d.cnvs.getContext("2d"),d.rawWidth=n,d.rawHeight=h,d.vpW=d.rawWidth,d.vpH=d.rawHeight,d.vpOrgX=0,d.vpOrgY=this.yscl>0?0:d.rawHeight,d.xoffset=-a,d.yoffset=-o,this.paintPath.call(d,t),u.imgXscale=1/this.xscl,u.imgBuf.src=d.cnvs.toDataURL(),u}}()