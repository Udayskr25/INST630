document.addEventListener("DOMContentLoaded", () => {
    // Inject CSS into the document
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      @font-face {
        font-family: "Big Shoulders Display";
        src: url("./marque/fonts/BigShouldersDisplay.ttf") format("woff2-variations");
      }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
  
      .container4 {
        width: 100%;
        height: 100%;
        font-family: "Big Shoulders Display";
        overflow-x: hidden;
      }
  
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
  
      p-1 {
        font-size: 42px;
        font-weight: 500;
        text-transform: uppercase;
      }
  
      section {
        width: 100%;
        height: 100vh;
      }
  
      section.marquees {
        height: 150vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #fff;
      }
  
      .marquee-container {
        position: relative;
        width: 125%;
        height: 250px;
        display: flex;
        gap: 1em;
        margin-bottom: 1em;
        overflow: hidden;
      }
  
      .marquee {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        display: flex;
        gap: 1em;
      }
  
      #marquee-1 .marquee,
      #marquee-3 .marquee {
        left: -15%;
      }
  
      .item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }
  
      .item.with-text {
        flex: 1.5;
      }
  
      .item h1 {
        text-transform: uppercase;
        font-size: 140px;
      }
  
      @media (max-width: 900px) {
        section.marquees {
          height: 100vh;
        }
  
        .marquee-container {
          width: 250%;
          height: 150px;
        }
  
        #marquee-2 .marquee,
        #marquee-4 .marquee {
          left: -35%;
        }
  
        .item.with-text {
          flex: 1;
        }
  
        .item h1 {
          font-size: 60px;
        }
      }
  
      /* lenis scroll */
      html.lenis,
      html.lenis body {
        height: auto;
      }
  
      .lenis.lenis-smooth {
        scroll-behavior: auto !important;
      }
  
      .lenis.lenis-smooth [data-lenis-prevent] {
        overscroll-behavior: contain;
      }
  
      .lenis.lenis-stopped {
        overflow: hidden;
      }
  
      .lenis.lenis-smooth iframe {
        pointer-events: none;
      }
    `;
    document.head.appendChild(styleElement);
  
    // Fetch data from JSON file
    fetch('./marque/images.json')
      .then(response => response.json())
      .then(data => {
        const marqueeSection = document.querySelector('.marquees');
  
        data.marquees.forEach(marqueeData => {
          // Create marquee container
          const marqueeContainer = document.createElement('div');
          marqueeContainer.classList.add('marquee-container');
          marqueeContainer.id = marqueeData.id;
  
          const marquee = document.createElement('div');
          marquee.classList.add('marquee');
  
          // Create items for the marquee
          marqueeData.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
  
            if (item.type === 'image') {
              const img = document.createElement('img');
              img.src = item.src;
              img.alt = '';
              itemElement.appendChild(img);
            } else if (item.type === 'text') {
              itemElement.classList.add('with-text');
              const h1 = document.createElement('h1');
              h1.textContent = item.content;
              itemElement.appendChild(h1);
            }
  
            marquee.appendChild(itemElement);
          });
  
          marqueeContainer.appendChild(marquee);
          marqueeSection.appendChild(marqueeContainer);
        });
  
        // JavaScript animations and GSAP ScrollTrigger setup
        gsap.registerPlugin(ScrollTrigger);
  
        function animateChars(chars, reverse = false) {
          const staggerOptions = {
            each: 0.35,
            from: reverse ? "start" : "end",
            ease: "linear",
          };
  
          gsap.fromTo(
            chars,
            { fontWeight: 100 },
            {
              fontWeight: 900,
              duration: 1,
              ease: "none",
              stagger: staggerOptions,
              scrollTrigger: {
                trigger: chars[0].closest(".marquee-container"),
                start: "50% bottom",
                end: "top top",
                scrub: true,
              },
            }
          );
        }
  
        const splitText = new SplitType(".item h1", { types: "chars" });
  
        const marqueeContainers = document.querySelectorAll(".marquee-container");
  
        marqueeContainers.forEach((container, index) => {
          let start = "0%";
          let end = "-15%";
  
          if (index % 2 === 0) {
            start = "0%";
            end = "10%";
          }
  
          const marquee = container.querySelector(".marquee");
          const words = marquee.querySelectorAll(".item h1");
  
          gsap.fromTo(
            marquee,
            {
              x: start,
            },
            {
              x: end,
              scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "150% top",
                scrub: true,
              },
            }
          );
  
          words.forEach((word) => {
            const chars = Array.from(word.querySelectorAll(".char"));
            if (chars.length) {
              const reverse = index % 2 !== 0;
              animateChars(chars, reverse);
            }
          });
        });
  
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      })
      .catch(error => {
        console.error('Error fetching JSON data:', error);
      });
  });
  