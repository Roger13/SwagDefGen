function convert() {
  'use strict';
  var inJSON = document.getElementById("JSON").value;
  try {
    inJSON = JSON.parse(inJSON);
  } catch (e) {
    alert("Your JSON is invalid!\n(" + e +")");
    return;
  }

  //For recursive functions to keep track of the tab spacing
  var tabCount = 0;
  var indentator = "\n";
  //Begin definitions
  var outSwagger = '"definitions": {';

  function changeIndentation (count) {
    let i;
    if (count >= tabCount) {
      i = tabCount
    } else {
      i = 0;
      indentator = '\n';
    }
    for ( ; i < count; i++) {
      indentator += '\t';
    }
    //Update tabCount
    tabCount = count;
  };

  function convertNumber (num) {
    if (num % 1 === 0) {
        outSwagger += indentator + '"type": "integer",';
        if (num < 2147483647 && num > -2147483647) {
          outSwagger += indentator + '"format": "int32"';
        } else if (Number.isSafeInteger(num)) {
          outSwagger += indentator + '"format": "int64"';
        } else {
          outSwagger += indentator + '"format": "unsafe"';
        }
    } else {
        outSwagger += indentator + '"type": "number"';
    }
  };

  //ISO8601 format - https://xml2rfc.tools.ietf.org/public/rfc/html/rfc3339.html#anchor14
  function convertDate (str) {
    let regxDate = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
    regxDateTime = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]).([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]{1,2})?(Z|(\+|\-)([0-1][0-9]|2[0-3]):[0-5][0-9])$/;
    if (regxDateTime.test(str)) {
        outSwagger += ','
        outSwagger += indentator + '"format": "date-time"';
    } else if (regxDate.test(str)) {
        outSwagger += ','
        outSwagger += indentator + '"format": "date"';
    }
  };

  function convertArray (obj) {
    outSwagger += indentator + '"type": "array",';
    outSwagger += indentator + '"items": {';
    changeIndentation(tabCount + 1);

    if (typeof obj === "number") { //attribute is a number
      convertNumber(obj);
      if (document.getElementById("requestExamples").checked) { 
            outSwagger += "," + indentator + '"description": "Ex: ' + obj + '"';
      }
	} else if (Object.prototype.toString.call(obj) === '[object Array]') { //attribute is an array
      convertArray(obj[0]);
    } else if (typeof obj === "object"){ //attribute is an object
      convertObject(obj);
    } else {
      outSwagger += indentator + '"type": "' + typeof obj + '"';
      if (typeof obj === "string") {
        convertDate(obj);
      }
	  if (document.getElementById("requestExamples").checked) { 
            outSwagger += "," + indentator + '"description": "Ex: ' + obj + '"';
      }

    }
    changeIndentation(tabCount - 1);
    outSwagger += indentator + '}';
  };

  function convertObject (obj) {
    //Convert null attributes to given type
    if (obj === null) {
      outSwagger += indentator + '"type": "' + document.getElementById("nullType").value + '",';
      outSwagger += indentator + '"format": "nullable"';
      return;
    }
    // ---- Begin properties scope ----
    outSwagger += indentator + '"type": "object",'
    outSwagger += indentator + '"properties": {';
    changeIndentation(tabCount + 1);
    //For each attribute inside that object
    for (var prop in obj) {
      // ---- Begin property type scope ----
      outSwagger += indentator + '"' + prop + '": {';
      changeIndentation(tabCount + 1);
      if (typeof obj[prop] === "number") { //attribute is a number
        convertNumber(obj[prop]);
      	if (document.getElementById("requestExamples").checked) { 
            outSwagger += "," + indentator + '"description": "Ex: ' + obj[prop] + '"';
        }
	  } else if (Object.prototype.toString.call(obj[prop]) === '[object Array]') { //attribute is an array
        convertArray(obj[prop][0], prop);
      } else if (typeof obj[prop] === "object") { //attribute is an object
        convertObject(obj[prop], prop);
      } else {
        outSwagger += indentator + '"type": "' + typeof obj[prop] + '"';
        if (typeof obj[prop] === "string") {
          convertDate(obj[prop]);
        }
		if (document.getElementById("requestExamples").checked) { 
            outSwagger += "," + indentator + '"description": "Ex: ' + obj[prop] + '"';
        }
      }
      // ---- End property type scope ----
      changeIndentation(tabCount - 1);
      outSwagger += indentator + '},'
    }

    changeIndentation(tabCount - 1);
    if (Object.keys(obj).length > 0) { //At least 1 property inserted
      outSwagger = outSwagger.substring(0, outSwagger.length - 1); //Remove last comma
      outSwagger += indentator + '}'
    } else { // No property inserted
      outSwagger += ' }';
    }
  };

  //Execution begins here
  changeIndentation(1);
  //For each object inside the JSON
  for (var obj in inJSON) {
	if (typeof inJSON[obj] === "object") {
    // ---- Begin object scope ----
    outSwagger += indentator + '"' + obj + '": {'
    changeIndentation(tabCount+1);
		if (Object.prototype.toString.call(inJSON[obj]) === '[object Array]') {
			convertArray(inJSON[obj][0], obj);
    } else {
      convertObject(inJSON[obj], obj);
    }
		// ---- End object scope ----
    changeIndentation(tabCount-1);
    outSwagger += indentator + '},';
    }
  }
  //Remove last comma
  outSwagger = outSwagger.substring(0, outSwagger.length - 1);
  changeIndentation(tabCount-1);
  outSwagger += indentator + '}';
  document.getElementById("Swagger").value = outSwagger;
}
