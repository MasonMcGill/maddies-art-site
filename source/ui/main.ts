import { html, render } from 'lit-html';

render(rootView(location.hash), document.body);

window.onhashchange = () => {
  render(rootView(location.hash), document.body);
};

function rootView(path: string) {
  const entries = [
    {
      name: '2022',
      // linkPath: '2022-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2022/bts.jpg'
    },
    {
      name: '2021',
      // linkPath: '2021-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2021/coney-island.jpg'
    },
    {
      name: '2020',
      // linkPath: '2020-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2020/in-your-head.jpg'
    },
    {
      name: '2019',
      // linkPath: '2019-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2019/wet-tiger.jpg'
    },
    {
      name: '2018',
      // linkPath: '2018-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2018/trickle-down.jpg'
    },
    {
      name: '2017',
      // linkPath: '2017-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2017/city-man.jpg'
    },
    {
      name: '2016',
      // linkPath: '2016-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2016/political.jpg'
    },
    {
      name: '2015',
      // linkPath: '2015-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2015/big-lady.jpg'
    },
    {
      name: '2014',
      // linkPath: '2014-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2014/lady-and-the-tiger.jpg'
    },
    {
      name: '2013',
      // linkPath: '2013-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2013/rabbits.jpg'
    },
    {
      name: '2012',
      // linkPath: '2012-paintings.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2012/extinction-dream-2.jpg'
    },
    {
      name: 'About',
      // linkPath: 'about.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2017/lichtenstein.jpg'
    },
    {
      name: 'Contact',
      // linkPath: 'contact.html',
      linkPath: 'construction-notice.html',
      imagePath: 'images/paintings-2021/heart-disruption.jpg'
    }
  ];

  return html`
    <header>
      <a href="index.html">
          —&nbsp; Madeline Weste &nbsp;—
      </a>
    </header>
    <main>
      <div class="card-container">
        ${
          entries.map(({ name, linkPath, imagePath }) => html`
            <a href="${linkPath}">
              <div class="card">
                <img src="${imagePath}">
                <div class="label">${name}</div>
              </div>
            </a>
          `)
        }
      </div>
    </main>
  `;
}
