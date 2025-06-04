document.addEventListener("DOMContentLoaded", function () {
  // Mảng chứa các dòng chữ
  const texts = [
    "Anh yêu em!",
    "vui khi có Khuê bên cạnh",
    "Ba năm tuyệt vời!",
    "Tình yêu là sự chia sẻ",
    "Hôm nay, ngày của chúng ta",
    "Mãi bên nhau",
    "Trái tim này thuộc về em",
    "Ngọt ngào như mây hồng",
    "Dẫu gian nan vẫn yêu",
    "Cảm ơn vì luôn bên anh",
    "cảm ơn vì tất cả",
    " very thank kiu ",
    "I like u",
  ];

  // Mảng chứa URL ảnh mẫu
  const images = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "10.jpg",
    "11.jpg",
  ];

  // Hàm lựa chọn nội dung cho một falling item.
  // Phân phối:
  // • 50% chữ thông thường.
  // • 15% ảnh.
  // • 20% rose (loại "cánh hoa hồng" – sử dụng emoji 🌹).
  // • 15% heart (emoji ❤️).
  function getRandomContent() {
    const r = Math.random();
    if (r < 0.5) {
      return { type: "text", content: texts[Math.floor(Math.random() * texts.length)] };
    } else if (r < 0.65) {
      return { type: "image", content: images[Math.floor(Math.random() * images.length)] };
    } else if (r < 0.85) {
      return { type: "rose", content: "🌹" };
    } else {
      return { type: "heart", content: "❤️" };
    }
  }

  const container = document.getElementById("container");
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  
  // Giảm mật độ falling items (ví dụ: 50 items)
  const totalItems = 70;
  const items = [];

  // Hàm tạo falling item.
  // Các item có vị trí ban đầu ngẫu nhiên trong khung hiển thị.
  // Tốc độ rơi được tính sao cho một item mất khoảng 4-5 giây từ đầu đến cuối màn hình.
  // Nếu item là rose hoặc heart, ta đặt thêm các thuộc tính để flutter:
  // • baseLeft: vị trí left ban đầu.
  // • phase: giá trị ban đầu cho hàm sin.
  // • amp: biên độ (số pixel lệch ngang, ví dụ 30px).
  // • freq: tần số (rad/s, ví dụ khoảng 1-2 rad/s).
  function createFallingItem() {
    const itemEl = document.createElement("div");
    itemEl.classList.add("falling");

    const content = getRandomContent();
    let isFlutter = false;
    if (content.type === "text") {
      itemEl.textContent = content.content;
    } else if (content.type === "image") {
      const img = document.createElement("img");
      img.src = content.content;
      itemEl.appendChild(img);
    } else if (content.type === "rose") {
      itemEl.textContent = content.content;
      itemEl.classList.add("rose");
      isFlutter = true;
    } else if (content.type === "heart") {
      itemEl.textContent = content.content;
      itemEl.classList.add("heart");
      isFlutter = true;
    }
    
    // Random vị trí left và top ban đầu nằm trong khung hiển thị
    const left = Math.random() * containerWidth;
    const top = Math.random() * containerHeight;
    itemEl.style.left = left + "px";
    itemEl.style.top = top + "px";
    
    // Tính toán thời gian rơi từ 4 đến 5 giây; tốc độ = containerHeight/duration (pixel/giây)
    const duration = 4 + Math.random();
    const speed = containerHeight / duration;
    
    container.appendChild(itemEl);
    
    const item = { 
      element: itemEl, 
      top: top, 
      left: left, 
      speed: speed, 
      isFlutter: isFlutter 
    };
    // Nếu là loại flutter (rose, heart), lưu lại baseLeft cùng với các thuộc tính flutter
    if (isFlutter) {
      item.baseLeft = left;
      item.phase = Math.random() * 2 * Math.PI;  // giá trị ban đầu cho sin
      item.amp = 30;                             // biên độ lệch ngang (px)
      item.freq = 1 + Math.random();             // tần số (rad/s)
    }
    return item;
  }

  // Tạo falling items ban đầu
  for (let i = 0; i < totalItems; i++) {
    items.push(createFallingItem());
  }

  // Vòng lặp cập nhật vị trí từng falling item
  let lastTime = performance.now();
  function update() {
    const now = performance.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    
    items.forEach((item) => {
      // Cập nhật vị trí top theo tốc độ
      item.top += item.speed * dt;
      if (item.top > containerHeight) {
        // Khi vượt qua dưới cùng, reset top về -50 và random lại vị trí left (cho cả loại flutter)
        item.top = -50;
        const newLeft = Math.random() * containerWidth;
        item.left = newLeft;
        if (item.isFlutter) {
          item.baseLeft = newLeft;
          // Random lại phase, freq nếu muốn thêm ngẫu nhiên
          item.phase = Math.random() * 2 * Math.PI;
          item.freq = 1 + Math.random();
        } else {
          item.element.style.left = newLeft + "px";
        }
      }
      // Gán giá trị top chạy mượt
      item.element.style.top = item.top + "px";
      
      // Nếu là item flutter (rose hoặc heart), tính hiệu ứng xoay ngang với hàm sin
      if (item.isFlutter) {
        item.phase += item.freq * dt; // tăng phase dựa trên tần số
        const effectiveLeft = item.baseLeft + item.amp * Math.sin(item.phase);
        item.element.style.left = effectiveLeft + "px";
      }
    });
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);

  // --- Phần xoay màn hình nhẹ dùng ngón tay ---
  // Cho phép xoay container nhẹ (tối đa ±20°) theo cả trục X và Y, sau khi thả tay sẽ tự hoàn lại trạng thái ban đầu.
  const maxRotation = 20;
  const rotateFactor = 0.1;  // chuyển đổi sự di chuyển pixel thành độ xoay
  let isRotating = false;
  let startX = 0, startY = 0;
  let currentRotX = 0, currentRotY = 0;
  
  // Sự kiện touch (của điện thoại)
  container.addEventListener("touchstart", (e) => {
    isRotating = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    container.style.transition = "none";
  });
  container.addEventListener("touchmove", (e) => {
    if (!isRotating) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    currentRotY = Math.max(-maxRotation, Math.min(maxRotation, dx * rotateFactor));
    currentRotX = Math.max(-maxRotation, Math.min(maxRotation, -dy * rotateFactor));
    container.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    e.preventDefault();
  });
  container.addEventListener("touchend", () => {
    isRotating = false;
    container.style.transition = "transform 0.5s ease-out";
    container.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
  
  // Hỗ trợ chuột (nếu cần test trên desktop)
  container.addEventListener("mousedown", (e) => {
    isRotating = true;
    startX = e.clientX;
    startY = e.clientY;
    container.style.transition = "none";
  });
  container.addEventListener("mousemove", (e) => {
    if (!isRotating) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    currentRotY = Math.max(-maxRotation, Math.min(maxRotation, dx * rotateFactor));
    currentRotX = Math.max(-maxRotation, Math.min(maxRotation, -dy * rotateFactor));
    container.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
    startX = e.clientX;
    startY = e.clientY;
  });
  container.addEventListener("mouseup", () => {
    isRotating = false;
    container.style.transition = "transform 0.5s ease-out";
    container.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
  container.addEventListener("mouseleave", () => {
    isRotating = false;
    container.style.transition = "transform 0.5s ease-out";
    container.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});