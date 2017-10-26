/*===================================================================
  Filename: katex-render-tags.js

  Description: Patch to workaround KaTeX lack of support for \tag
  mofified version of fiddle: https://jsfiddle.net/p9du5Lgq/5/
  ref: https://github.com/Khan/KaTeX/issues/663

  Date    Description                                            |By
  -------------------------------------------------------------------
  02Sep17 First release                                           ARC
 ====================================================================*/

/*==============================================
  Usage: 
  1. Include the following style objects

  .katex-display {
    text-align: left;
    margin-left: 4em; 
    position: relative;
  }

  .katex-display .katex .eqno {
    display: inline-block;
    position: absolute;
    left: 0;
    width: 450px;
    text-align: right;
  }

  2. Replace the $$ surrounding equations containg 
     a \tag{eqn number} with a div class="tagged" as follows

  <div class="tagged">
    F(x) = \frac{R P_{atm} A c}{x}  \tag{1}
  </div>

  3. On page load call rendering as follows

  renderTaggedEqns();
================================================*/

  function renderTaggedEqns()
  {
    // render all the tagged equations separately to get the tag working
    var tex = document.querySelectorAll('div.tagged');
    for (var i = 0; i < tex.length; ++i) {
      katex.render(tex[i].textContent, tex[i], {
        displayMode: true,
        macros: {
          '\\tag': '\\pod\\text'
        }
      });
    }
    
    var eqno = document.querySelectorAll(".katex span > span.mspace.quad");

    for (var i = 0; i < eqno.length; ++i) {
      if (eqno[i].parentNode.className)
        continue;
      var quad = eqno[i];
      var span = quad.parentNode;
      var text = span.nextSibling;
      var pare = text.nextSibling;
      span.appendChild(text);
      span.appendChild(pare);
      span.className = 'eqno';
    }
  }
