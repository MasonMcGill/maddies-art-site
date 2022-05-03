const cheerio = require('cheerio');
const fs = require('fs-extra');
const pretty = require('pretty');

main();

function main() {
  if (process.argv.includes('--clean')) {
    fs.readdirSync('site').forEach(entryName => {
      fs.rmSync('site/' + entryName, { recursive: true, force: true });
    });
  }
  fs.copySync('images', 'site/images');
  fs.copySync('stylesheets', 'site/stylesheets');
  fs.copySync('node_modules/@fontsource', 'site/fonts');
  buildPages();
}

function buildPages() {
  buildIndexPage();
  buildConstructionNoticePage();
}

function buildIndexPage() {
  const entries = [
    { name: 'About',
      // linkPath: 'about.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2017/lichtenstein.jpg'
    },
    {
      name: 'Contact',
      // linkPath: 'contact.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2021/heart-disruption.jpg'
    },
    { name: '2022',
      // linkPath: '2022-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2022/bts.jpg'
    },
    { name: '2021',
      // linkPath: '2021-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2021/coney-island.jpg'
    },
    { name: '2020',
      // linkPath: '2020-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2020/in-your-head.jpg'
    },
    { name: '2019',
      // linkPath: '2019-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2019/wet-tiger.jpg'
    },
    { name: '2018',
      // linkPath: '2018-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2018/trickle-down.jpg'
    },
    { name: '2017',
      // linkPath: '2017-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2017/city-man.jpg'
    },
    { name: '2016',
      // linkPath: '2016-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2016/political.jpg'
    },
    { name: '2015',
    // linkPath: '2015-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2015/big-lady.jpg'
    },
    { name: '2014',
      // linkPath: '2014-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2014/lady-and-the-tiger.jpg'
    },
    { name: '2013',
      // linkPath: '2013-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2013/rabbits.jpg'
    },
    { name: '2012',
      // linkPath: '2012-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2012/extinction-dream-2.jpg'
    }
  ];
  const $ = getPageTemplate();
  const container = $('<div class="card-container"/>');

  entries.forEach(({ name, linkPath, imagePath }) => {
    container.append(`
      <a href="${linkPath}">
        <div class="card">
          <img src="${imagePath}">
          <div class="label">${name}</div>
        </div>
      </a>
    `);
  });

  $('main').addClass('index');
  $('main').append(container);
  fs.outputFileSync('site/index.html', pretty($.html()));
}

function buildContactPage() {

}

function buildGalleryPage() {

}

function getPageTemplate() {
  return cheerio.load(`
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <link rel="icon" href="images/favicon.png">
        <link rel="stylesheet" href="fonts/water-brush/latin-400.css">
        <link rel="stylesheet" href="fonts/kalam/latin-700.css">
        <link rel="stylesheet" href="stylesheets/main.css">
        <title>Madeline Weste</title>
      </head>
      <body>
        <header>
          <a href="index.html">
            —&nbsp; Madeline Weste &nbsp;—
          </a>
        </header>
        <main></main>
      </body>
    </html>
  `);
}

function buildConstructionNoticePage() {
  const $ = getPageTemplate();
  $('main').append('<div class="construction-notice">Under construction 🚧</div>');
  fs.outputFileSync('site/construction-notice.html', pretty($.html()));
}

function buildThumbnails() {
}
