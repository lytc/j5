'<h3>' + this.name + '</h3>' + 
'<div>' + 
  (function(){
    if (this.items) {
      return '<ul>' + 
        (function(){
          var result = '';
          for (var i = 0; i < this.items.length; i++) {
            result += '<li>' + this.items[i].name + '</li>';
          }
          return result;
        })(this) + 
    '</ul>'
    }
  })(this) + 
'</div>'