# 综合资源


<div class="post-grid">


{% for post in blog.posts[:16] %}


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


{% endfor %}


</div>