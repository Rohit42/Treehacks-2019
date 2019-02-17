var express = require('express');
var router = express.Router();
var ke = require('keyword-extractor');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/keyword', js, function (req, res, next) {
    var text = req.body.text;
    var out = ke.extract(text, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
    })
    res.status(200).json({
        'out': out
    });
})

module.exports = router;
