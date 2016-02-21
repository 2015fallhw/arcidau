/*==================================================================
  Filename: calendarUtils-22.js
  By: A.R.Collins

  Calendar generation Support Utilities based on Wikipedia formulae.

  Kindly give credit to Dr A R Collins <http://www.arc.id.au/>
  Report bugs to tony at arc.id.au

  Date   |Description                                           |By
  ------------------------------------------------------------------
  05Nov07 First Release                                          arc
  06Nov07 DOW now take JulianDay as input                        arc
  28Nov07 bugfix: monthId is class not ID,
          re-wrote genTableSkeleton to remove document.write     arc
  30Nov07 Use associative array to hold country's lastJulianDate arc
  30Nov07 First Object Oriented version                          arc
  01Dec07 Add firstDayInMonth method                             arc
  04Dec07 Add support for highlighting selected date             arc
  05Dec07 First version with multi-country JD conversion         arc
  08Dec07 Use more meaningful function names                     arc
  27Sep09 Major appearance cahnges for zazz style                arc
  09May15 Removed depracated atributes                           arc
  ==================================================================*/
  'use strict';

  /* given the Julian calendar year, month(0..11), day(1..31)
   * this function returns the Julian day number.
   */
  function julianDate2JD(jY, jM, jD)
  {
    var a = Math.floor((13-jM)/12),
        y = jY + 4800 - a,
        m = jM + 12*a - 2;

    return (jD + Math.floor((153*m+2)/5) + 365*y + Math.floor(y/4) - 32083);
  }

  /* Global variables for calendar calulations */
  var months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var infoCountries = ['Britain', 'Italy', 'France', 'Russia', 'Bulgaria',
                       'Denmark', 'Sweden', 'Hungary', 'Prussia'];
  var infoLabels = ['Britain, USA', 'Italy, Poland, Portugal, Spain', 'France',
                    'Russia', 'Bulgaria', 'Denmark', 'Sweden', 'Hungary', 'Prussia'];

  /* Britain, USA, Ireland  2 Sep 1752 was followed by 14 Sep 1752  */
  var lastJulianDate = {'Britain':{year:1752, month:8, day:2, lastJd:julianDate2JD(1752, 8, 2)},
                        'USA':{year:1752, month:8, day:2, lastJd:julianDate2JD(1752, 8, 2)},
                        /* Italy, Poland, Portugal, Spain  4 Oct 1582 was followed by 15 Oct 1582  */
                        'Italy': {year:1582, month:9, day:4, lastJd:julianDate2JD(1582, 9, 4)},
                        'Poland': {year:1582, month:9, day:4, lastJd:julianDate2JD(1582, 9, 4)},
                        'Portugal': {year:1582, month:9, day:4, lastJd:julianDate2JD(1582, 9, 4)},
                        'Spain': {year:1582, month:9, day:4, lastJd:julianDate2JD(1582, 9, 4)},
                        /* France  9 Dec 1582 was followed by 20 Dec 1582  */
                        'France': {year:1582, month:11, day:9, lastJd:julianDate2JD(1582, 11, 9)},
                        /* Russia  31 Jan 1918 was followed by 14 Feb 1918  */
                        'Russia': {year:1918, month:0, day:31, lastJd:julianDate2JD(1918, 0, 31)},
                        /* Bulgaria  31 Mar 1916 was followed by 14 Apr 1916  */
                        'Bulgaria': {year:1916, month:2, day:31, lastJd:julianDate2JD(1916, 2, 31)},
                        /* Denmark 18 Feb 1700 was followed by  1 Mar 1700  */
                        'Denmark': {year:1700, month:1, day:18, lastJd:julianDate2JD(1700, 1, 18)},
                        /* Sweden 17 Feb 1753 was followed by  1 Mar 1753  */
                        'Sweden': {year:1753, month:1, day:17, lastJd:julianDate2JD(1753, 1, 17)},
                        /* Hungary  21 Oct 1587 was followed by  1 Nov 1587  */
                        'Hungary': {year:1587, month:9, day:21, lastJd:julianDate2JD(1587, 9, 21)},
                        /* Prussia  22 Aug 1610 was followed by  2 Sep 1610  */
                        'Prussia': {year:1610, month:7, day:22, lastJd:julianDate2JD(1610, 7, 22)}};
  /* end of globals */


  /* Calendar support functions */

  /* given the Gregorian calendar year, month(0..11), day(1..31)
   * this function returns the Julian day number.
   * The Julian days count from Julian day 0 = Monday, 1 Jan 4713 BC
   */
  function gregorianDate2JD(gY, gM, gD)
  {
    var a = Math.floor((13-gM)/12),
        y = gY + 4800 - a,
        m = gM + 12*a - 2;

    return (gD + Math.floor((153*m+2)/5) + 365*y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045);
  }

  /* given the Julian Day number
   * this function returns the day of the week.
   * DOW from julian day is JulianDay %7 giving Monday = 0
   * This function returns Sunday = 0 (the JavaScript standard)
   */
  function dayOfWeek(jd)
  {
    var dow = 1 + (jd % 7);

    if (dow === 7)
    {
      dow = 0;
    }
    return dow;
  }

  /* given the Julian Day number
   * this function returns the year, month, day.
   * The result is dependent on the date the Julian calendar
   * was dropped and Gregorian calendar was adopted.
   * Based on code from www.astron.nl/~foley/JulianDate.html
   */
  function jd2Date(jd, j2gLastJulianDay)
  {
  	var	j1, j2, j3, j4, j5,
        tmp, d, m, y;

  	if(jd > j2gLastJulianDay)   // adjust the jd to allow for Gregorian calendar correction
    {
  		tmp = Math.floor(((jd - 1867216) - 0.25)/36524.25);
  		j1 = jd + 1 + tmp - Math.floor(0.25*tmp);
  	}
    else
    {
  		j1 = jd;
    }

  	j2 = j1 + 1524;
  	j3 = Math.floor(6680.0 + ((j2 - 2439870) - 122.1)/365.25);
  	j4 = Math.floor(j3*365.25);
  	j5 = Math.floor((j2 - j4)/30.6001);

  	d = Math.floor(j2 - j4 - Math.floor(j5*30.6001));
  	m = Math.floor(j5 - 1);
  	if (m > 12)
    {
      m -= 12;
    }
  	y = Math.floor(j3 - 4715);
  	if (m > 2)
    {
      y--;
    }
    m--;    // count months 0..11
  	if (y <= 0)
    {
      y--;
    }

    return [y, m, d];
  }

  /* End of Calendar Support functions */


  /* Calendar object stuff */
  function Calendar(calBodyId, equBodyId, jdCellId, gregDate, country, minYr, maxYr)
  {
    this.calNode = document.getElementById(calBodyId);
    this.equNode = document.getElementById(equBodyId);
    this.jdCellNode = document.getElementById(jdCellId);
    this.currYear = gregDate.getFullYear();
    this.currJulianDay = gregorianDate2JD(gregDate.getFullYear(), gregDate.getMonth(), gregDate.getDate());
    this.currNode = null;   // the DOM anchor node holding current date (currJulianDay)
    this.j2gYear = null;
    this.j2gMonth = null;
    this.j2gDay = null;
    this.j2gLastJulianDay = null;
    this.daysLost = null;
    this.minYear = minYr;
    this.maxYear = maxYr;

    this.updateCountry(country);
  }

  Calendar.prototype.updateCountry = function(country)
  {
    this.j2gYear = lastJulianDate[country].year;
    this.j2gMonth = lastJulianDate[country].month;
    this.j2gDay = lastJulianDate[country].day;
    this.j2gLastJulianDay = lastJulianDate[country].lastJd;

    this.daysLost = this.j2gLastJulianDay - gregorianDate2JD(this.j2gYear, this.j2gMonth, this.j2gDay);
  };

  Calendar.prototype.firstDayInMonth = function(month)
  {
    var diff, firstDate = 1;

    /* set date of first day in month, should be 1
     * unless 1st of month is a 'lost' day when changing to Gregorian
     */
    if ((this.currYear===this.j2gYear)&&(month===this.j2gMonth+1))
    {
      diff = 1+this.j2gLastJulianDay-gregorianDate2JD(this.currYear, month, 1);
      if ((diff<=this.daysLost)&&(diff>0))
      {
        firstDate += diff;
      }
    }

    return firstDate;
  };

  Calendar.prototype.lastDayInMonth = function(month)
  {
    var last = daysInMonth[month];

    // Add extra day if month is February and leap year.
    if (month === 1)
    {
      if ((julianDate2JD(this.currYear, month, last)<this.j2gLastJulianDay))
      {
        if ((this.currYear % 4) === 0)  // use the Julian leap year algorithm
        {
          last++;
        }
      }
      else  // use the Gregorian leap year algorithm
      {
        if (((this.currYear % 100) === 0) && ((this.currYear % 400) === 0))
        {
          last++;
        }
      }
    }
    return last;
  };

  /* The id of a tbody node 'tbodyId' is passed in along with the year
   * month of the calendar to be made.
   * First clear out the old data. Then generate 6 rows of 7 cells,
   * each cell is a day, each row a week. Place a 1 in the first row
   * under the column for the correct day of the week, (column 0=Sunday)
   * then continue filling out the days in order until number of days in
   * the month is reached.
   */
  Calendar.prototype.genCalendarMonth = function(month)  // month = 0 ... 11
  {
    var jd, col,
        firstDate,
        lastDate,
        firstDateDOW,
        day, week,
        tbodyNode, trNode, tdNode, aNode, txtNode,
        savThis = this;  // save this instance for use in closure

    function update()
    {
      savThis.updateDateInfo(this);
      return false;
    }
    /* Calculate the first day of the month  */
    firstDate = this.firstDayInMonth(month);

    /* Calculate the Day Of Week of the first day in the month
     * so the dates start in the correct table cell
     */
    if ((this.currYear>this.j2gYear)||((this.currYear===this.j2gYear)&&(month>this.j2gMonth)))
    {
      jd = gregorianDate2JD(this.currYear, month, firstDate);
    }
    else
    {
      jd = julianDate2JD(this.currYear, month, firstDate);
    }
    firstDateDOW = dayOfWeek(jd);        // Sunday = 0
    /* Calculate the last day of the month  */
    lastDate = this.lastDayInMonth(month);
    /* fetch the tbody node that will receive the data  */
    tbodyNode = document.getElementById("m"+month);
    /* remove existing contents */
    while (tbodyNode.rows.length > 0)
    {
      tbodyNode.deleteRow(0);
    }
    /* now build the new table. This table has 7 columns each
     * already headed by the names of the days 'Mon', Tue' etc
     */
    day = firstDate;
    for (week=0; week<6; week++)
    {
      trNode = tbodyNode.insertRow(tbodyNode.rows.length);
      trNode.setAttribute("align", "right");
      trNode.setAttribute("height", "17");
      for (col=0; col<7; col++)
      {
        if (((week===0)&&(col<firstDateDOW))||(day>lastDate))
        {
          tdNode = trNode.insertCell(trNode.cells.length);
          txtNode = document.createTextNode(" ");
          tdNode.appendChild(txtNode);
        }
        else
        {
          tdNode = trNode.insertCell(trNode.cells.length);
          aNode = document.createElement("a");
          tdNode.appendChild(aNode);
          aNode.setAttribute("href", "#");
          aNode.jd = jd;       // create custom property
          aNode.onclick = update;
          txtNode = document.createTextNode(day);
          aNode.appendChild(txtNode);
          if (jd===this.currJulianDay)
          {
            this.currNode = aNode;     // make the currNode valid so updateDateInfo can clear something
            this.updateDateInfo(aNode);
          }
          /* Check if this is the last day that Julian calendar is used */
          if (jd===this.j2gLastJulianDay)
          {
            day += this.daysLost;  /* skip the required number of days to match Gregorian date */
            /* re-calc the last day of month, it will now be set by Gregorian method */
            lastDate = this.lastDayInMonth(month);
          }
          day++;
          jd++;        // increment Julian day
        }
      }
    }
  };

  /* Generate all 12 months calendars for the target year passed in.
   * First change the text in the table header to be the targetYear
   * Then call genCalendarMonth 12 times passing the ID of the 12 <tbody>
   * nodes that will recieve the data.
   */
  Calendar.prototype.genCalendarYear = function(targetYr)
  {
    var mon;

    if ((targetYr <= this.minYear)&&(targetYr > this.maxYear))
    {
      return;
    }
    this.currYear = targetYr;

    for (mon=0; mon<12; mon++)
    {
      this.genCalendarMonth(mon);
    }
  };

  /* Generate a HTML code for creating 12 tables held in a master table
   * set out as 3 rows of 4.
   * Hardwire the id of the 12 month tables to be m0, m1 ... m11.
   */
  Calendar.prototype.genTableSkeleton = function()
  {
    var tblRow, row, col, d, cell, cellTxt,
        hdrCell, dowRow, dowTxt, monTbl, monHdr, monTblBody,
        hdrRow, monCell, monTxt,
        tblBody = this.calNode;

    // creating 12 cells in 3 rows of 4
    for (row=0; row<3; row++)
    {
      // creates a table row
      tblRow = tblBody.insertRow(tblBody.rows.length);
      for (col=0; col<4; col++)
      {
        // Create a <td> element and a text node, make the text
        // node the contents of the <td>, and put the <td> at
        // the end of the table row
        cell = tblRow.insertCell(tblRow.cells.length);
        // create a <table> element in each cell to hold the month's dates
        monTbl = document.createElement("table");
        // appends <table> to cell td element
        cell.appendChild(monTbl);
        monTbl.className = "dates";
        monTbl.setAttribute("cellPadding", "0");
        monTbl.setAttribute("cellSpacing", "1");
        monHdr = document.createElement("tHead");
        monTbl.appendChild(monHdr);
        // create the row to hold the month name
        hdrRow = monHdr.insertRow(monHdr.rows.length);
        monCell = document.createElement("th");
        monCell.colSpan = "7";
        monCell.className = "monthName";
        monTxt = document.createTextNode(months[4*row+col]);
        monCell.appendChild(monTxt);
        hdrRow.appendChild(monCell);

        // create the row to hold the dow names
        dowRow = monHdr.insertRow(monHdr.rows.length);
        for (d=0; d<7; d++)
        {
          hdrCell = document.createElement("th");
          dowTxt = document.createTextNode(days[d]);
          hdrCell.appendChild(dowTxt);
          // add the cell to the dow row
          dowRow.appendChild(hdrCell);
        }

        monTblBody = document.createElement("tBody");
        // put the <tbody> in the <table>
        monTbl.appendChild(monTblBody);
        // give the 12 empty tbodys the id m1, m2 ... m11 so they can be filled by genCalendarMonth()
        monTblBody.setAttribute("id", "m"+(4*row+col));  // this is the table holding the months dates
      }
    }

    // create the table of equivalent dates
    tblBody = this.equNode;
    // creating a row of 2 cells for each group
    for (row=0; row<infoLabels.length; row++)
    {
      // creates a table row
      tblRow = tblBody.insertRow(tblBody.rows.length);
      // create 2 cells
      cell = tblRow.insertCell(tblRow.cells.length);
      cell.className = "lbl";
      cellTxt = document.createTextNode(infoLabels[row]);
      cell.appendChild(cellTxt);
      cell = tblRow.insertCell(tblRow.cells.length);
      cell.setAttribute("id", infoCountries[row]);
      cellTxt = document.createTextNode("1970 Jan 01");
      cell.appendChild(cellTxt);
    }
  };

  Calendar.prototype.updateDateInfo = function(dateNode)
  {
    var date = [],
        dateStr,
        cell,
        day,
        txtNode,
        c;

    // clear the current highlighted date
    this.currNode.style.backgroundColor = "transparent";
    // save the new selected node
    this.currNode = dateNode;
    // save the corresponding Julian Day (especially stored in custom property
    this.currJulianDay = dateNode.jd;

    // update the selected day info
    this.currNode.style.backgroundColor = "#f2c540";   // highlight it use zazz yellow
    // update the Julian Day of the selected date
    txtNode = document.createTextNode(this.currJulianDay);
    this.jdCellNode.replaceChild(txtNode, this.jdCellNode.firstChild);

    // fill out the table of equivalent dates
    for (c=0; c<infoCountries.length; c++)
    {
      date = jd2Date(this.currJulianDay, lastJulianDate[infoCountries[c]].lastJd);
      day = (100+date[2]).toString();     // force leading '0' if single digit
      dateStr = date[0]+" "+months[date[1]].slice(0,3)+" "+day.slice(1);
      cell = document.getElementById(infoCountries[c]);
      txtNode = document.createTextNode(dateStr);
      cell.replaceChild(txtNode, cell.firstChild);
    }
  };

