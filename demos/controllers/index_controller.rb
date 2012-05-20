class IndexController < ApplicationController
  get "/" do
    jstreefile = File.new(File.expand_path('../build/tree.json'), 'r')
    @jstree = JSON.parse jstreefile.read
    jstreefile.close

    csstreefile = File.new(File.expand_path('../build/resources/css/tree.json'), 'r')
    @csstree = JSON.parse csstreefile.read
    csstreefile.close

    erb :"index"
  end
end