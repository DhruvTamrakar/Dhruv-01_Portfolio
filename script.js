const coverEle = document.getElementById('cover');
const loadingText = document.createElement('h2');
const typingEls = document.querySelectorAll('.typing');
const headEle = document.getElementById('header');
const heroEle = document.getElementById('hero');
const DevTitleEle = document.querySelector('.door-title');
// Loading Screen Logic
window.addEventListener('load', () => {
    loadingText.textContent = "Initializing...";
    coverEle.appendChild(loadingText);
    typingEls.forEach(el => el.style.visibility = "hidden");
    DevTitleEle.classList.remove('section-title');
    setTimeout(() => {
        headEle.style.animation = "toptodown 0.8s ease ";
        heroEle.style.animation = "toptodown 0.8s ease ";
        coverEle.style.display = 'none';
        DevTitleEle.classList.add('section-title');
        playSectionTitleDoorAnimation()


        startTerminalTyping();


    }, 500);
});


async function startTerminalTyping() {
    for (const el of typingEls) {
        el.style.visibility = "visible";
        const text = el.textContent;
        el.textContent = "";
        el.classList.add('cursor');

        await typeLine(el, text, 40);
        el.classList.remove('cursor');

        await sleep(400);
    }

}

function typeLine(el, text, speed) {
    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            el.textContent += text[i];
            i++;

            if (i === text.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Progress Bar Logic
// Progress Bar Animation - Only on downward scroll
document.addEventListener('DOMContentLoaded', function () {
    // Add CSS for smooth animation
    const style = document.createElement('style');
    style.textContent = `
    .skills-category > .skill > progress {
      transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .skills-category > .skill > progress::-webkit-progress-value {
      transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
    document.head.appendChild(style);

    // Get the skills section
    const skillsSection = document.getElementById('skills');

    if (!skillsSection) {
        console.error('Could not find #skills element!');
        return;
    }

    // Get all progress bars
    const progressBars = document.querySelectorAll('.skills-category > .skill > progress');

    // Store original values and reset to 0
    progressBars.forEach(progressBar => {
        const originalValue = progressBar.getAttribute('value');
        progressBar.setAttribute('data-original-value', originalValue);
        progressBar.setAttribute('value', '0');
    });

    // Track scroll direction and animation state
    let lastScrollY = window.scrollY;
    let isScrollingDown = false;
    let hasAnimatedOnThisPass = false;
    let isInView = false;

    // Function to reset progress bars to 0
    function resetProgressBars() {
        progressBars.forEach(progressBar => {
            progressBar.setAttribute('value', '0');
        });
        hasAnimatedOnThisPass = false;
    }

    // Function to animate progress bars
    function animateProgressBars() {
        if (hasAnimatedOnThisPass) return;

        hasAnimatedOnThisPass = true;

        progressBars.forEach((progressBar, index) => {
            setTimeout(() => {
                const originalValue = progressBar.getAttribute('data-original-value');
                progressBar.setAttribute('value', originalValue);
            }, index * 300);
        });
    }

    // Scroll event handler to detect direction
    function handleScroll() {
        const currentScrollY = window.scrollY;
        isScrollingDown = currentScrollY > lastScrollY;
        lastScrollY = currentScrollY;

        // Check if skills section is in viewport
        const rect = skillsSection.getBoundingClientRect();
        const isCurrentlyInView = rect.top < window.innerHeight && rect.bottom > 0;

        // Reset animation flag when leaving view while scrolling up
        if (!isCurrentlyInView && isInView && !isScrollingDown) {
            resetProgressBars();
        }

        // Animate when entering view while scrolling down
        if (isCurrentlyInView && !isInView && isScrollingDown) {
            animateProgressBars();
        }

        // Also animate if already in view and scrolling down (for smoother experience)
        if (isCurrentlyInView && isInView && isScrollingDown && !hasAnimatedOnThisPass) {
            animateProgressBars();
        }

        // Update view state
        isInView = isCurrentlyInView;
    }

    // Intersection Observer for more precise visibility detection
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const isIntersecting = entry.isIntersecting;

            // When entering viewport
            if (isIntersecting && isScrollingDown && !hasAnimatedOnThisPass) {
                animateProgressBars();
            }

            // When leaving viewport while scrolling up, reset
            if (!isIntersecting && !isScrollingDown) {
                resetProgressBars();
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    // Set up event listeners
    window.addEventListener('scroll', handleScroll);
    observer.observe(skillsSection);

    // Reset on page load if scrolled past the section
    setTimeout(() => {
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < 0) {
            resetProgressBars();
        }
    }, 100);
});





// Section Title Door Animation


function playSectionTitleDoorAnimation() {
    const titles = document.querySelectorAll(".section-title");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                } else {
                    entry.target.classList.remove("active"); // reset animation
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    titles.forEach(title => observer.observe(title));
}

playSectionTitleDoorAnimation();





// Project section 
document.addEventListener('DOMContentLoaded', () => {
    const projectTitles = document.querySelectorAll(
        '.project-card .project-header .project-title'
    );

    const originalTexts = [...projectTitles].map(title => title.textContent);

    // Clear text initially
    projectTitles.forEach(title => {
        title.textContent = '';
        title.style.minHeight = '40px';
    });

    function typeWriter(element, text, speed = 70) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                const index = [...projectTitles].indexOf(entry.target);

                if (entry.isIntersecting) {
                    // Start typing when entering viewport
                    if (!entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        typeWriter(entry.target, originalTexts[index], 70);
                    }
                } else {
                    // Reset when leaving viewport
                    entry.target.textContent = '';
                    entry.target.removeAttribute('data-animated');
                }
            });
        },
        {
            threshold: 0.5 // 50% visible triggers animation
        }
    );

    projectTitles.forEach(title => observer.observe(title));
});
// Form Valiadaiton
const form = document.querySelector(".cform");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

// ---------- Validation functions ----------
function showError(input, message) {
    const field = input.parentElement;
    const error = field.querySelector(".error");
    input.classList.add("error");
    input.classList.remove("valid");
    error.textContent = message;
}

function showSuccess(input) {
    const field = input.parentElement;
    const error = field.querySelector(".error");
    input.classList.remove("error");
    input.classList.add("valid");
    error.textContent = "";
}

function validateName() {
    if (nameInput.value.trim().length < 3) {
        showError(nameInput, "Name must be at least 3 characters");
        return false;
    }
    showSuccess(nameInput);
    return true;
}

function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, "Enter a valid email address");
        return false;
    }
    showSuccess(emailInput);
    return true;
}

function validateMessage() {
    if (messageInput.value.trim().length < 10) {
        showError(messageInput, "Message must be at least 10 characters");
        return false;
    }
    showSuccess(messageInput);
    return true;
}

// ---------- Real-time listeners ----------
nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
messageInput.addEventListener("input", validateMessage);

// ---------- Submit handler ----------
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isMessageValid) {
        sendEmail();
         e.preventDefault(); // stop submit if invalid
        document.querySelectorAll(".valid").forEach(el => el.classList.remove("valid"));
    }
});
// EmailJS
(function () {
    emailjs.init("PIwbhmkrctvqFtqOJ");
})();
function sendEmail() {
    emailjs.send("service_dhruv2412", "template_oby6nfa", {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value
    })
    .then(() => {
        alert("Message sent successfully ✅");
        form.reset();
    })
    .catch(() => {
        alert("Failed to send message ❌");
    });
}


// Initialize AOS
AOS.init(
    {
        duration: 800,
        easing: 'ease-in-out',
    }
);
