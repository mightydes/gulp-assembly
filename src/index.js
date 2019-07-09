const _ = require('underscore');
const gulp = require('gulp');

module.exports = Assembly;


// FUNCTIONS:

function Assembly(options) {
    if (!(this instanceof Assembly)) {
        return new Assembly(options);
    }

    if (!_.has(options, 'utils')) {
        throw new Error(`[gulp-assembly] Missed mandatory 'options.utils'!`);
    }

    const utils = options.utils;
    const gulpWatchOpt = _.has(options, 'watch') ? options['watch'] : {};

    let _bundles = [];

    return {
        bundle: bundle,
        build: build
    };


    // FUNCTIONS:

    function bundle(name, callback) {
        const bundle = new Bundle(name);
        _bundles.push(bundle);
        if (callback) {
            callback(bundle);
        }
        return bundle;
    }

    function build() {
        let all = [];
        _.each(_bundles, (bundle) => {
            const bundleList = utils.argv._;
            if (!bundleList.length || bundleList.indexOf(bundle.getName()) > -1) {
                let dep = [];
                _.each(bundle.getComponents(), (component) => {
                    let skip = component.name === 'js' && utils.isNoJs()
                        || component.name === 'css' && utils.isNoCss();

                    if (!skip) {
                        _.each(component.tasks, (task, name) => {
                            let opt = {};
                            if (_.isArray(task)) {
                                opt = task[1];
                                task = task[0];
                            }
                            let id = [bundle.getName(), component.name, name].join(':');
                            dep.push(id);
                            gulp.task(id, task);

                            if (!utils.isNoWatch() && opt.watch) {
                                gulp.watch(opt.watch, gulpWatchOpt, [id]);
                            }
                        });
                    }
                });
                gulp.task(bundle.getName(), dep);
                all = _.union(all, dep);
            }
        });
        if (all.length) {
            gulp.task('default', all);
        } else {
            console.info('No tasks found!');
            process.exit();
        }
    }
}

function Bundle(name) {
    const _name = name;
    let _components = [];

    return {
        js: js,
        css: css,
        etc: etc,
        getName: getName,
        getComponents: getComponents
    };


    // FUNCTIONS:

    function js(tasks) {
        return _components.push({name: 'js', tasks: tasks});
    }

    function css(tasks) {
        return _components.push({name: 'css', tasks: tasks});
    }

    function etc(tasks) {
        return _components.push({name: 'etc', tasks: tasks});
    }

    function getName() {
        return _name;
    }

    function getComponents() {
        return _components;
    }
}
