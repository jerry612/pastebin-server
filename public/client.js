$(function() {
  $.get("/posts", function(posts) {
    posts.forEach(function(post) {
      $("<li></li>")
        .text(
          post.uuid +
            " " +
            post.cipher_text +
            " " +
            post.expiration +
            " createdAt: " +
            post.createdAt +
            " updatedAt: " +
            post.updatedAt
        )
        .appendTo("ul#users");
    });
  });
});
