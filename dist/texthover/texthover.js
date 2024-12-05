window.onload = function () {
  // Target the section where you want to inject the content
  const targetSection = document.getElementById("dynamic-section");

  // Inject HTML structure dynamically into the targeted section
  if (targetSection) {
    targetSection.innerHTML = `
      <div class="background1">
        <div class="hero-copy">
          <p>
            <span data-imageset="set1">Animation, sculpture, or game?</span> Each idea felt right—then wrong.
            What if it’s not good enough? What if I choose wrong?
            <span data-imageset="set2">Trapped in decision paralysis</span>, I turned the confusion into my project,
            using <span data-imageset="set3">motion</span> to give shape to my indecision.
          </p>
        </div>
        <div class="container1">
          <div class="gallery">
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
          </div>
        </div>
      </div>
    `;
  }

  // Inline CSS using JavaScript
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .background1 {
      position: relative;
      width: 100vw;
      height: 1080px;
      font-family: "Timmons NY", sans-serif;
      background: #000;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .container1 {
      position: relative;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      pointer-events: none;
    }
    .gallery {
      pointer-events: none;
    }
    .item {
      pointer-events: none;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 70px;
      margin: 10px;
      opacity: 0;
    }
    .hero-copy {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .hero-copy p {
    font-size: 50px; /* Default for larger screens */
    font-family: "FK Grotesk Neue";
    color: #a8a8a8;
    text-align: center;
    letter-spacing: -0.04em;
    line-height: 110%;
}

/* Media Query for Mobile Devices */
@media screen and (max-width: 768px) {
    .hero-copy p {
        font-size: 32px; /* Reduce the font size for better readability on small screens */
        line-height: 120%; /* Increase line height for improved readability */
    }
}

@media screen and (max-width: 480px) {
    .hero-copy p {
        font-size: 18px; /* Further reduce for very small screens */
        line-height: 130%; /* Further increase line height to ensure comfortable reading */
    }
}
    .hero-copy p span {
      cursor: pointer;
      color: #fff;
      font-family: "FK Raster Grotesk";
      position: relative;
      z-index: 1;
      display: inline-block;
    }
    .hero-copy p span:hover {
      color: #00999e;
    }
  `;
  document.head.appendChild(styleElement);

  // Original JavaScript functionality starts here (unchanged)
  const items = document.querySelectorAll(".item");
  const container = document.querySelector(".container1");
  const spans = document.querySelectorAll(".hero-copy span");
  const numberOfItems = items.length;
  const angleIncrement = (2 * Math.PI) / numberOfItems;
  const radius = 300;
  let currentAngle = 0;
  let isMouseOverSpan = false;
  let targetX = 0,
    targetY = 0;
  let currentX = 0,
    currentY = 0;

  let imageSets = {};

  // Fetch imageSets.json file from the texthover folder
  fetch("/texthover/imagesSets.json")
    .then(response => response.json())
    .then(data => {
      imageSets = data;
    })
    .catch(error => {
      console.error("Error loading image sets:", error);
    });

  const loadImages = (set) => {
    if (!imageSets[set]) return;
    items.forEach((item, index) => {
      if (index < imageSets[set].length) {
        let img = item.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          item.appendChild(img);
        }
        img.src = imageSets[set][index];
        img.alt = `Image ${index + 1}`;
      }
    });
  };

  const updateGallery = (mouseX, mouseY, show = true) => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    targetX = mouseX;
    targetY = mouseY;

    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    items.forEach(function (item, index) {
      const angle = currentAngle + index * angleIncrement;
      const x = currentX + radius * Math.cos(angle) - item.offsetWidth / 2;
      const y = currentY + radius * Math.sin(angle) - item.offsetHeight / 2;

      gsap.to(item, {
        x: x,
        y: y,
        opacity: show ? 1 : 0,
        duration: 0.5,
        ease: "power1.out",
      });
    });

    window.scrollTo(scrollX, scrollY);
  };

  spans.forEach((span) => {
    span.addEventListener("mouseenter", (e) => {
      const set = span.dataset.imageset;
      if (set) {
        loadImages(set);
      }
      isMouseOverSpan = true;
      updateGallery(e.clientX, e.clientY, true);
    });

    span.addEventListener("mousemove", (e) => {
      if (isMouseOverSpan) {
        targetX = e.clientX - 800;
        targetY = e.clientY - 450;
      }
    });

    span.addEventListener("mouseleave", () => {
      isMouseOverSpan = false;
      updateGallery(0, 0, false);
    });
  });

  gsap.ticker.add(() => {
    currentAngle += 0.005;
    if (currentAngle > 2 * Math.PI) {
      currentAngle -= 2 * Math.PI;
    }
    if (isMouseOverSpan) {
      updateGallery(targetX, targetY, true);
    }
  });

  document.querySelectorAll(".hero-copy span").forEach((span) => {
    span.addEventListener("mouseenter", () => {
      span.parentNode.style.color = "#545454";
    });

    span.addEventListener("mouseleave", () => {
      span.parentNode.style.color = "#fff";
    });
  });
};
