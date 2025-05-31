document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('editor');
    const toolbarButtons = document.querySelectorAll('.toolbar-btn');
    const titleInput = document.querySelector('.title-input');
    const categorySelect = document.querySelector('.category-select');
    const cancelBtn = document.querySelector('.cancel-btn');
    const publishBtn = document.querySelector('.publish-btn');
    
    // URL 파라미터에서 수정 모드 확인
    const urlParams = new URLSearchParams(window.location.search);
    const isEditMode = urlParams.get('edit') === 'true';
    
    // 수정 모드일 경우 기존 데이터 불러오기
    if (isEditMode) {
        const editingPost = JSON.parse(localStorage.getItem('editingPost'));
        if (editingPost) {
            titleInput.value = editingPost.title;
            categorySelect.value = editingPost.category;
            editor.innerHTML = editingPost.content;
            publishBtn.textContent = '수정하기';
        }
    }

    // 툴바 버튼 
    toolbarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.dataset.command;
            document.execCommand(command, false, null);
        });
    });

    // 취소 버튼
    cancelBtn.addEventListener('click', function() {
        if (isEditMode) {
            localStorage.removeItem('editingPost'); // 임시 데이터 삭제
        }
        if (confirm('작성 중인 내용이 저장되지 않을 수 있습니다. 정말 나가시겠습니까?')) {
            window.location.href = '../index.html';
        }
    });

    // 발행 버튼
    publishBtn.addEventListener('click', function() {
        const title = titleInput.value.trim();
        const category = categorySelect.value;
        const content = editor.innerHTML;

        if (!title) {
            alert('제목을 입력해주세요.');
            return;
        }

        if (!category) {
            alert('카테고리를 선택해주세요.');
            return;
        }

        if (!editor.textContent.trim()) {
            alert('내용을 입력해주세요.');
            editor.focus();
            return;
        }

        try {
            const postData = {
                title,
                category,
                content
            };

            if (isEditMode) {
                // 수정 모드: 기존 글 업데이트
                const editingPost = JSON.parse(localStorage.getItem('editingPost'));
                updatePost(editingPost.id, postData);
                localStorage.removeItem('editingPost'); // 임시 데이터 삭제
            } else {
                // 새 글 작성
                savePost(postData);
            }
            alert('발행되었습니다.');
            
            // 홈 화면으로 이동
            window.location.href = '../index.html';
        } catch (error) {
            console.error('글 저장 중 오류가 발생했습니다:', error);
            alert('글을 저장하는 중 오류가 발생했습니다.');
        }
    });
});
