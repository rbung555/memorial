const params = new URLSearchParams(window.location.search);
const id = params.get("id") || 1;

const product = products[id];

if(product){
    //document.getElementById("productTitle").innerText = product.title;
    document.getElementById("productImage").src = product.image;
    document.getElementById("audio").src = product.audio;
    document.title = product.title;
}else{
    document.body.innerHTML = "<h2 style='color:white'>Product not found</h2>";
}


// ===== Navigation =====

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const homeBtn = document.getElementById("homeBtn");

const currentId = parseInt(id);
const maxId = Object.keys(products).length;

prevBtn.addEventListener("click", () => {
    if (currentId > 1) {
        window.location.href = "?id=" + (currentId - 1);
    }
});

nextBtn.addEventListener("click", () => {
    if (currentId < maxId) {
        window.location.href = "?id=" + (currentId + 1);
    }
});

homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});