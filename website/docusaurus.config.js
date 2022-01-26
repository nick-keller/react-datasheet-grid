const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'React Datasheet Grid',
  tagline: 'An Excel-like React component to create beautiful spreadsheets',
  url: 'https://react-datasheet-grid.netlify.app/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Equify', // Usually your GitHub org/user name.
  projectName: 'react-datasheet-grid', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'React Datasheet Grid',
      items: [
        {
          href: '/docs/features',
          position: 'left',
          label: 'Features',
        },
        {
          type: 'doc',
          docId: 'getting-started',
          position: 'left',
          label: 'Doc',
        },
        {
          href: 'https://www.npmjs.com/package/react-datasheet-grid',
          label: 'NPM',
          position: 'right',
        },
        {
          href: 'https://github.com/Equify/react-datasheet-grid',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: darkCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/Equify/react-datasheet-grid/edit/master/website/',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('react-datasheet-grid/dist/style.css'),
          ],
        },
        gtag: {
          trackingID: 'G-PZ8BTMNFN9',
        },
      },
    ],
  ],
}
