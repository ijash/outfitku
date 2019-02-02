var fs = require('fs');

// // function to encode file data to base64 encoded string
// function base64_encode(file) {
//   // read binary data
//   var bitmap = fs.readFileSync(file);
//   // convert binary data to base64 encoded string
//   return new Buffer.from(bitmap).toString('base64');
// }
//
// var imgBuffer = base64_encode('public/img/ship3.jpg');
//
// var img = new Buffer.from(imgBuffer, "base64")
//
// fs.writeFile("test.jpg", img, function(err) {})

if (fs.existsSync('public/img/categories')) {
  console.log(true);
} else {
  console.log(false);
}