# gulp-assembly-core

Run gulp tasks in bundle way.

---

## Usage:

```js
// gulpfile.js

const config = {
    // ...
};
const utils = require('gulp-assembly-utils')(config);
const Assembly = require('gulp-assembly-core');
const assembly = new Assembly({utils: utils});

// Register `website` bundle.
assembly.bundle('website', (bundle) => {
    // Register `css` task in `website` bundle.
    bundle.css({
        // Register `main` component in `css` task.
        main: [() => { // Component builder.
            return merge(
                gulp.src('./mount/foundation-bs-theme.less').pipe($.less(config.less)),
                utils.src([
                    'css-opentip',
                    'css-sweetalert',
                    'css-ui-select',
                    'css-angular-block-ui'
                ]),
                gulp.src('./mount/website.less').pipe($.less(config.less))
            ).pipe(lazyCss('website.css'));
        }, {watch: 'bundles/**/*.less'}] // Component options.
    });
    
    // Register `js` task in `website` bundle.
    bundle.js({
        // Register `mainLib` component in `js` task.
        mainLib: () => { // Component builder.
            return utils.src([
                'es6-shim',
                'jquery',
                'opentip',
                'sweetalert',
                'moment',
                'underscore',
                'angular',
                'angular-ru',
                'angular-cookies',
                'angular-sanitize',
                'angular-animate',
                'angular-h-sweetalert',
                'angular-block-ui',
                'angular-ui-bootstrap',
                'ui-select',
                'angular-recaptcha'
            ]).pipe(lazyJsLib('website-lib.js'));
        },
        // Register `mainApp` component in `js` task.
        mainApp: () => { // Component builder.
            return commonBrowserify(require.resolve('./mount/website'), 'website.js');
        }
    });
});

// Build all bundles:
assembly.build();

```

---

## Assembly options:

*   `utils` -- mandatory configured [gulp-assembly-utils](https://github.com/mightydes/gulp-assembly-utils) instance.

*   `watch` -- optional `gulp.watch` options object.
