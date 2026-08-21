---
hide:
  - navigation
  - toc
---

<div class="home-banner">
</div>





# 最新发布


<div class="latest-list">


{% for post in blog.posts[:8] %}


<div class="latest-item">


<div class="latest-cover">


<img src="/blog/assets/images/default.jpg">


</div>



<div class="latest-info">


<h2>

<a href="{{post.url}}">

{{post.title}}

</a>

</h2>



<p>

{{post.excerpt}}

</p>



<div class="date">

发布时间：
{{post.meta.date}}

</div>


</div>



</div>


{% endfor %}


</div>
