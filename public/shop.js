document.addEventListener("DOMContentLoaded", () => {
  // Zaciąganie bezpiecznych danych z atrybutów HTML
  const dataContainer = document.getElementById('shop-data-container');
  let shopProducts = []; 
  if (dataContainer && dataContainer.dataset.products) {
    shopProducts = JSON.parse(dataContainer.dataset.products);
  }

  const container = document.getElementById('carouselContainer');
  const btnLeft = document.getElementById('scrollLeft');
  const btnRight = document.getElementById('scrollRight');

  if(btnLeft && btnRight && container) {
    btnLeft.addEventListener('click', () => {
      container.scrollBy({ left: -320, behavior: 'smooth' });
    });
    btnRight.addEventListener('click', () => {
      container.scrollBy({ left: 320, behavior: 'smooth' });
    });
  }

  const DEAL_DURATION = 2 * 24 * 60 * 60 * 1000; 

  function updateDealUI(product) {
    if(!product) return;
    
    const imgEl = document.getElementById('deal-img');
    const titleEl = document.getElementById('deal-title');
    const priceEl = document.getElementById('deal-price');
    const linkEl = document.getElementById('deal-link');

    if (imgEl && titleEl && priceEl && linkEl) {
      imgEl.setAttribute('src', product.image);
      titleEl.innerText = product.title;
      priceEl.innerText = product.price;
      linkEl.setAttribute('href', product.olxLink);
    }
  }

  function initializeDeal() {
    let expirationTime = localStorage.getItem('pixelShopDealExpires_v5');
    let savedProduct = localStorage.getItem('pixelShopDealProduct_v5');
    let now = new Date().getTime();

    if (!expirationTime || !savedProduct || now > parseInt(expirationTime)) {
      if (shopProducts && shopProducts.length > 0) {
        const randomProduct = shopProducts[Math.floor(Math.random() * shopProducts.length)];
        expirationTime = now + DEAL_DURATION;
        
        localStorage.setItem('pixelShopDealExpires_v5', expirationTime.toString());
        localStorage.setItem('pixelShopDealProduct_v5', JSON.stringify(randomProduct));
        
        updateDealUI(randomProduct);
      }
    } else {
      updateDealUI(JSON.parse(savedProduct));
    }
  }

  function tick() {
    let expirationTime = localStorage.getItem('pixelShopDealExpires_v5');
    if (!expirationTime) return;

    let now = new Date().getTime();
    let distance = parseInt(expirationTime) - now;

    if (distance < 0) {
      initializeDeal(); 
      distance = DEAL_DURATION;
    }

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('mins');
    const secsEl = document.getElementById('secs');

    if (daysEl && hoursEl && minsEl && secsEl) {
      daysEl.innerText = days.toString().padStart(2, '0');
      hoursEl.innerText = hours.toString().padStart(2, '0');
      minsEl.innerText = minutes.toString().padStart(2, '0');
      secsEl.innerText = seconds.toString().padStart(2, '0');
    }
  }
  if(shopProducts.length > 0) {
    initializeDeal();
    tick(); 
    setInterval(tick, 1000); 
  }
});