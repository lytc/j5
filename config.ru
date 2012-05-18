require 'rack'
require 'sinatra/base'
require 'sprockets'
require 'json'
require 'uglifier'

Dir.glob "application/controllers/**/*.rb" do |file|
	require File.expand_path(file)
end

builder = Rack::Builder.new do
	map("/assets") do
		sprocket = Sprockets::Environment.new
		sprocket.append_path 'application/assets/javascripts'
		sprocket.append_path 'application/assets/stylesheets'
		# sprocket.append_path 'application/assets/vender'
    #uglifier = Uglifier.new
    #sprocket.register_preprocessor 'application/javascript', :uglifier do |context, data|
    #  uglifier.compile(data)
    #end
		
		run sprocket
	end
	map("/posts") { run PostsController }
	map("/") { run IndexController }
end

run builder
