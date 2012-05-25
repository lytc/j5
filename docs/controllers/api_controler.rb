require 'kramdown'

class ApiController < ApplicationController
  get '/:klass' do
    klass = params[:klass]
    klass = klass.gsub('.', '/')

    data = JSON.parse(File.read("data/#{klass}.json"))
    y data
    data['class']['description'] = Kramdown::Document.new(data['class']['description']).to_html

    data['properties'].each do |name, value|
      value['description'] = Kramdown::Document.new(value['description']).to_html
    end

    data['methods'].each do |name, value|
      value['description'] = Kramdown::Document.new(value['description']).to_html
    end

    data.to_json
  end

end