document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('writeForm');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const cancelBtn = document.getElementById('cancelBtn');

    cancelBtn.addEventListener('click', function() {
        if (confirm('작성 중인 내용이 저장되지 않을 수 있습니다. 정말 나가시겠습니까?')) {
            window.location.href = './index.html';
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        if (!title) return alert('제목을 입력해주세요.');
        if (!content) return alert('내용을 입력해주세요.');
        savePost({ title, category: '', content });
        alert('발행되었습니다.');
        window.location.href = './index.html';
    });
});
