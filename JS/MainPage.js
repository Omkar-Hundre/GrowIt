// ------------------------Carousel----------------------------------------------------------------

const carousels = document.querySelectorAll(".card_slider");

carousels.forEach((cardSlider) => {
  const carousel = cardSlider.querySelector(".carousel");
  const firstCardWidth = carousel.querySelector(".card").offsetWidth;
  const arrowBtns = cardSlider.querySelectorAll("i");
  const carouselChildrens = [...carousel.children];

  let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

  let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

  carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

  carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  });

  carousel.classList.add("no-transition");
  carousel.scrollLeft = carousel.offsetWidth;
  carousel.classList.remove("no-transition");

  arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
    });
  });

  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  const infiniteScroll = () => {
    if (carousel.scrollLeft <= 0) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
      carousel.classList.remove("no-transition");
    }
    else if (carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }

    clearTimeout(timeoutId);
    if (!cardSlider.matches(":hover")) autoPlay();
  };

  const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return;
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
  };
  autoPlay();

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  carousel.addEventListener("scroll", infiniteScroll);

  const cards = carousel.querySelectorAll(".card");

  const pauseCarousel = () => {
    clearTimeout(timeoutId);
  };

  const resumeCarousel = () => {
    autoPlay();
  };

  let isPaused = false;

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      if (!isPaused) {
        isPaused = true;
        pauseCarousel();
        cards.forEach(siblingCard => {
          if (siblingCard !== card) {
            siblingCard.classList.add("blur");
          }
        });
      }
    });
    card.addEventListener("mouseleave", () => {
      isPaused = false;
      resumeCarousel();
      cards.forEach(siblingCard => {
        siblingCard.classList.remove("blur");
      });
    });
  });

  cardSlider.addEventListener("mouseenter", pauseCarousel);
  cardSlider.addEventListener("mouseleave", resumeCarousel);
});

// ------------------------------------------------------------------------------------------------










// ----------------------------Banner--------------------------------------------------------------------------------------------------------------------

document.getElementById("banner-button").onclick = function() {
  window.scrollTo({
    top: 870,
    behavior: 'smooth' 
  });
};

const headlineElement = document.getElementById("banner-headline");
const textElement = document.getElementById("bannerP");

const headlineText = "Discover Possibilities!";
const paragraphText = "Your journey to success starts here. Explore our courses and connect with industry experts.";

let headlineIndex = 0;
let paragraphIndex = 0;

function typeHeadline() {
    if (headlineIndex < headlineText.length) {
        headlineElement.textContent += headlineText.charAt(headlineIndex);
        headlineIndex++;
        setTimeout(typeHeadline, 30);
    } else {
        typeParagraph();
    }
}

function typeParagraph() {
    if (paragraphIndex < paragraphText.length) {
        textElement.textContent += paragraphText.charAt(paragraphIndex);
        paragraphIndex++;
        setTimeout(typeParagraph, 20);
    }
}
typeHeadline();

// --------------------------------------------------------------------------------------------------------------------










// ----------------------------------ChatBOTS--------------------------------------------------------------------------

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const API_KEY = "Your_API_key";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}],
        })
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

// ---------------------------------------------------------------------------------------------------------------













// -------------------------------------news---------------------------------------------------------

let slider = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let dots = document.querySelectorAll('.dots li');

let lengthItems = items.length - 1;
let active = 0;

const autoSlideInterval = 10000;

function goToNextSlide() {
    active = (active + 1) <= lengthItems ? (active + 1) : 0;
    reloadSlider();
}

function goToPrevSlide() {
    active = (active - 1) >= 0 ? (active - 1) : lengthItems;
    reloadSlider();
}

let refreshInterval = setInterval(goToNextSlide, autoSlideInterval);

function reloadSlider() {
    slider.style.transform = `translateX(-${items[active].offsetLeft}px)`;

    let last_active_dot = document.querySelector('.dots li.active');
    if (last_active_dot) last_active_dot.classList.remove('active');
    dots[active].classList.add('active');

    clearInterval(refreshInterval);
    refreshInterval = setInterval(goToNextSlide, autoSlideInterval);
}

dots.forEach((li, key) => {
    li.addEventListener('click', () => {
        active = key;
        reloadSlider();
    });
});

// Add event listeners for the buttons
next.addEventListener('click', () => {
    goToNextSlide();
});

prev.addEventListener('click', () => {
    goToPrevSlide();
});

function handleHover(event) {
    if (event.type === 'mouseenter') {
        clearInterval(refreshInterval);
    } else if (event.type === 'mouseleave') {
        refreshInterval = setInterval(goToNextSlide, autoSlideInterval);
    }
}

document.querySelector('.slider').addEventListener('mouseenter', handleHover);
document.querySelector('.slider').addEventListener('mouseleave', handleHover);

window.addEventListener('resize', reloadSlider);

reloadSlider();

// --------------------------------------------------------------------------------------------------------------------















// -----------------------------------------------Quote-----------------------------------------------------------------

const container = document.querySelector('.container');
const shadow = document.querySelector('.shadow');

window.addEventListener('scroll', () => {
    const rect = container.getBoundingClientRect();

    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        container.querySelector('.box1').classList.add('scrolled');
        shadow.classList.add('scrolled');
    } else {
        container.querySelector('.box1').classList.remove('scrolled');
        shadow.classList.remove('scrolled');
    }
});

// --------------------------------------------------------------------------------------------------------------------------------










// ----------------------------------------------Reveal---------------------------------------------------------
gsap.registerPlugin(ScrollTrigger);

// Reveal Scroll Animation
var tl = gsap.timeline({
  scrollTrigger: {
      trigger: "#reveal-main",
      start: "50% 50%", // Adjust these values based on your needs
      end: "150% 50%", // Adjust these values based on your needs
      scrub: 2,
      pin: true
  }
});

tl
.to("#reveal-center", {
  height: "100vh",
}, 'a')
.to("#reveal-top", {
  top: "-50%",
}, 'a')
.to("#reveal-bottom", {
  bottom: "-50%",
}, 'a')
.to("#reveal-top-h1", {
  top: "60%"
}, 'a')
.to("#reveal-bottom-h1", {
  bottom: "-30%"
}, 'a')
.to("#reveal-center-h1", {
  top: "-30%"
}, 'a')
.to(".reveal-content", {
  delay: -0.2,
  marginTop: "0%"
});

// Header Background Color Change
gsap.to("header", {
  backgroundColor: "rgb(80, 2, 26)",
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: "#reveal-main",
    start: "top top", // Adjusted to trigger when #reveal-main reaches the top of the viewport
    end: "bottom top", // Adjusted to trigger when #reveal-main reaches the bottom of the viewport
    toggleActions: "play none reverse none",
    scrub: true
  }
});

// --------------------------------------------------------------------------------------------------------------------------------