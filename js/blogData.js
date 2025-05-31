// 블로그 글 데이터 저장
let blogPosts = [];

// 초기 데이터 로드
try {
    const savedPosts = localStorage.getItem('blogPosts');
    if (savedPosts) {
        blogPosts = JSON.parse(savedPosts);
    }
} catch (error) {
    console.error('저장된 글을 불러오는 중 오류가 발생했습니다:', error);
    blogPosts = [];
}

// 글 저장 
window.savePost = function(post) {
    try {
        // 현재 시간을 기준으로 ID 생성
        post.id = Date.now();
        post.createdAt = new Date().toISOString();
        post.views = 0;
        post.likes = 0;
        post.comments = 0;

        blogPosts.unshift(post); // 배열 맨 앞에 추가
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        return post;
    } catch (error) {
        console.error('글 저장 중 오류가 발생했습니다:', error);
        throw error;
    }
};

// 모든 글 가져오기
window.getAllPosts = function() {
    try {
        return blogPosts;
    } catch (error) {
        console.error('글 목록을 가져오는 중 오류가 발생했습니다:', error);
        return [];
    }
};

// 특정 글 가져오기
window.getPost = function(id) {
    try {
        return blogPosts.find(post => post.id === id);
    } catch (error) {
        console.error('글을 가져오는 중 오류가 발생했습니다:', error);
        return null;
    }
};

// 글 삭제
window.deletePost = function(id) {
    try {
        blogPosts = blogPosts.filter(post => post.id !== id);
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    } catch (error) {
        console.error('글을 삭제하는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

// 글 수정
window.updatePost = function(id, updatedPost) {
    try {
        const index = blogPosts.findIndex(post => post.id === id);
        if (index !== -1) {
            blogPosts[index] = { ...blogPosts[index], ...updatedPost };
            localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
            return blogPosts[index];
        }
        return null;
    } catch (error) {
        console.error('글을 수정하는 중 오류가 발생했습니다:', error);
        throw error;
    }
}; 