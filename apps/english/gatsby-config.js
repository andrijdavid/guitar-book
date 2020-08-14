const themeOptions = require('gatsby-theme-guitar-book/theme-options');

module.exports = {
  pathPrefix: '/english',
  plugins: [
    {
      resolve: `gatsby-theme-guitar-book`,
      options: {
        ...themeOptions,
        root: __dirname,
        baseDir: 'apps/english',
        subtitle: 'English Songs',
        sidebarCategories: {
          null: [
            'index',
            'seaside',
            'dont-you-worry-child',
            'cringe',
            'riptade',
            'wake-me-up',
            'i-see-fire',
            'little-talks',
            '9-crimes',
            'our-last-summer',
            'sweater-weather',
            'iris',
            'waiting-for-the-world-to-change',
            'we-dont-belive-whats-on-tv',
          ]
        },
      }
    },
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        cache: true,
        fix: true,
        test: /\.js$|\.jsx$/,
        exclude: /(node_modules|.cache|public)/,
        stages: ['develop'],
        options: {
          emitWarning: true,
          failOnError: false
        }
      }
    }
  ]
};
