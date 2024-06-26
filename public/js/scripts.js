document.addEventListener("DOMContentLoaded", () => {
    // 데이터 로드 및 초기 표시
    fetch('./js/data/restaurant.json')
        .then(res => res.json())
        .then(data => displayRestaurants(data)); // 처음에 모든 식당 정보를 로드
});

function applyFilters() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const selectedTags = Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(input => input.value);
    const selectedPriceRange = document.querySelector('input[name="priceRange"]:checked')?.value;
    const parkingAvailable = document.getElementById('parkingAvailable').checked;

    const filters = {
        searchInput,
        selectedTags,
        selectedPriceRange,
        parkingAvailable
    };

    fetch('/api/restaurants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
    })
    .then(response => response.json())
    .then(data => {
        displayRestaurants(data);
    });
}

function displayRestaurants(restaurants) {
    document.querySelector(".justify-content-center").innerHTML = ''; // 컨테이너 초기화
    
    restaurants.forEach(restaurant => {
        const container = document.querySelector(".justify-content-center");

        const element = document.createElement('div');
        element.className = 'col mb-5';
        let inner = `
            <div class="card h-100">
                <img class="card-img-top" src="${restaurant.image || 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg'}" alt="${restaurant.name}" height="170" />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${restaurant.name}</h5>
                        <div class="d-flex justify-content-center small text-warning mb-2">
                            <div class="bi-star-fill"></div>
                            <span class="text-muted">${restaurant.rating.toFixed(1)}</span>
                        </div>
                        <div class="tags mb-2">${restaurant.tag.join(', ')}</div>
                        <div class="price-range mb-2">가격대 : ${restaurant.priceRange}</div> <!-- 가격 범위를 <div>로 변경 -->
                        <p>${restaurant.location}</p>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="restaurant/${restaurant.id}">View details</a></div>
                </div>
        `;
        if(restaurant.additionalServices.includes("주차 가능")) {
            inner += `<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Parking</div>`;
        }
        inner += `</div>`;
        element.innerHTML = inner;
        container.appendChild(element);
    });
}

// 로그인 시 로그아웃 버튼, 마이베이지 생성
window.addEventListener("load", () => {
    if(document.cookie.includes('USER')){
        const button = document.querySelector("#login-button");
        button.onclick = () => {location.href='/logout';};
        button.innerHTML = `<i class="bi-person-circle me-1"></i>Logout`;

        const mypage = document.querySelector("#hidden-item");
        mypage.style.visibility = "visible";
    }
});
