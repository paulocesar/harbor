var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var gm = require('gm');

var imagePath = null;

var getImageName = null;
var getDefaultName = function () { return Date.now(); };

var getFileInfo = function (filename) {
    var data = {};

    data.extension = path.extname(filename).toLowerCase();
    data.name = path.basename(filename, data.extension);
    data.filename = data.name + data.extension;

    return data;
}

var cropImage = function (srcImg, destImg, coords, callback) {
    gm(srcImg).crop(coords.width, coords.height, coords.x, coords.y)
        .resize(coords.resizeX, coords.resizeY)
        .write(destImg, callback);
}

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
                var image = request.payload.image;
                var extension = getFileInfo(image.hapi.filename).extension;
                var destFile =  getImageName() + extension;
                var p = path.resolve(imagePath, destFile);

                image.pipe(fs.createWriteStream(p));

                image.on('end', function () {
                    reply({ src: '/images/cropper/' + destFile });
                });
            }
        }
    },

    {
        method: 'POST',
        path: '/image/crop',
        config: {
            handler: function (request, reply) {
                var image = request.payload;
                var fileInfo = getFileInfo(image.src);
                var srcImg = path.resolve(imagePath, fileInfo.filename);

                var destImgName = getImageName() + fileInfo.extension;
                var destImg = path.resolve(imagePath, destImgName);

                cropImage(srcImg, destImg, image, function(err){
                    if (err) {
                        console.dir(err);
                        return reply(err);
                    }

                    reply({ src: '/images/cropper/' + destImgName });
                });
            }
        }
    }
];

module.exports = function (server, data) {
    if (!data.publicPath) { return; }

    var config = data.image || {};

    getImageName = config.getName || getDefaultName;
    getCropName = config.getCropName || getDefaultName;

    imagePath = path.resolve(data.publicPath.toString(), 'images/cropper').toString();

    return routes;
};
