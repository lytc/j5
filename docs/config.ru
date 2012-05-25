require 'rack'
require 'sinatra/base'
require 'json'
require 'sprockets'

require File.expand_path('controllers/application_controller.rb')
Dir.glob "controllers/**/*.rb" do |file|
	require File.expand_path(file)
end


builder = Rack::Builder.new do
  map("/assets") do
    sprocket = Sprockets::Environment.new
    sprocket.append_path 'assets/javascripts'
    sprocket.append_path 'assets/stylesheets'
    sprocket.append_path '../src'
    run sprocket
  end

	map("/class-tree") { run ClassTreeController }
	map("/api") { run ApiController }
	map("/") { run IndexController }
end

run builder