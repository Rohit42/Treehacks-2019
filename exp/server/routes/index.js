var express = require('express');
var ke = require('keyword-extractor');
var bodyParser = require('body-parser');


var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/keyword', function (req, res, next) {
    console.log(req.body);
    var text = req.body.text;
    console.log(text);
    var out = ke.extract(text, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
    })
    console.log(out);
    res.status(200).json({
        'out': out
    });
})

module.exports = router;
