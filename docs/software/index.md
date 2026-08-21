# 软件资源


<div class="post-grid">


{% for post in blog.posts %}


{% if "software" in post.categories %}


<div class="post-card">


<h3>

<a href="{{post.url}}">

{{post.title}}

</a>

</h3>


<p>

{{post.excerpt}}

</p>


</div>


{% endif %}


{% endfor %}


</div>