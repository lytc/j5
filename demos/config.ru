require 'rack'
require 'sinatra/base'
require 'json'
require 'sprockets'

Dir.glob "controllers/**/*.rb" do |file|
	require File.expand_path(file)
end


builder = Rack::Builder.new do
    #map("/src") do
    #    run lambda { |env|
    #        [
    #            200,
    #            {
    #              'Content-Type'  => File.extname(env['PATH_INFO']) == 'js'? 'text/javascript' : 'text/css',
    #              'Cache-Control' => 'public, max-age=86400'
    #            },
    #            File.open('../src' + env['PATH_INFO'], File::RDONLY)
    #        ]
    #    }
    #end

	map("/assets") do
		sprocket = Sprockets::Environment.new
		sprocket.append_path 'assets/javascripts'
		sprocket.append_path 'assets/stylesheets'
		sprocket.append_path '../src'
		run sprocket
	end

	map("/posts") { run PostsController }
	map("/") { run IndexController }
end

run builder