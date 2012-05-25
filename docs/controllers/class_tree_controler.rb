class ClassTreeController < ApplicationController
  def parse(items)
    result = []

    items.each do |index, item|
      data = ''
      if (item.is_a?(String))
        data = {:class => item}
      end
      tree_item = {:html => index, :expanded => true, :children => [], :$data => data}
      tree_item[:children] << self.parse(item) unless item.is_a?(String)
      result << tree_item
    end
    result
  end

  get '/' do
    tree = JSON.parse(File.read('data/tree.json'))
    rows = []
    tree.each do |item|
      rows << self.parse(item)
      #
      #p item
      #if item.is_a?(String)
      #  rows << item
      #else
      #  rows << self.parse(item)
      #end
    end

    @result = {:rows => rows}
    @result.to_json
    #rows = [{:html => 'abc'}, {:html => 'def'}]
    #@result = {:rows => rows}
    #@result.to_json
  end

end