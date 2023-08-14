function convert() {
  "use strict";
  // ---- Global variables ----
  var inJSON, outSwagger, tabCount, indentator;

  // ---- Functions definitions ----
  function changeIndentation(count) {
    /* 
	Assign 'indentator' a string beginning with newline and followed by 'count' tabs
	Updates variable 'tabCount' with the number of tabs used
	Global variables updated: 
	-identator 
	-tabcount
	*/

    let i;
    if (count >= tabCount) {
      i = tabCount;
    } else {
      i = 0;
      indentator = "\n";
    }
    for (; i < count; i++) {
      indentator += "\t";
    }
    //Update tabCount
    tabCount = count;
  }

  function conversorSelection(obj) {
    /* 
    Selects which conversion method to call based on given obj
	Global variables updated: 
    -outSwagger
    */

    changeIndentation(tabCount + 1);
    if (typeof obj === "number") {
      //attribute is a number
      convertNumber(obj);
    } else if (Object.prototype.toString.call(obj) === "[object Array]") {
      //attribute is an array
      convertArray(obj);
    } else if (typeof obj === "object") {
      //attribute is an object
      convertObject(obj);
    } else if (typeof obj === "string") {
      //attribute is a string
      convertString(obj);
    } else if (typeof obj === "boolean") {
      // attribute is a boolean
      outSwagger += indentator + '"type": "boolean"';
    } else {
      // not a valid Swagger type
      alert(
        'Property type "' + typeof obj + '" not valid for Swagger definitions'
      );
    }
    changeIndentation(tabCount - 1);
  }

  function convertNumber(num) {
    /* 
    Append to 'outSwagger' string with Swagger schema attributes relative to given number
    Global variables updated: 
    -outSwagger
    */

    if (num % 1 === 0 && !document.getElementById("noInt").checked) {
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
    if (document.getElementById("requestExamples").checked) {
      //Log example if checkbox is checked
      outSwagger += "," + indentator + '"example": "' + num + '"';
    }
  }

  //date is ISO8601 format - https://xml2rfc.tools.ietf.org/public/rfc/html/rfc3339.html#anchor14
  function convertString(str) {
    /* 
    Append to 'outSwagger' string with Swagger schema attributes relative to given string
    Global variables updated: 
    -outSwagger
    */

    let regxDate = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
      regxDateTime =
        /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]).([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]{1,3})?(Z|(\+|\-)([0-1][0-9]|2[0-3]):[0-5][0-9])$/;

    outSwagger += indentator + '"type": "string"';
    if (regxDateTime.test(str)) {
      outSwagger += ",";
      outSwagger += indentator + '"format": "date-time"';
    } else if (regxDate.test(str)) {
      outSwagger += ",";
      outSwagger += indentator + '"format": "date"';
    }
    if (document.getElementById("requestExamples").checked) {
      //Log example if checkbox is checked
      outSwagger += "," + indentator + '"example": "' + str + '"';
    }
  }

  function convertArray(obj) {
    /* 
    Append to 'outSwagger' string with Swagger schema attributes relative to given array
    Global variables updated: 
    -outSwagger
    */
    let schema = {};
    let examples = new Set();
    for (const entry of obj) {
      for (const key of Object.keys(entry)) {
        if (!Object.keys(schema).includes(key)) {
          examples.add(entry);
          schema[key] = entry[key];
        }
      }
    }

    outSwagger += indentator + '"type": "array",';
    // ---- Begin items scope ----
    outSwagger += indentator + '"items": {';
    conversorSelection(schema);
    outSwagger += indentator + "}";
    // ---- End items scope ----
    // ---- Begin example scope ----
    if (document.getElementById("requestExamples").checked) {
      outSwagger += ","
      outSwagger += indentator + '"example": ' + JSON.stringify(
        Array.from(examples), null, '\t'
      ).replaceAll('\n', indentator)
    }
    // ---- End example scope ----
  }

  function convertObject(obj) {
    /* 
    Append to 'outSwagger' string with Swagger schema attributes relative to given object
    Global variables updated: 
    -outSwagger
    */

    //Convert null attributes to given type
    if (obj === null) {
      outSwagger +=
        indentator +
        '"type": "' +
        document.getElementById("nullType").value +
        '",';
      outSwagger += indentator + '"format": "nullable"';
      return;
    }
    // ---- Begin properties scope ----
    outSwagger += indentator + '"type": "object",';
    outSwagger += indentator + '"properties": {';
    changeIndentation(tabCount + 1);
    //For each attribute inside that object
    for (var prop in obj) {
      // ---- Begin property type scope ----
      outSwagger += indentator + '"' + prop + '": {';
      conversorSelection(obj[prop]);
      outSwagger += indentator + "},";
      // ---- End property type scope ----
    }

    changeIndentation(tabCount - 1);
    if (Object.keys(obj).length > 0) {
      //At least 1 property inserted
      outSwagger = outSwagger.substring(0, outSwagger.length - 1); //Remove last comma
      outSwagger += indentator + "}";
    } else {
      // No property inserted
      outSwagger += " }";
    }
  }

  function format(value, yaml) {
    /*
	Convert JSON to YAML if yaml checkbox is checked
	Global variables updated:
	NONE
	*/
    if (yaml) {
      return value
        .replace(/[{},"]+/g, "")
        .replace(/\t/g, "  ")
        .replace(/(^ *\n)/gm, "");
    } else {
      return value;
    }
  }

  // ---- Execution begins here ----
  inJSON = document.getElementById("JSON").value;
  try {
    inJSON = JSON.parse(inJSON);
  } catch (e) {
    alert("Your JSON is invalid!\n(" + e + ")");
    return;
  }

  //For recursive functions to keep track of the tab spacing
  tabCount = 0;
  indentator = "\n";
  // ---- Begin definitions ----
  outSwagger = '"definitions": {';
  changeIndentation(1);
  //For each object inside the JSON
  for (var obj in inJSON) {
    // ---- Begin schema scope ----
    outSwagger += indentator + '"' + obj + '": {';
    conversorSelection(inJSON[obj]);
    outSwagger += indentator + "},";
    // ---- End schema scope ----
  }
  //Remove last comma
  outSwagger = outSwagger.substring(0, outSwagger.length - 1);
  // ---- End definitions ----
  changeIndentation(tabCount - 1);
  outSwagger += indentator + "}";

  document.getElementById("Swagger").value = format(
    outSwagger,
    document.getElementById("yamlOut").checked
  );
}

