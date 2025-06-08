document.addEventListener('DOMContentLoaded', function() {
    // 현재 테마 설정 불러오기
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.querySelector(`input[value="${currentTheme}"]`).checked = true;

    // 테마 변경 이벤트
    document.querySelectorAll('input[name="theme"]').forEach(input => {
        input.addEventListener('change', function() {
            applyTheme(this.value);
        });
    });

    // 저장 버튼 클릭 이벤트
    document.getElementById('save-design').addEventListener('click', function() {
        const selectedTheme = document.querySelector('input[name="theme"]:checked').value;
        localStorage.setItem('theme', selectedTheme);
        applyTheme(selectedTheme);
        alert('설정이 저장되었습니다.');
    });
});

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