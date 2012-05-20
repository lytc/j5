require 'sprockets'
require 'yui/compressor'
require 'sass'

module J5Helper
    SRC_DIR = 'src/'
    BUILD_DIR = 'build/'

    def self.build()
        sprocket = Sprockets::Environment.new
        sprocket.append_path SRC_DIR + 'javascripts'
        sprocket.append_path SRC_DIR + 'resources/stylesheets'

        # javascript
        jscontent = sprocket['bootstrap.js'].to_s
        j5 = File.new(BUILD_DIR + 'j5.js', 'w')
        j5.write(jscontent)
        j5.close

        compressor = YUI::JavaScriptCompressor.new(:munge => true)
        jscontentmin = compressor.compress(jscontent)
        j5min = File.new(BUILD_DIR + 'j5.min.js', 'w')
        j5min.write(jscontentmin)
        j5min.close

        # stylesheet
        csscontent = sprocket['bootstrap.css'].to_s
        css = File.new(BUILD_DIR + 'resources/css/j5.css', 'w')
        css.write(csscontent)
        css.close

        compressor = YUI::CssCompressor.new

        csscontentmin = compressor.compress(csscontent)

        cssmin = File.new(BUILD_DIR + 'resources/css/j5.min.css', 'w')
        cssmin.write(csscontentmin)
        cssmin.close

        # copy javascript
        FileUtils::cp_r(SRC_DIR + 'javascripts', BUILD_DIR)

        # copy font
        FileUtils::cp_r(SRC_DIR + 'resources/font', BUILD_DIR + 'resources')

        # build tree javascript
        path = File.expand_path('src/javascripts') + '/'
        assets = sprocket['bootstrap.js'].to_a
        assets.pop
        tree = []
        assets.each do |item|
            tree << item.pathname.to_s.gsub(path, '')
        end

        jstreefile = File.new(BUILD_DIR + 'tree.json', 'w')
        jstreefile.write(tree)
        jstreefile.close

        # build tree stylesheet
        path = File.expand_path('src/resources/stylesheets') + '/'
        assets = sprocket['bootstrap.css'].to_a
        assets.pop
        tree = []

        FileUtils.rm_rf(BUILD_DIR + 'resources/css/$')
        FileUtils.mkdir_p(BUILD_DIR + 'resources/css/$')

        assets.each do |item|
            filepath = item.pathname.to_s
            basepath = filepath.gsub(path, '')
            next if basepath == '$/_mixins.scss'

            dest = BUILD_DIR + 'resources/css/' + basepath
            if basepath.match('.scss')
                dirname = File.dirname(dest)
                basename = File.basename(dest, '.scss')
                destfilename = dirname + '/' + basename
                FileUtils.mkdir_p(dirname)
                file = File.new(destfilename, 'w')
                file.write(sprocket[basepath].to_s)
                file.close

                tree << destfilename.gsub('build/resources/css/', '')
            else
                FileUtils::cp(filepath, dest)
                tree << basepath
            end
        end

        csstreefile = File.new(BUILD_DIR + 'resources/css/tree.json', 'w')
        csstreefile.write(tree)
        csstreefile.close
    end
end