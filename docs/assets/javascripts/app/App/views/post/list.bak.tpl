<h3><%= this.name %></h3>
<div>
  <% if (this.items): %>
  <ul>
    <% for (var i = 0, item; i < this.items.length, item = this.items[i]; i++): %>
    <li>
      <%= item.name %>
      <% if (item.items): %>
      <ul>
        <% for (var j = 0; j < item.items.length; j++): %>
        <li><%= item.items[j].name %></li>
        <% endfor %>
      </ul>
      <% endif %>
    </li>
    <% endfor %>
  </ul>
  <% endif %>
</div>