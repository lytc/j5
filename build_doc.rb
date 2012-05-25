require 'json'

class BuildDoc
  REGEX_START_COMMENT = /^\s*\/\*\*/
  REGEX_END_COMMENT = /\*\/\s*$/
  REGEX_LINES = /\r\n|\n/
  REGEX_OPTIONAL = /\[(.*?)\]/
  REGEX_TAG = /@(?<tag>\w+)/
  REGEX_CLASS_TAG = /@class\s+(?<name>[\w\.\$]+)/
  REGEX_SUPERCLASS_TAG = /@superclass\s+(?<name>[\w\.\$]+)/
  REGEX_PROPERTY_TAG = /@property\s+(?<type>[\w\.\$\_\|]+)\s+(?<name>\w+)/
  REGEX_METHOD_TAG = /@method\s+(?<name>\w+)/
  REGEX_PARAM_TAG = /@param\s+(?<type>[\w\.\$\_\|]+)\s+(?<name>\w+|\[\w+\])(\s+(?<description>.*))?/
  REGEX_RETURN_TAG = /@return\s+(?<type>[\w\.\$\_\|]+)/
  REGEX_PARAM_OPTIONAL = /\[(?<name>\w+)\]/
  REGEX_SETTER = /set\w+/

  def self.build(src_path, dest_path)
    files = JSON.parse(File.read(src_path + '/tree.json'))
    files.sort!

    FileUtils.rm_rf(dest_path)

    data = []
    files.each do |file|
      dirname = File.dirname(file)
      basename = File.basename(file, '.js')
      dest_file_path = dest_path + '/' + (dirname == '.'? '' : dirname + '/') + basename + '.json'

      FileUtils.mkdir_p(File.dirname(dest_file_path))
      dest_file = File.new(dest_file_path, 'w')
      file_data = self.build_file(src_path + '/javascripts/' + file)
      data << file_data
      dest_file.write(file_data.to_json)
      dest_file.close
    end

    tree = []
    first = data.shift[:class][:name]
    tree << {first => first}
    sub = {}

    data.each do |item|
      packages = item[:class][:name].split('.')
      name = packages.pop
      t = sub
      packages.each do |p|
        t[p] ||= {}
        t = t[p]
      end
      t[name] = item[:class][:name]
    end

    tree << sub
    tree_file = File.new(dest_path + '/tree.json', 'w')
    tree_file.write(tree.to_json)
    tree_file.close
  end


  def self.build_file(file_path)
    lines = File.read(file_path).split("\n").map { |line| line.strip }

    in_block = false
    blocks = []

    block = ''
    lines.each do |line|
      if line.match(REGEX_START_COMMENT)
        in_block = true
        next
      end

      if line.match(REGEX_END_COMMENT)
        blocks << block
        block = ''
        in_block = false
        next
      end

      if (in_block)
        block << line.gsub(/^\*(\s*)?/, '') + "\n"
      end

    end

    class_data = {:class => {}, :properties => {}, :methods => {}}
    blocks.each do |block|
      next unless block.match(REGEX_TAG)

      if block.match(REGEX_CLASS_TAG)
        class_data[:class] = self.parse_class_block(block)

      elsif block.match(REGEX_PROPERTY_TAG)
        property = self.parse_property_block(block)
        class_data[:properties][property[:name]] = property

      elsif block.match(REGEX_METHOD_TAG)
        method = self::parse_method_block(block)
        class_data[:methods][method[:name]] = method

      end
    end
    class_data
  end

  ###
  def self.parse_class_block(text)
    data = {:description => ''}
    lines = text.split("\n")

    lines.each do |line|
      if m = line.match(REGEX_CLASS_TAG)
        data[:name] = m['name']
      elsif m = line.match(REGEX_SUPERCLASS_TAG)
        data[:superclass] = m['name']
      else
        data[:description] << line
      end
    end
    data
  end

  ###
  def self.parse_property_block(text)
    data = {:description => ''}
    lines = text.split("\n")

    lines.each do |line|
      if m = line.match(REGEX_PROPERTY_TAG)
        data[:name] = m['name']
        data[:type] = m['type']
      else
        data[:description] << line
      end
    end

    data
  end

  ###
  def self.parse_method_block(text)
    data = {:description => '', :params => {}}
    lines = text.split("\n")
    lines
    end_desc = false

    lines.each do |line|
      if m = line.match(REGEX_TAG)
        if m = line.match(REGEX_METHOD_TAG)
          data[:name] = m['name']
          if m = data[:name].match(REGEX_SETTER)
            data[:setter] = true
          end
        elsif m = line.match(REGEX_PARAM_TAG)
          param = self.parse_param_block(line, lines)
          data[:params][param[:name]] = param
        elsif m = line.match(REGEX_RETURN_TAG)
          data[:return] = m['type']
        end
        end_desc = true
      elsif !end_desc
        data[:description] << line
      end
    end

    data
  end

  ###
  def self.parse_param_block(line, lines)
    data = {}
    m = line.match(REGEX_PARAM_TAG)
    data[:name] = m['name']
    data[:type] = m['type']
    data[:description] = m['description']

    if m = data[:name].match(REGEX_PARAM_OPTIONAL)
      data[:name] = m['name']
      data[:optional] = true
    end

    (lines.index(line) +1 ..lines.count - 1).each do |i|
      break if (lines[i].match(REGEX_TAG))
        data[:description] << lines[i]
    end

    data
  end

end