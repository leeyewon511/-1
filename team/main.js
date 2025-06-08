// 헤더 fetch (경로 자동) + "첫 글 작성하기" 버튼 이벤트 연결
(function(){
    const headerPath = location.pathname.includes('/pages/') ? '../components/header.html' : './components/header.html';
    fetch(headerPath)
        .then(res => res.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            // 헤더가 삽입된 뒤에 버튼 이벤트 연결!
            attachCreatePostBtnEvent();
        });
})();

function attachCreatePostBtnEvent() {
    // index.html에만 있는 버튼이므로, 없으면 무시
    const createBtn = document.querySelector('.create-post-btn');
    if (createBtn) {
        createBtn.onclick = () => {
            location.href = './글작성페이지.html';
        };
    }
}

// 테마 적용 함수
function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
        html.classList.add('dark-mode');
    } else {
        html.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
}

// 테마 라디오 버튼 이벤트 (디자인 설정 페이지에서만)
document.addEventListener('DOMContentLoaded', function() {
    const themeInputs = document.querySelectorAll('input[name="theme"]');
    themeInputs.forEach(input => {
        input.addEventListener('change', function() {
            applyTheme(this.value);
        });
    });
    const saveBtn = document.getElementById('save-design');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
            localStorage.setItem('theme', selectedTheme);
            applyTheme(selectedTheme);
            alert('설정이 저장되었습니다.');
        });
    }
    // 테마 적용
    const theme = localStorage.getItem('theme') || 'light';
    applyTheme(theme);
});

// 글 목록 표시 (index.html)
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('post-list')) return;
    const posts = getAllPosts();
    const postList = document.getElementById('post-list');
    const emptyState = document.getElementById('empty-state');
    if (posts.length === 0) {
        emptyState.style.display = 'block';
        postList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        postList.style.display = 'block';
        postList.innerHTML = '';
        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post-item';
            div.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.category} | ${new Date(post.createdAt).toLocaleString()}</p>
                <button class="view-btn" data-id="${post.id}">보기</button>
            `;
            postList.appendChild(div);
        });
        postList.querySelectorAll('.view-btn').forEach(btn => {
            btn.onclick = function() {
                showPostPopup(Number(this.dataset.id));
            };
        });
    }
});

// 글 상세 팝업
function showPostPopup(id) {
    const post = getPost(id);
    if (!post) return;
    const popup = document.getElementById('post-popup');
    popup.querySelector('.popup-title').textContent = post.title;
    popup.querySelector('.popup-category').textContent = post.category;
    popup.querySelector('.popup-body').innerHTML = post.content;
    popup.querySelector('.popup-views').textContent = post.views;
    popup.querySelector('.popup-comments').textContent = (post.comments||[]).length;
    const commentsList = popup.querySelector('.comments-list');
    commentsList.innerHTML = '';
    (post.comments||[]).forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.textContent = c;
        commentsList.appendChild(div);
    });
    popup.querySelector('.comment-submit').onclick = function() {
        const input = popup.querySelector('.comment-input');
        if (input.value.trim()) {
            addComment(post.id, input.value.trim());
            input.value = '';
            showPostPopup(post.id);
        }
    };
    popup.style.display = 'flex';
    popup.querySelector('.popup-close').onclick = function() {
        popup.style.display = 'none';
    };
}
