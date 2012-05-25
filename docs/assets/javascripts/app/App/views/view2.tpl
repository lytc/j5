<h2>Class <%= this.class.name %></h2>
<p><%= this.class.description %></p>

<h3>Properties:</h3>
<% if (this.properties): %>
    <ul>
        <% for (var i = 0; i < this.properties.length; i++): %>
        <li>
            <div><b><%= this.properties[i].name %></b> : <b><%= this.properties[i].type %></b><div>
            <div><%= this.properties[i].description %></div>
        </li>
        <% endfor %>
    </ul>
<% endif %>

<h3>Methods:</h3>
<% if (this.methods): %>
    <ul>
        <% for (var i = 0; i < this.methods.length; i++): %>
        <li>
            <div><b><%= this.methods[i].name %></b> : <b><%= this.methods[i].return %></b><div>
            <div><%= this.methods[i].description %></div>
        </li>
        <% endfor %>
    </ul>
<% endif %>