/* File: content.js
 * ---------------
 * Hello! You'll be making most of your changes
 * in this file. At a high level, this code replaces
 * the substring "cal" with the string "butt" on web pages.
 *
 * This file contains javascript code that is executed
 * everytime a webpage loads over HTTP or HTTPS.
 */
var elements = document.getElementsByTagName('*');
console.log(document.title);

// var htmlString= document.getElementsByTagName('html')[0].innerHTML;
// console.log(htmlString)
// var stripedHtml = htmlString.replace(/<[^>]+>/g, '');
// // Hello World
// // This is the text that we should get.
// // Our Code World &#169; 2017
// console.log(stripedHtml);

// // Hello World
// // This is the text that we should get.
// // Our Code World © 2017
// console.log(decodedStripedHtml);
for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;
            console.log(text)
            var replacedText = text.replace(/cal/gi, "butt"); // replaces "cal," "Cal", etc. with "butt"

            if (replacedText !== text) {
                element.replaceChild(document.createTextNode(replacedText), node);
              }
        }
    }
}
