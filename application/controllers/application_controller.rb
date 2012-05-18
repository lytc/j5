class ApplicationController < Sinatra::Base
  set :root => File.expand_path("../..", __FILE__)
  set :views => settings.root + "/views"
  
  before do
    if !request.xhr? && request.path != '/'
      p request.xhr?, request.path
      halt erb(:index)
    end
    
    #unless request.xhr?
    if request.media_type == 'application/json'
      params.merge!(JSON.parse(request.body.read))
    end
    
  end
  
end
