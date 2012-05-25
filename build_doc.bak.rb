require 'kramdown'

module BuildDoc
  def self.build(file_src)
    blocks = read_all_doc_blocks(file_src)
    #doc = ClassDoc.new
    #doc.parse(blocks)
    #p doc
    blocks.each do |b|
      d = BaseDoc.new
      p d.parse(b)
    end
  end

  def self.read_all_doc_blocks(file)
    lines = File.read(file).split("\n").map { |line| line.strip }
    in_block = false
    blocks = []
    current_block = []
    lines.each do |line|
      if in_block
        if line == '*/'
          in_block = false
          blocks << current_block
        else
          current_block << line.gsub(/^\* ?/, '')
        end
      else
        if line == '/**'
          in_block = true
          current_block = []
        end
      end
    end

    blocks
  end

  class BaseDoc
    attr_accessor :name
    attr_accessor :modifiers # singleton, abstract
    attr_accessor :description

    protected
    def read_description(lines)
      self.description = ''
      line = nil
      while (line = lines.first) && line[0...1] != '@'
        self.description << line
        lines.shift
      end

      self.description
    end

    def read_tag_raw(lines)
      lines.shift while (line = lines.first) && line[0...1] != '@'
      return nil if lines.empty?

      line = lines.shift
      m = line.match(/^@(?<tag_name>\w+)(\s+(?<text>.*))?/)
      return nil unless m

      tag_name = m['tag_name']
      text = ''
      text << m['text'] if m['text']

      while (line = lines.first) && line[0...1] != '@'
        text << line
        lines.shift
      end

      [tag_name, text]
    end

    def read_tag(lines)
      tag_name, text = read_tag_raw(lines)
      return nil unless tag_name

      case tag_name
        when 'class', 'method'
          { :tag => tag_name, :name => text.strip }
        when 'param'
          m = text.match(/^(?<type>\S+)\s+(?<name>\S+)(\s+(?<desc>.*))?/)
          { :tag => tag_name, :type => m['type'], :name => m['name'], :description => m['desc']}
        when 'property'
          m = text.match(/^(?<type>\S+)\s+(?<name>\S+)/)
          { :tag => tag_name, :type => m['type'], :name => m['name'] }
        when 'return'
          m = text.match(/^(?<type>\S+)(\s+(?<desc>.*))?/)
          { :tag => tag_name, :type => m['type'] }
        when 'singleton', 'public', 'private', 'constructor'
          { :tag => tag_name }
        else
          raise "Unknown tag '#{tag_name}'"
      end
    end

    def read_tags(lines)
      tags = []
      while true
        tag = read_tag(lines)
        break unless tag

        tags << tag
      end

      tags
    end

    public
    def parse(lines)
      lines_dup = lines.dup

      desc = read_description(lines_dup)
      tags = read_tags(lines_dup)

      doc_class = nil

      tags.each do |tag|
        case tag[:tag]
          when 'class'
            doc_class = ClassDoc
          when 'method', 'constructor'
            doc_class = MethodDoc
          when 'property'
            doc_class = PropertyDoc
        end
        break
      end

      raise "Unknown type of block:\n\t#{lines.join("\n\t")}" unless doc_class
    end
  end



  class ClassDoc < BaseDoc
    MODIFIERS = %w(singleton abstract)
    attr_accessor :properties
    attr_accessor :methods

    def singleton?
      modifiers && modifiers.include?('singleton')
    end

    def parse(blocks)
      self.properties = []
      self.methods = []

      blocks = blocks.dup

      # first block is class doc block
      class_doc = blocks.shift
      self.read_description(class_doc)

      self.modifiers = []
      class_doc.each do |line|
        if (m = line.match(/^@class\s+(?<name>.*)$/))
          self.name = m['name']
        elsif (m = line.match(/^@(?<modifier>#{MODIFIERS.join('|')})$/))
          self.modifiers << m['modifier']
        end
      end

      blocks.each do |block|
        i = 0
        while line = block[i] do

          if line.match(/^@property\s+(?<name>.*)$/)
            property_doc = PropertyDoc.new
            property_doc.parse(block)
            self.properties << property_doc
            break
          end

          if line.match(/^@method\s+(?<name>.*)$/)
            method_doc = MethodDoc.new
            method_doc.parse(block)
            self.properties << method_doc
            break
          end

          i += 1
        end

      end
    end
  end

  class PropertyDoc < BaseDoc
    def parse(lines)
      self.read_description(lines)

      lines.each do |line|
        if (m = line.match(/^@property\s+(?<name>.*)$/))
          self.name = m['name']
        end
      end

    end
  end

  class MethodDoc < BaseDoc
    attr_accessor :params
    attr_accessor :return

    # @param [Object] lines
    def parse(lines)
      self.read_description(lines)

      self.params = []

      lines.each_with_index do |line, index|
        if  m = line.match(/^@method\s+(?<name>.*)$/)
          self.name = m['name']

        elsif m = line.match(/^@param\s+(?<name>.*)$/)
          block_param = ''
          #lines.each do |line|

        elsif m = line.match(/^@return\s+(?<name>.*)$/)
          self.return = M
        end

      end

    end
  end

  class MethodParam
    attr_accessor :name
    attr_accessor :type
    attr_accessor :modifiers
    attr_accessor :description
  end

  class MethodReturn
    attr_accessor :type
    attr_accessor :description
  end
end