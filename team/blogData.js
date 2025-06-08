let blogPosts = [];
try {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    }
} catch (error) {
    blogPosts = [];
}

window.savePost = function(post) {
    post.id = Date.now();
    post.createdAt = new Date().toISOString();
    post.views = 0;
    post.likes = 0;
    post.comments = [];
    blogPosts.unshift(post);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    return post;
};
window.getAllPosts = function() {
    return blogPosts;
};
window.getPost = function(id) {
    return blogPosts.find(post => post.id === id);
};
window.deletePost = function(id) {
    blogPosts = blogPosts.filter(post => post.id !== id);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
};
window.updatePost = function(id, updatedPost) {
    const index = blogPosts.findIndex(post => post.id === id);
    if (index !== -1) {
        blogPosts[index] = { ...blogPosts[index], ...updatedPost };
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        return blogPosts[index];
    }
    return null;
};
window.addComment = function(postId, comment) {
    const post = getPost(postId);
    if (post) {
        post.comments = post.comments || [];
        post.comments.push(comment);
        updatePost(postId, { comments: post.comments });
    }
};
