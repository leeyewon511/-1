// DOM 요소
let popup = null;
let popupClose = null;
let popupCategory = null;
let popupTitle = null;
let popupViews = null;
let popupComments = null;
let popupBody = null;
let commentsList = null;
let commentInput = null;
let commentSubmit = null;
let currentPostId = null;
let searchInput = null;
let searchButton = null;

// 테마 적용 
function applyTheme(theme) {
    const html = document.documentElement;
    const images = document.querySelectorAll('img, .fa-sun, .fa-moon, [class*="fa-"]');
    
    if (theme === 'dark') {
        html.style.filter = 'invert(100%)';
        // 이미지와 아이콘은 다시 반전시켜 원래 색으로 복원
        images.forEach(img => {
            img.style.filter = 'invert(100%)';
        });
    } else {
        html.style.filter = 'none';
        images.forEach(img => {
            img.style.filter = 'none';
        });
    }
}

// DOM 요소 초기화 
function initializeElements() {
    popup = document.getElementById('post-popup');
    popupClose = document.querySelector('.popup-close');
    popupCategory = document.querySelector('.popup-category');
    popupTitle = document.querySelector('.popup-title');
    popupViews = document.querySelector('.popup-views');
    popupComments = document.querySelector('.popup-comments');
    popupBody = document.querySelector('.popup-body');
    commentsList = document.querySelector('.comments-list');
    commentInput = document.querySelector('.comment-input');
    commentSubmit = document.querySelector('.comment-submit');
    searchInput = document.querySelector('.search-input');
    searchButton = document.querySelector('.search-button');
}

// 검색 
function searchPosts(query) {
    const posts = getAllPosts();
    if (!query) {
        return posts;
    }

    query = query.toLowerCase();
    return posts.filter(post => {
        const title = post.title.toLowerCase();
        const content = post.content.toLowerCase();
        const textContent = content.replace(/<[^>]+>/g, ''); 
        return title.includes(query) || textContent.includes(query);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // 저장된 테마 적용
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // DOM 초기화
    initializeElements();

    // 첫 글 작성하기 버튼 이벤트 설정
    const createPostBtn = document.querySelector('.create-post-btn');
    if (createPostBtn) {
        createPostBtn.addEventListener('click', () => {
            window.location.href = './pages/write.html';
        });
    }

    // 헤더 
    fetch('../components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            // 헤더가 로드된 후에 이벤트 리스너 추가
            setupNavigationEvents();
            // 검색 이벤트 설정
            setupSearchEvents();
        })
        .catch(error => console.error('헤더를 로드하는 중 오류가 발생했습니다:', error));

    // 팝업 닫기 
    if (popupClose) {
        popupClose.addEventListener('click', () => {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentPostId = null;
        });
    }

    // 팝업 외부 클릭 시 닫기
    if (popup) {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
                document.body.style.overflow = 'auto';
                currentPostId = null;
            }
        });
    }

    // ESC 키로 팝업 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup && popup.style.display === 'flex') {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentPostId = null;
        }
    });

    // 댓글 등록 버튼 
    if (commentSubmit) {
        commentSubmit.addEventListener('click', () => {
            if (currentPostId) {
                addComment(currentPostId);
            }
        });
    }

    // 댓글 입력창 엔터키 
    if (commentInput) {
        commentInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (currentPostId) {
                    addComment(currentPostId);
                }
            }
        });
    }

    // 글 목록 표시
    displayPosts();
});

// 네비게이션 이벤트 설정
function setupNavigationEvents() {
    // 현재 페이지 경로에 따라 상대 경로 조정
    const isInPagesDirectory = window.location.pathname.includes('/pages/');
    const prefix = isInPagesDirectory ? '../' : '';

    // 링크 경로 조정
    document.getElementById('home-link').href = prefix;
    document.getElementById('nav-home').href = prefix;
    document.getElementById('nav-write').href = prefix + 'pages/write.html';
    document.getElementById('nav-status').href = prefix + 'pages/status.html';
    document.getElementById('nav-design').href = prefix + 'pages/design.html';

    // 글 작성 페이지 링크 설정
    const writeLinks = document.querySelectorAll('a[href*="write.html"]');
    writeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = prefix + 'pages/write.html';
        });
    });
}

// DOM 
const postList = document.getElementById('post-list');
const emptyState = document.getElementById('empty-state');

// 글 목록 표시 
function displayPosts(searchQuery = '') {
    const posts = searchPosts(searchQuery);
    
    if (posts.length === 0) {
        if (searchQuery) {
            // 검색 결과 없는 경우
            postList.innerHTML = `
                <div class="search-no-results">
                    <div class="empty-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h2>검색 결과가 없습니다</h2>
                    <p>"${searchQuery}"에 대한 검색 결과가 없습니다.</p>
                </div>
            `;
            postList.style.display = 'block';
            emptyState.style.display = 'none';
        } else {
            // 글이 없는 경우
            postList.style.display = 'none';
            emptyState.style.display = 'flex';
        }
    } else {
        postList.style.display = 'grid';
        emptyState.style.display = 'none';
        postList.innerHTML = posts.map(post => createPostCard(post)).join('');
    }
}

// 글 카드 HTML 생성
function createPostCard(post) {
    const date = new Date(post.createdAt);
    const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    
    // 카테고리 한글 변환
    const getCategoryName = (category) => {
        switch(category) {
            case 'tech': return '테크';
            case 'daily': return '일상';
            case 'travel': return '여행';
            case 'food': return '맛집';
            default: return '미분류';
        }
    };

    // 첫 줄 추출
    const getFirstLine = (content) => {
        // HTML 태그 제거
        const textContent = content.replace(/<[^>]+>/g, '');
        // 첫 줄 가져오기
        const firstLine = textContent.split('\n')[0].trim();
        // 첫 줄이 비어있으면 두 번째 줄 시도
        if (!firstLine) {
            const secondLine = textContent.split('\n')[1];
            return secondLine ? secondLine.trim() + ' ...' : '내용 없음';
        }
        return firstLine + ' ...';
    };
    
    // 댓글 수 계산
    const commentCount = post.comments ? post.comments.length : 0;
    
    return `
        <article class="post-card" data-post-id="${post.id}" onclick="showPostPopup(${post.id})">
            <div class="post-content">
                <div class="post-category">${getCategoryName(post.category)}</div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-excerpt">${getFirstLine(post.content)}</p>
                <div class="post-meta">
                    <span class="meta-item">
                        <i class="far fa-eye"></i> ${post.views || 0}
                    </span>
                    <span class="meta-item">
                        <i class="far fa-comment"></i> ${commentCount}
                    </span>
                    <div class="post-actions" onclick="event.stopPropagation()">
                        <button class="edit-btn" onclick="editPost(${post.id})">
                            <i class="fas fa-edit"></i> 수정
                        </button>
                        <button class="delete-btn" onclick="deletePostWithConfirm(${post.id})">
                            <i class="fas fa-trash"></i> 삭제
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

// 글 삭제 확인 및 실행
function deletePostWithConfirm(postId) {
    if (confirm('정말 삭제하시겠습니까?')) {
        deletePost(postId);
        displayPosts(); // 목록 새로고침
    }
}

// 글 수정
function editPost(postId) {
    const post = getPost(postId);
    if (post) {
        // 수정할 글 데이터를 localStorage에 임시 저장
        localStorage.setItem('editingPost', JSON.stringify(post));
        window.location.href = './pages/write.html?edit=true';
    }
}

// 댓글 HTML 생성
function createCommentHTML(comment) {
    const date = new Date(comment.createdAt);
    const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    
    return `
        <div class="comment-item" data-comment-id="${comment.id}">
            <div class="comment-content">${comment.content}</div>
            <div class="comment-meta">
                <span class="comment-date">${formattedDate}</span>
                <button class="comment-delete" onclick="deleteComment(${currentPostId}, ${comment.id})">
                    삭제
                </button>
            </div>
        </div>
    `;
}

// 댓글 목록 표시
function displayComments(postId) {
    const post = getPost(postId);
    if (!post) return;
    
    // comments 배열이 없으면 초기화
    if (!post.comments) {
        post.comments = [];
    }

    commentsList.innerHTML = post.comments
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(comment => createCommentHTML(comment))
        .join('');
    
    popupComments.textContent = post.comments.length;
}

// 댓글 추가
function addComment(postId) {
    const content = commentInput.value.trim();
    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    const post = getPost(postId);
    if (!post) return;

    // 댓글 객체 생성
    const comment = {
        id: Date.now(),
        content: content,
        createdAt: new Date().toISOString()
    };

    // 댓글 배열이 없으면 생성
    if (!post.comments) {
        post.comments = [];
    }

    // 댓글 추가
    post.comments.push(comment);
    updatePost(postId, post);

    // 입력창 초기화
    commentInput.value = '';

    // 댓글 목록 새로고침
    displayComments(postId);
    
    // 글 목록의 댓글 수 업데이트
    displayPosts();
}

// 댓글 삭제
function deleteComment(postId, commentId) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    const post = getPost(postId);
    if (!post || !post.comments) return;

    // 댓글 삭제
    post.comments = post.comments.filter(comment => comment.id !== commentId);
    updatePost(postId, post);

    // 댓글 목록 새로고침
    displayComments(postId);
    
    // 글 목록의 댓글 수 업데이트
    displayPosts();
}

// 글 상세보기 팝업 표시
function showPostPopup(postId) {
    const post = getPost(postId);
    if (!post) return;

    // DOM 요소들이 초기화되지 않았다면 다시 초기화
    if (!popup) {
        initializeElements();
    }

    currentPostId = postId;

    // 조회수 증가
    post.views = (post.views || 0) + 1;
    updatePost(postId, post);

    // 카테고리 한글 변환
    const getCategoryName = (category) => {
        switch(category) {
            case 'tech': return '테크';
            case 'daily': return '일상';
            case 'travel': return '여행';
            case 'food': return '맛집';
            default: return '미분류';
        }
    };

    // 팝업 내용 설정
    popupCategory.textContent = getCategoryName(post.category);
    popupTitle.textContent = post.title;
    popupViews.textContent = post.views;
    popupBody.innerHTML = post.content;

    // 댓글 입력창 초기화
    commentInput.value = '';

    // 댓글 목록 표시
    displayComments(postId);

    // 팝업 표시
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // 글 목록 새로고침 (조회수 업데이트)
    displayPosts();
}

// 검색 이벤트 설정
function setupSearchEvents() {
    const searchContainer = document.getElementById('search-container');
    searchInput = document.querySelector('.search-input');
    searchButton = document.querySelector('.search-button');

    // 현재 페이지가 메인 페이지인지 확인
    const isMainPage = window.location.pathname === '/' || 
                      window.location.pathname === '/index.html' ||
                      window.location.pathname.endsWith('/소개실 기말 2/') ||
                      window.location.pathname.endsWith('/소개실 기말 2/index.html');

    // 메인 페이지일 때만 검색 영역 표시
    if (isMainPage && searchContainer) {
        searchContainer.classList.add('visible');
    }

    if (searchInput && searchButton && isMainPage) {
        // 검색 버튼 클릭 이벤트
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            displayPosts(query);
        });

        // 검색어 입력 필드 엔터키 이벤트
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                displayPosts(query);
            }
        });
    }
} 