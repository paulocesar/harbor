var fs = require('fs');
var path = require('path');
var gm = require('gm');

var imagePath = null;

var routes = [
    {
        method: 'POST',
        path: '/image/upload',
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: true
            },
            handler: function (request, reply) {
                var p = path.resolve(imagePath, 'sample.png');
                var image = request.payload.image
                image.pipe(fs.createWriteStream(p));
                image.on('end', function () {
                    reply({ src: '/images/sample.jpg' });
                });
            }
        }
    },

    {
        method: 'POST',
        path: '/image/crop',
        config: {
            handler: function (request, reply) {
                var srcImg = path.resolve(imagePath, 'sample.png');
                var destImg = path.resolve(imagePath, 't-sample.png');
                var coords = request.payload;
                var resizeX = 150;
                var resizeY = 150;

                console.dir(coords);

                gm(srcImg)
                    .resize(coords.currentWidth, coords.currentHeight)
                    //subtrair left/right
                    .crop(coords.width * 3, coords.height * 3, coords.x, coords.y)
                    .resize(resizeX,resizeY)
                    .write(destImg, function(err){
                        if (err) {
                            console.dir(err);
                            return reply(err);
                        }

                        console.log("Image: " + destImg.toString() + " Cropped");
                        reply("success");
                    });
            }
        }
    }
];

module.exports = function (server, data) {
    if (!data.publicPath) { return; }

    imagePath = path.resolve(data.publicPath.toString(), 'images').toString();

    return routes;
};
