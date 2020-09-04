//Script by Luke DiGiovanna
//This script features more functions for drawing canvas text.
//When calling these functions do NOT put ctx. at the front. Also, declare fonts, colors, text-aligns, other canvas things before calling this method
function drawText(text, x, y, length = 9999, fontSize = 23) { 
  //this function is responsible for drawing multiple lines
  //can also draw lists . breaks line whenever there is an /n
  textLength = ctx.measureText(text).width;
  realY = y;
  lineText = text;
  printedText = "";
  text+=" ";
  lastLine = false;

  while (!lastLine) {
    textToErase = 0;  
    runs = 0;
    do {  //loop to get the line. runs at least once
      runs++;
      lineText = text.slice(printedText.length, text.length-textToErase);
      textLength = ctx.measureText(lineText).width;
      textToErase++;
    } while (textLength > length);
    if (runs == 1) lastLine = true;

    for (i = 0; i < 2; i++) {
      while (lineText.indexOf("/n") > 0) {
        lineText = lineText.slice(0,lineText.length-1);
      }
      if (lineText.charAt(0) == "/" && lineText.charAt(1) == "n") lineText = lineText.slice(2, lineText.length);
    }

    if (lineText.charAt(0) == " ") {
      lineText = lineText.slice(1,lineText.length);
    }
    previousLineText = lineText;
    while (lineText.charAt(lineText.length-1) != " " && !lastLine) {//tests if ends w/letter
      lineText = lineText.slice(0,lineText.length-1);
      if (lineText.length <= 1) {
        lineText = previousLineText;
        break;
      }
    }
  
    printedText+=lineText;
    ctx.fillText(lineText,x,realY);
    realY = realY+fontSize;
  }
}

function randomText(length = 1) {
  //makes a random string of characters
  random = 0;
  text = "";
  for (i = 0; i < length; i++) {
    random = Math.ceil(Math.random()*94)+32;
    text += String.fromCharCode(random);
  }
  return text;
}