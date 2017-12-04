var formidable = require('formidable');
var fs = require('fs');

module.exports = (function () {

    var router = require('express').Router();

    var validateHeader = function (req, res, next) {
        // validate the header
        if (req.headers.hasOwnProperty('app-header-valid')) {
            // Ok let's continue
            next();
        } else {
            // no valid header
            res.status(400).send('No valid headers');
        }
    };

    router.post('/', validateHeader, function (req, res) {
        var receivedFields = {
            username: req.body.username,
            password: req.body.password
        }

        res.status(200).send(receivedFields);
    });

    router.post('/upload', validateHeader, function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) { return res.status(500).send('Error parsing file.'); }
            // res.download(files.file.path);
            var image = fs.readFileSync(files.file.path);
            res.writeHead(200, {'Content-Type': 'image/png' });
            res.end(image, 'base64');
       
        });
    });

    router.get('/:username/:password', validateHeader, function (req, res) {
        var receivedFields = {
            username: req.params.username,
            password: req.params.password
        }
        res.status(200).send(receivedFields);
    });

    return router;

})();
