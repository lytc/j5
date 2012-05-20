<a pushstate href="/posts/add">Add</a>
<h3>Post List</h3>
<% if (this.items): %>
  <ul>
    <% for (var i = 0; i < this.items.length; i ++): %>
    <li><a pushstate href="/posts/<%= this.items[i].id %>"><%= this.items[i].name %></a></li>
    <% endfor %>
  </ul>
<% endif %>