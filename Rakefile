require 'rubygems'
require 'json'
require './build'
require './build_doc'

desc "rebuild the j5.min.js files for distribution"

task :build do
  Build::build()
end

task :doc do
  BuildDoc::build('build', 'docs/data')
end