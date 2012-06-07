class PostsController < ApplicationController
  get '/' do
    @total = 12345
    @page = params[:page]? params[:page].to_i : 1
    @rows = []
    sleep 1
    (1..10).to_a.each do |index|
      i = index * @page
      @rows << {:id => index, :name => "name #{i}", :value => i}
    end
    @result = {:total => @total, :rows => @rows}
    @result.to_json
  end
  
  get %r{(\d+)} do |id|
    #sleep 30
    @data = {:id => 1, :name => 'name 1'}
		@data.to_json
  end
  
  post "/" do
    sleep 3
    @data = {:id => 1, :name => params[:name]}
		@data.to_json
  end
  
  put %r{(\d+)} do |id|
    @data = {:id => 1, :name => params[:name]}
		@data.to_json
  end 
  
  delete %r{(\d+)} do |id|
    @result = true
  end
end