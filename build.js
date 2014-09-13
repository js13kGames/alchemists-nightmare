var exec = require('child_process').exec;
var fs = require('fs');
var archiver = require('archiver');
var htmlMinify = require('html-minifier').minify;
var colours = require('colors');

// compress js
exec("uglifyjs2.cmd js/engine.js > build/engine.min.js -c -m", function (error, stdout, stderr)
{
    if (error != null)
    {
        console.log(error);
    }

    // compress html
    var data = fs.readFileSync("index.build.html", 'utf8');
    var htmlMin = htmlMinify(data, {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true
    })

    fs.writeFileSync('build/index.html', htmlMin);

    // create zip
    var zip = fs.createWriteStream('4Elements.zip');
    var archive = archiver('zip');

    zip.on('close', function () {
        var zipSize = archive.pointer() / 1024;
        var current = ("4Elements.zip " + zipSize.toFixed(2) + "KB zipped").bold.white;
        var left = 13.0 - zipSize;

        left = left > 0.0 ? (left.toFixed(2) + "KB left!").green : (left.toFixed(2) + "KB over!").red;

        console.log(current + " " + left);
    });

    archive.pipe(zip);
    archive.bulk(
        [
            {
                expand: true,
                cwd: 'build',
                src: ['**'],
                dest: '4Elements'
            }
        ]);

    archive.finalize();
});
