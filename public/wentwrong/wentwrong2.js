document.addEventListener("DOMContentLoaded", function () {
    const wentWrongSections = document.querySelectorAll(".wentwrong-section0");
  
    wentWrongSections.forEach((wentWrongSection, sectionIndex) => {
      if (wentWrongSection) {
        wentWrongSection.innerHTML = `
          <section class="pinned wentwrong-pinned-${sectionIndex}">
            <div class="sticky-header1">
              <h1>Initial Concept</h1>
            </div>
            <div class="progress-bar progress-bar-${sectionIndex}">
              <div class="progress progress-${sectionIndex}"></div>
            </div>
            <div class="card1" id="card-1-${sectionIndex}">
            <div class="gif-background"></div>
              <div class="card-phase"><p>#InitialConcept</p></div>
              <div class="card-title">
                // <p>Animation</p>
                // <h1>GSAP Scroll triggers</h1>
              </div>
            </div>
            </div>
          </section>
        `;
  
        // Add CSS dynamically
        const style = document.createElement("style");
        style.innerHTML = `
          ::-webkit-scrollbar {
            display: none;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          section {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            background-color: #000;
          }
          
          .sticky-header1 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 1;
          }
          
          .sticky-header1 h1 {
            font-size: 10vw;
            font-weight: lighter;
            color: #00999e;
            // -webkit-text-stroke: 2px #fff;
            text-align: center;
          }
          
          .gif-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/wentwrong/assets/concept.gif') no-repeat center center;
  background-size: cover; /* Ensures the GIF covers the entire element */
  z-index: 1; /* Send it to the back */
}
          .card1c {
            position: absolute;
            top: 150%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(0deg);
            width: 40%;
            height: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #000;
            border-radius: 1em;
            will-change: transform;
            overflow: hidden;
          }
          
          #card1c {
            background-size: cover;
            border: 2px solid rgba(125, 216, 205, 0.35);
          }
          
          #card1c {
    width: 300px;  /* Set width */
    height: 200px; /* Set height */
    background-image: url('/wentwrong/assets/concept.gif');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover; /* Optional but helps in fitting */
}
        
          
          .card-phase {
            position: absolute;
            top: 1em;
            left: 50%;
            transform: translateX(-50%);
            padding: 0.125em 0.25em;
            border-radius: 0.25em;
            background-color: #00999e;
            color: #000;
          }
          
          .card-phase p {
            font-size: 24px;
          }
          
          .card-title {
            text-align: center;
            color: #00999e;
          }
          
          .card-title p {
            font-size: 36px;
          }
          
          .card-title h1 {
            font-size: 80px;
            font-weight: lighter;
            line-height: 90%;
          }
          
          .card-title h1 span {
            color: #00999e;
            // -webkit-text-stroke: 1.25px #fff;
          }
          
          .progress-bar {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 100%;
            background-color: #000;
            opacity: 0;
          }
          
          .progress-bar::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgb(0, 0, 0);
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 1) 0%,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 0) 0%,
              rgba(0, 0, 0, 1) 0%
            );
          }
          
          .progress {
            width: 100%;
            height: 0%;
            background-color: #353531;
          }
        `;
        document.head.appendChild(style);
  
        // JavaScript functionality for each section
        gsap.registerPlugin(ScrollTrigger);
  
        const stickyHeader = wentWrongSection.querySelector(".sticky-header1");
        const cards = wentWrongSection.querySelectorAll(".card1");
        const progressBarContainer = wentWrongSection.querySelector(`.progress-bar-${sectionIndex}`);
        const progressBar = wentWrongSection.querySelector(`.progress-${sectionIndex}`);
        const cardCount = cards.length;
  
        const startRotations = [0, 5, 0, -5];
        const endRotations = [-10, -5, 10, 5];
        const progressColors = ["#00999e", "#00999e", "#00999e"];
  
        gsap.set(cards, (index) => ({ rotation: startRotations[index] }));
  
        let isProgressBarVisible = false;
  
        ScrollTrigger.create({
          trigger: wentWrongSection.querySelector(`.wentwrong-pinned-${sectionIndex}`),
          start: "top top",
          end: `+=${window.innerHeight * cardCount}`,
          pin: true,
          pinSpacing: true,
          onLeave: () => gsap.to(progressBarContainer, { opacity: 0, duration: 0.5 }),
          onEnterBack: () => gsap.to(progressBarContainer, { opacity: 1, duration: 0.5 }),
          onUpdate: (self) => {
            const progress = self.progress * (cardCount + 1);
            const currentCard = Math.floor(progress);
  
            if (progress <= 1) {
              gsap.to(stickyHeader, { opacity: 1 - progress, duration: 0.1 });
            } else {
              gsap.set(stickyHeader, { opacity: 0 });
            }
  
            if (progress > 1 && !isProgressBarVisible) {
              gsap.to(progressBarContainer, { opacity: 1, duration: 0.5 });
              isProgressBarVisible = true;
            } else if (progress <= 1 && isProgressBarVisible) {
              gsap.to(progressBarContainer, { opacity: 0, duration: 0.5 });
              isProgressBarVisible = false;
            }
  
            let progressHeight = 0;
            if (progress > 1) {
              progressHeight = ((progress - 1) / cardCount) * 100;
            }
  
            gsap.to(progressBar, {
              height: `${progressHeight}%`,
              backgroundColor: progressColors[Math.min(currentCard - 1, cardCount - 1)],
              duration: 0.3,
            });
  
            cards.forEach((card, index) => {
              if (index < currentCard) {
                gsap.set(card, { top: "50%", rotation: endRotations[index] });
              } else if (index === currentCard) {
                const cardProgress = progress - currentCard;
                const newTop = gsap.utils.interpolate(150, 50, cardProgress);
                const newRotation = gsap.utils.interpolate(
                  startRotations[index],
                  endRotations[index],
                  cardProgress
                );
                gsap.set(card, { top: `${newTop}%`, rotation: newRotation });
              } else {
                gsap.set(card, { top: "150%", rotation: startRotations[index] });
              }
            });
          },
        });
      }
    });
  });
  