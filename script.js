// ประกาศตัวแปรเชื่อมโยง DOM Elements ใหม่
const categoryNav = document.getElementById('category-nav');
const productContainer = document.getElementById('product-container');

const popup = document.getElementById('product-popup');
const popupImg = document.getElementById('popup-img');
const popupTextContent = document.getElementById('popup-text-content');
const popupClose = document.getElementById('popup-close');
const themeToggle = document.getElementById('theme-toggle');

let currentAudio = new Audio();
const playPauseBtn = document.getElementById('audio-play-pause');
const audioTimer = document.getElementById('audio-timer');
const volUp = document.getElementById('vol-up');
const volDown = document.getElementById('vol-down');

const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

// เรียกโหลดข้อมูลสินค้าหลัก
fetch('products.json')
    .then(response => response.json())
    .then(products => {
        initCategoryMenu(products); 
        renderProductsByGroup(products); 
    });

// สร้างเมนูแยกประเภทด้านบนแบบอัตโนมัติ
function initCategoryMenu(products) {
    const uniqueCategories = ['ทั้งหมด', ...new Set(products.map(p => p.category))];
    uniqueCategories.forEach((category, index) => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        if(index === 0) btn.classList.add('active'); 

        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterCategorySections(category);
        });
        categoryNav.appendChild(btn);
    });
}

// ดึงสินค้ามาจัดกลุ่มและสร้าง Layout แยกแต่ละประเภทลงในหน้าเดียวกัน
function renderProductsByGroup(products) {
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(category => {
        const section = document.createElement('section');
        section.className = 'category-section';
        section.setAttribute('data-category', category); 

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = category;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'product-grid';

        const categoryProducts = products.filter(p => p.category === category);
        categoryProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-name">
                    <h3>${product.name}</h3>
                </div>
            `;
            card.addEventListener('click', () => openPopup(product));
            grid.appendChild(card);
        });
        section.appendChild(grid);
        productContainer.appendChild(section); 
    });
}

// ควบคุมการซ่อนหรือแสดงเซกชันเมื่อผู้ใช้กดสลับเมนู
function filterCategorySections(selectedCategory) {
    const sections = document.querySelectorAll('.category-section');
    sections.forEach(section => {
        if (selectedCategory === 'ทั้งหมด' || section.getAttribute('data-category') === selectedCategory) {
            section.style.display = 'block'; 
        } else {
            section.style.display = 'none';  
        }
    });
}

// ระบบการทำงานของ Pop-up
function openPopup(product) {
    // [แก้ไขจุดนี้จุดเดียวเท่านั้น] ตรวจสอบรูปภาพเฉพาะของ Pop-up หากไม่มีให้ใช้รูปสินค้าหลักบนหน้าเว็บ
    popupImg.src = product.popupImage ? product.popupImage : product.image;
    
    currentAudio.src = product.audio;
    
    fetch('details.html')
        .then(response => response.text())
        .then(htmlText => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const detailElement = doc.getElementById(product.targetId);
            popupTextContent.innerHTML = detailElement ? detailElement.innerHTML : 'ไม่มีข้อมูลรายละเอียด';
        })
        .catch(() => {
            popupTextContent.innerHTML = 'ไม่สามารถโหลดข้อมูลได้';
        });

    popup.classList.add('active');
    resetAudioControls();
}

function closePopup() {
    popup.classList.remove('active');
    currentAudio.pause();
}
popupClose.addEventListener('click', closePopup);

playPauseBtn.addEventListener('click', () => {
    if (currentAudio.paused) {
        currentAudio.play();
        playPauseBtn.textContent = '⏸';
    } else {
        currentAudio.pause();
        playPauseBtn.textContent = '▶';
    }
});

currentAudio.addEventListener('timeupdate', () => {
    if (!isNaN(currentAudio.duration)) {
        const timeLeft = currentAudio.duration - currentAudio.currentTime;
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = Math.floor(timeLeft % 60).toString().padStart(2, '0');
        audioTimer.textContent = `${minutes}:${seconds}`;

        const progress = currentAudio.currentTime / currentAudio.duration;
        const offset = circumference - (progress * circumference);
        circle.style.strokeDashoffset = offset;
    }
});

currentAudio.addEventListener('ended', resetAudioControls);

function resetAudioControls() {
    playPauseBtn.textContent = '▶';
    audioTimer.textContent = '00:00';
    circle.style.strokeDashoffset = circumference;
}

volUp.addEventListener('click', () => { if(currentAudio.volume < 1) currentAudio.volume = Math.min(1, currentAudio.volume + 0.1); });
volDown.addEventListener('click', () => { if(currentAudio.volume > 0) currentAudio.volume = Math.max(0, currentAudio.volume - 0.1); });

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
});