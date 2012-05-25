<% function buildParam(params) {
    var result = [], item;
    $.each(params, function(data, name) {
        item = data.type + ' ' + name;
        if (data.optional) item = '[' + item + ']';
        result.push(item);
    });
    return result.join(', ');
} %>

<h2><%= this.class.name %></h2>
<div>Type: <%= this.methods.hasOwnProperty('constructor')? 'Class' : 'Singleton' %> </div>
<p><%= this.class.description %></p>

<h3>Properties:</h3>
<% if (Object.keys(this.properties).length) { %>
    <ul>
        <% $.each(this.properties, function(data, name) { %>
        <li>
            <div><b><%= name %></b> : <b><%= data.type %></b></div>
            <div><%= data.description %></div>
        </li>
        <% }) %>
    </ul>
<% } %>

<h3>Methods:</h3>
<% if (Object.keys(this.methods).length) { %>
    <ul>
        <% $.each(this.methods, function(data, name) { %>
        <li>
            <div>
                <b><%= name %></b>( <%= buildParam(data.params) %> ) : <b><%= data.return %></b>
            </div>
            <div><%= data.description %></div>
        </li>
        <% }) %>
    </ul>
<% } %>