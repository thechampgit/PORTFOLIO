import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ProjectDetailModal from './components/ProjectDetailModal';
import CertificateDetailModal from './components/CertificateDetailModal';
import ChampAI from './components/ChampAI';

const certificationsData = [
  {
    id: 1,
    year: '2025',
    title: 'PROGRAMMING IN JAVA (ELITE)',
    issuer: 'NPTEL',
    image: 'assets/images/java_certificate.jpg',
    description: 'Successfully completed the NPTEL certification course in Programming in Java with an Elite grade. The course covered advanced Java concepts including Object-Oriented Programming, Exception Handling, Multithreading, Generics, Applets, Swing, and Database Connectivity (JDBC).',
    skills: ['Java', 'Object-Oriented Programming', 'Multithreading', 'Database Connectivity']
  },
  {
    id: 2,
    year: '2025',
    title: 'ARTIFICIAL INTELLIGENCE',
    issuer: 'Codsoft',
    image: 'assets/images/165436986307283579.jpeg',
    description: 'Completed an intensive 4-week virtual internship in Artificial Intelligence at Codsoft. During this internship, I designed, developed, and deployed multiple machine learning solutions, including a Movie Recommendation System using collaborative filtering, an NLP-based Spam SMS Classifier, and a Tic-Tac-Toe AI bot leveraging the Minimax algorithm with alpha-beta pruning.',
    skills: ['Python', 'Machine Learning', 'Natural Language Processing', 'Algorithms', 'Minimax']
  },
  {
    id: 3,
    year: '2026',
    title: 'INTRODUCTION TO AI',
    issuer: 'CISCO',
    image: 'assets/images/cisco_ai_certificate.jpg',
    description: 'Completed the Introduction to AI curriculum offered by Cisco Networking Academy, gaining core insights into the foundational theories of neural networks, deep learning models, data preprocessing pipelines, and ethical frameworks for building responsible AI applications.',
    skills: ['AI Foundations', 'Machine Learning Basics', 'Ethics in AI', 'Neural Networks']
  }
];

const projectsData = [
  {
    id: 1,
    category: 'web',
    tag: 'AI & Web Dev',
    title: 'Indian Sign Language Gen',
    desc: 'An AI-based multimodal translation platform that converts English and Hindi speech, text, and visual content into Indian Sign Language (ISL), and translates ISL back into English and Hindi..',
    details: 'Built a responsive user interface with an admin dashboard and integrated Firebase for authentication and data management.',
    image: 'assets/images/sign.jpeg',
    github: 'https://github.com/thechampgit/INDIAN-SIGN-LANGUAGE-GEN',
    techStack: ['React', 'Vite', 'Firebase', 'GSAP', 'CSS3'],
    vividDesc: 'A cutting-edge multimodal translation system developed to bridge the communication gap between the hearing-impaired community and the general public. This AI-powered tool accepts inputs in the form of spoken Hindi/English speech, written text, or video feeds, and translates them in real-time to Indian Sign Language (ISL) animations. It also acts as a bidirectional translator, taking ISL sign gestures from a camera feed and translating them back into audio and text.',
    gallery: ['assets/images/sign.jpeg'],
    timeline: '8 Weeks',
    role: 'AI & Frontend Engineer',
    features: [
      'Real-time conversion of speech to ISL animations.',
      'Bidirectional camera translation from ISL back to speech.',
      'Interactive tutorial modules for learning key ISL signs.',
      'Advanced hand-gesture recognition using computer vision.'
    ]
  },
  {
    id: 2,
    category: 'web',
    tag: 'Web Dev',
    title: 'Naye Pankh',
    desc: 'A full-stack NGO management platform designed to simplify volunteer registration, donation management, and event coordination. It provides a responsive user interface along with an admin dashboard to efficiently manage campaigns, users, and organizational activities.',
    details: 'Built a responsive user interface with an admin dashboard and integrated Firebase for authentication and data management.',
    image: 'assets/images/naye_pankh.jpg',
    link: 'https://nayepankh-ngo.vercel.app/',
    github: 'https://github.com/thechampgit/NayePankh-NGO',
    techStack: ['React.js', 'Firebase Auth', 'Firestore', 'Tailwind CSS'],
    vividDesc: 'An intuitive NGO management and fundraising ecosystem designed to streamline volunteer engagement and digital donations for \'Naye Pankh Foundation\'. The portal features a secure custom authentication system, a real-time volunteer onboarding flow, administrative tools to launch donation drives, and a public-facing blog tracking social impact initiatives.',
    gallery: ['assets/images/naye_pankh.jpg'],
    timeline: '4 Weeks',
    role: 'Lead Full-Stack Developer',
    features: [
      'Custom role-based access control for volunteers and admins.',
      'Integrated payment gateways for secure charity donation drives.',
      'Dynamic blog and impact tracking dashboards for public view.',
      'Automated volunteer registration and onboarding pipelines.'
    ]
  },
  {
    id: 3,
    category: 'design', // Software Testing category matches data-category="design" in HTML
    tag: 'Web Dev',
    title: 'E-Swachh',
    desc: 'A civic issue reporting platform that enables citizens to report and track municipal problems such as garbage accumulation, potholes, water leakage, and streetlight failures using real-time geolocation and image uploads.',
    details: 'Implemented interactive maps, image uploads, complaint tracking, and role-based dashboards for efficient issue management.',
    image: 'assets/images/e_swachh.jpg',
    link: 'https://e-swachh.vercel.app/',
    github: 'https://github.com/thechampgit/E-SWACHH',
    techStack: ['React', 'Firebase', 'Leaflet', 'CSS Modules','Google Maps API'],
    vividDesc: 'A geolocated civic complaint and sanitation management software. Citizens can flag public waste dumps, flooding, and sanitation issues by snapping a photo. The app automatically extracts GPS coordinates and creates an interactive pin on a live map. Municipal admins use the backend dashboard to triage issues, assign field workers, and update issue statuses in real time.',
    gallery: ['assets/images/e_swachh.jpg'],
    timeline: '6 Weeks',
    role: 'Frontend & Geospatial Developer',
    features: [
      'Interactive mapping with geolocated pinpoints and custom leaflet layers.',
      'Photo-based reporting with EXIF metadata parsing for verification.',
      'Role-based control rooms for government triage and field response.',
      'Real-time civic status trackers for citizens to monitor complaint progress.'
    ]
  },
  {
    id: 4,
    category: 'web',
    tag: 'Web Dev & Animation',
    title: 'One Piece',
    desc: 'A pirate adventure game where users can explore the One Piece world and find treasure. Set sail into the Grand Line through an immersive One Piece-inspired web experience featuring cinematic animations, iconic characters, and a modern interactive UI built with React, Vite, and Framer Motion. ',
    details: 'This project is a fan-made tribute to the world of **One Piece**, inspired by Eiichiro Odas legendary manga and anime series. It features interactive character sections, smooth animations, and a visually immersive interface designed to capture the adventurous spirit of the Grand Line.',
    image: 'assets/images/one_piece.jpg',
    github: 'https://github.com/thechampgit/ONE-PIECE',
    techStack: ['React', 'Vite', 'Framer Motion'],
    vividDesc: 'One Piece follows Monkey D. Luffy, a young pirate whose body gained the properties of rubber after eating the Gum-Gum Fruit (later revealed as the Human-Human Fruit, Model: Nika). Inspired by the legendary pirate Red-Haired Shanks, Luffy sets sail to find the legendary treasure known as the One Piece and become theKing of the Pirates.During his journey across the Grand Line and the New World, he forms the Straw Hat Pirates, each member chasing their own dream while facing powerful enemies, uncovering hidden history, and challenging the oppressive World Government.',
    gallery: ['assets/images/113223378128047073.jpeg', 'assets/images/one_piece_gallery_2.jpg'],
    timeline: '3 Weeks',
    role: 'UI/UX & Interactive Designer',
    features: [
      'Stunning interactive character bios with animations.',
      'Rich thematic custom backgrounds and stylized UI patterns.',
      'Interactive Grand Line map route navigation.',
      'Fluid page transitions mimicking comic book panel zooms.'
    ]
  },
  {
    id: 5,
    category: 'web',
    tag: 'Web Dev & Canvas',
    title: 'Selfie Shuffle',
    desc: 'A fun and interactive web-based puzzle game where players transform their own selfies into a personalized jigsaw puzzle.',
    details: "Capture a photo using your device's camera or upload an existing image, choose a difficulty level, and rearrange the shuffled pieces to recreate the original picture.",
    image: 'assets/images/selfie_shuffle.jpg',
    link: 'https://selfie-shuffle.vercel.app/',
    github: 'https://github.com/thechampgit/SELFIE-SHUFFLE',
    techStack: ['React', 'HTML5 Canvas', 'WebRTC Camera API', 'CSS Grid', 'GSAP'],
    vividDesc: 'A gamified web experience where users can take a live selfie using their web camera or upload any portrait image to instantly generate a custom, playable jigsaw puzzle. The game splits the image into canvas fragments using custom grid algorithms, shuffles them with interactive transition animations, and tracks player moves, time elapsed, and high scores.',
    gallery: ['assets/images/selfie_shuffle.jpg'],
    timeline: '2 Weeks',
    role: 'Core Game Logic Developer',
    features: [
      'Dynamic canvas image fragmentation splitting algorithm.',
      'Interactive puzzle-piece dragging with grid snapping detection.',
      'Local Storage database integrations for high-score tracking.',
      'Camera streaming utilizing native browser WebRTC media APIs.'
    ]
  }
];

const HERO_STARS = Array.from({ length: 35 }).map((_, i) => {
  const isStar = i % 2 === 0;
  return {
    id: i,
    type: isStar ? 'star' : 'dot',
    top: `${Math.random() * 85 + 5}%`,
    left: `${Math.random() * 90 + 5}%`,
    size: isStar ? `${Math.random() * 0.8 + 0.4}rem` : `${Math.random() * 6 + 3}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${Math.random() * 6 + 4}s`,
  };
});

export default function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    if (selectedProject || selectedCertificate) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedProject, selectedCertificate]);

  // Filtered projects list based on state
  const filteredProjects = activeFilter === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    if (!gsap || !ScrollTrigger) return;
    
    gsap.registerPlugin(ScrollTrigger);

    // 1. Header scroll logic
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    // 2. Custom cursor logic
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    let cursorActive = true;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const animateCursor = () => {
      if (!cursorActive) return;
      
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      if (cursor) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
      }

      dotX += (mouseX - dotX) * 0.45;
      dotY += (mouseY - dotY) * 0.45;
      if (cursorDot) {
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
      }

      animationFrameId = requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Attach custom cursor hovers dynamically
    const attachCursorHovers = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, .software-card, .project-card, .scroll-down-badge, .social-item'
      );
      
      const handleMouseEnter = () => cursor?.classList.add('hovered');
      const handleMouseLeave = () => cursor?.classList.remove('hovered');

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });

      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    };
    
    const cleanupHovers = attachCursorHovers();

    // 3. GSAP Scrolling Animations
    // Text Parallax in Hero
    const parallaxTexts = document.querySelectorAll('.text-parallax');
    const heroTweens = [];
    parallaxTexts.forEach(text => {
      const speed = parseFloat(text.dataset.speed) || 1;
      const tween = gsap.to(text, {
        x: () => (speed * 100),
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
      heroTweens.push(tween);
    });

    // Resume Background Scrolling Text
    const resumeBgTexts = document.querySelectorAll('.resume-bg-text');
    const resumeTweens = [];
    resumeBgTexts.forEach((text, index) => {
      const direction = index % 2 === 0 ? 150 : -150;
      const tween = gsap.to(text, {
        x: direction,
        scrollTrigger: {
          trigger: '#resume',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
      resumeTweens.push(tween);
    });

    // Reveal Items on Scroll
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealTweens = [];
    revealItems.forEach(item => {
      const tween = gsap.fromTo(item, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
      revealTweens.push(tween);
    });

    // Parallax badges in About Section
    const dobBadgeTween = gsap.to('.pill-dob', {
      y: -30,
      rotate: -8,
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    const nationBadgeTween = gsap.to('.pill-nation', {
      y: 20,
      rotate: 5,
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Hero portrait scaling
    const portraitTween = gsap.to('.hero-portrait-card img', {
      scale: 1.15,
      y: 20,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // 4. Interactive Star Parallax
    const handleStarParallax = (e) => {
      const stars = document.querySelectorAll('.star-decor');
      const mx = e.clientX;
      const my = e.clientY;

      stars.forEach(star => {
        const rect = star.getBoundingClientRect();
        const starX = rect.left + rect.width / 2;
        const starY = rect.top + rect.height / 2;
        const deltaX = (mx - starX) * 0.03;
        const deltaY = (my - starY) * 0.03;

        gsap.to(star, {
          x: deltaX,
          y: deltaY,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    };
    document.addEventListener('mousemove', handleStarParallax);

    // Global cleanup on unmount
    return () => {
      cursorActive = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleStarParallax);
      cleanupHovers();

      // Clean up GSAP timelines & triggers
      heroTweens.forEach(t => t.scrollTrigger?.kill());
      resumeTweens.forEach(t => t.scrollTrigger?.kill());
      revealTweens.forEach(t => t.scrollTrigger?.kill());
      dobBadgeTween.scrollTrigger?.kill();
      nationBadgeTween.scrollTrigger?.kill();
      portraitTween.scrollTrigger?.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Refresh ScrollTrigger calculations whenever the active filter changes
  // and the DOM layouts of projects update.
  useEffect(() => {
    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [activeFilter]);

  return (
    <>
      {/* Custom Cursor */}
      <div className="custom-cursor" id="customCursor"></div>
      <div className="custom-cursor-dot" id="customCursorDot"></div>

      {/* Header */}
      <header id="header">
        <a href="#" className="logo">Champa Jha</a>
        <nav>
          <a href="#about" className="nav-link">About me</a>
          <a href="#resume" className="nav-link">Resume</a>
          <a href="#projects" className="nav-link">Work</a>
          <a href="#contact" className="btn-pill btn-gold nav-link">Get in touch!</a>
        </nav>
      </header>

      <main>
        {/* Section 1: Hero */}
        <section className="hero-section" id="hero">
          {/* Decorative Floating Twinkling Stars & Glow Particles */}
          {HERO_STARS.map((star) => (
            star.type === 'star' ? (
              <div 
                key={star.id} 
                className="star-twinkle-interactive" 
                style={{ 
                  top: star.top, 
                  left: star.left, 
                  fontSize: star.size,
                  animationDelay: star.delay,
                  animationDuration: star.duration
                }}
              >
                <i className="fa-solid fa-star"></i>
              </div>
            ) : (
              <div 
                key={star.id} 
                className="dot-glow-interactive" 
                style={{ 
                  top: star.top, 
                  left: star.left, 
                  width: star.size,
                  height: star.size,
                  animationDelay: star.delay,
                  animationDuration: star.duration
                }}
              ></div>
            )
          ))}

          <div className="hero-content">
            {/* Hero Left: Photo Card */}
            <div className="hero-left reveal-item">
              <div className="hero-portrait-card">
                <img src="/assets/images/hero_portrait.jpg" alt="Champa Jha Portrait" />
              </div>
            </div>

            {/* Hero Right: Titles and socials */}
            <div className="hero-right reveal-item" style={{ transitionDelay: '0.2s' }}>
              <div className="marquee-text-container">
                <h1 className="huge-title">PORTFOLIO</h1>
                <h1 className="huge-title outline text-parallax" data-speed="1.5">PORTFOLIO</h1>
                <h1 className="huge-title outline text-parallax" data-speed="-1.2">PORTFOLIO</h1>
                <h1 className="huge-title outline text-parallax" data-speed="0.8">PORTFOLIO</h1>
              </div>
              
              <div className="social-links-grid">
                <a href="mailto:champgmail@gmail.com" target="_blank" rel="noopener noreferrer" className="social-item">
                  <span><i className="fab fa-envelope"></i></span> champgmail@gmail.com
                </a>

                <a href="https://www.linkedin.com/in/thechamphub/" target="_blank" rel="noopener noreferrer" className="social-item">
                  <span><i className="fab fa-linkedin"></i></span> thechamphub
                </a>
              
                <a href="https://github.com/thechampgit" target="_blank" rel="noopener noreferrer" className="social-item">
                  <span><i className="fab fa-github"></i></span> thechampgit
                </a>

                <a href="https://www.instagram.com/raszpberryy/" target="_blank" rel="noopener noreferrer" className="social-item">
                  <span><i className="fab fa-instagram"></i></span> raszpberry
                </a>
              </div>
            </div>
          </div>

          {/* Hero Bottom: Desc and scroll indicator */}
          <div className="hero-bottom reveal-item" style={{ transitionDelay: '0.4s' }}>
            <p className="hero-desc">
              I believe the best way to learn is by building. I'm passionate about exploring new technologies,
              turning ideas into reality, and creating software that delivers real value.
            </p>
          </div>

          {/* Spinning Scroll Down Badge */}
          <a href="#about" className="scroll-down-badge">
            <svg viewBox="0 0 100 100">
              <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text>
                <textPath href="#circlePath" className="scroll-down-badge-text" startOffset="0%">
                  Scroll Down • Scroll Down • 
                </textPath>
              </text>
            </svg>
            <div className="arrow-icon"><i className="fa-solid fa-arrow-down"></i></div>
          </a>
        </section>

        {/* Section 2: About Me */}
        <section className="about-section" id="about">
          {/* Floating decorative elements */}
          <div className="star-decor" style={{ top: '15%', right: '15%', color: 'var(--color-orange)' }}>
            <i className="fa-solid fa-star"></i>
          </div>

          <div className="about-grid">
            {/* About Left: Text Content */}
            <div className="about-left reveal-item">
              <span className="about-tag">About me</span>
              <h2 className="about-heading">Hello, <br />I'm Champa !</h2>
              <p className="about-text">
                I’m a third-year IT student with a strong interest in web development and software testing. I enjoy building web applications from frontend
                to backend while also learning how to test systems and analyze data for better performance and insights. Skilled in HTML, CSS, and
                JavaScript. I’m continuously expanding my knowledge and looking for opportunities to apply my skills in real-world projects.
              </p>
              <a href="https://www.linkedin.com/in/thechamphub/" target="_blank" rel="noopener noreferrer" className="search-pill-btn">
                <div className="search-icon-bg"><i class="fa-solid fa-search"></i></div>
                <span>https://www.linkedin.com/in/thechamphub/</span>
              </a>
            </div>

            {/* About Right: Graphical Composition */}
            <div className="about-right reveal-item" style={{ transitionDelay: '0.2s' }}>
              <div className="about-image-wrapper">
                <img src="/assets/images/about_portrait.jpg" alt="Champa Profile Portrait" className="about-portrait-img" />
                
                {/* Floating badge pills */}
                <div>
                  <div className="floating-pill pill-dob">12th June 2004</div> 
                  <div className="floating-pill pill-whoami">Undergraduate</div>
                </div>
                {/* Contact dark overlay card */}
                <div className="about-contact-box">
                  <h4>Contact</h4>
                  <ul className="contact-info-list">
                    <li><i className="fa-solid fa-map-marker-alt"></i> Hazaribagh, Jharkhand</li>
                    <li><i className="fa-solid fa-envelope"></i> champgmail@gmail.com</li>
                    <li><i className="fa-solid fa-phone"></i> +91 9341854494</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Education & Experience */}
        <section className="resume-section" id="resume">
          {/* Left side: Educational and Experience Timelines */}
          <div className="resume-left">
            {/* Education block */}
            <div className="edu-block reveal-item">
              <h2>Education</h2>
              <div className="timeline">
                {/* Item 1 */}
                <div className="timeline-item">
                  <div className="timeline-dot"><i className="fa-solid fa-star"></i></div>
                  <div className="timeline-meta">2024 - 2027</div>
                  <h4 className="timeline-title">B.Tech. in Information Technology</h4>
                  <p className="timeline-sub">University College of Engineering and Technology, Hazaribagh</p>
                  <div className="tag-list">
                    <span className="tag-badge">Web Dev</span>
                    <span className="tag-badge">Software Testing</span>
                  </div>
                </div>
                {/* Item 2 */}
                <div className="timeline-item">
                  <div className="timeline-dot"><i className="fa-solid fa-star"></i></div>
                  <div className="timeline-meta">2020 - 2023</div>
                  <h4 className="timeline-title">Diploma in Civil Engineering</h4>
                  <p className="timeline-sub">Govt. Women's Polytechnic, Dumka</p>
                  <div className="tag-list">
                    <span class="tag-badge">RCC</span>
                    <span class="tag-badge">TOS</span>
                    <span class="tag-badge">Surveying</span>
                  </div>
                </div>
                {/* Item 3 */}
                <div className="timeline-item">
                  <div className="timeline-dot"><i className="fa-solid fa-star"></i></div>
                  <div className="timeline-meta">2020</div>
                  <h4 className="timeline-title">Matriculation</h4>
                  <p className="timeline-sub">St. Joseph's Convent Higher Secondary School, Chittaranjan</p>
                </div>
              </div>
            </div>

            {/* Experience block */}
            <div className="exp-block reveal-item" style={{ transitionDelay: '0.2s' }}>
              <h2>Internships</h2>
              <div className="timeline">
                {/* Item 1 */}
                <div className="timeline-item">
                  <div className="timeline-dot"><i className="fa-solid fa-star"></i></div>
                  <div className="timeline-meta">2026</div>
                  <h4 className="timeline-title">Mern Stack Developer</h4>
                  <p className="timeline-sub">Techies Gateway, Hazaribagh</p>
                  <div className="tag-list">
                    <span className="tag-badge">HTML</span>
                    <span className="tag-badge">CSS</span>
                    <span className="tag-badge">JavaScript</span>
                    <span className="tag-badge">Node.js</span>
                    <span className="tag-badge">Mongo DB</span>
                  </div>
                </div>
                {/* Item 2 */}
                <div className="timeline-item">
                  <div className="timeline-dot"><i className="fa-solid fa-star"></i></div>
                  <div className="timeline-meta">2026</div>
                  <h4 className="timeline-title">Introduction to Modern AI</h4>
                  <p className="timeline-sub">Cisco Networking Company</p>
                  <div className="tag-list">
                    <span className="tag-badge">AI Agents</span>
                    <span className="tag-badge">Vibe Coding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Technical Skills */}
          <div className="resume-right reveal-item" style={{ transitionDelay: '0.3s' }}>
            {/* Background Repeating Text */}
            <div className="resume-bg-text-container">
              <div className="resume-bg-text">RESUME</div>
              <div className="resume-bg-text">RESUME</div>
              <div className="resume-bg-text">RESUME</div>
            </div>

            <div className="skills-wrapper">
              <h2 className="skills-heading">Technical skills</h2>

              {/* Software Skills */}
              <div className="skills-category">
                <h3>Software Tools</h3>
                <div className="software-grid">
                  <div className="software-card" title="VS Code">Vs</div>
                  <div className="software-card" title="Intellij Idea">Ij</div>
                  <div className="software-card" title="Git">Gt</div>
                </div>
              </div>

              {/* Coding Skills */}
              <div className="skills-category">
                <h3>Coding Skills</h3>
                <ul className="skills-list">
                  <li>
                    <span>HTML5 / CSS</span>
                    <span className="skill-level">Advanced</span>
                  </li>
                  <li>
                    <span>SQL</span>
                    <span className="skill-level">Advanced</span>
                  </li>
                  <li>
                    <span>React / Next.js</span>
                    <span className="skill-level">Basic</span>
                  </li>
                  <li>
                    <span>Node.js</span>
                    <span className="skill-level">Basic</span>
                  </li>
                </ul>
              </div>

              {/* Skills Chips */}
              <div className="skills-chips">
                <span>GitHub</span>
                <span>Vercel</span>
                <span>Firebase</span>
                <span>Mongo DB</span>
                <span>DBMS</span>
                <span>OOPs</span>
                <span>Figma</span>
              </div>

              <div className="github-info-wrapper" style={{ position: 'relative', overflow: 'visible', width: '100%', marginTop: '80px', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '30px' }}>
                {/* Decorative Stars only for the GitHub Section */}
                <div className="star-twinkle-interactive" style={{ top: '-10px', left: '15px', fontSize: '0.9rem', animationDelay: '0.2s', animationDuration: '6s' }}>
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="star-twinkle-interactive" style={{ top: '40px', right: '30px', fontSize: '1.2rem', animationDelay: '1.4s', animationDuration: '8s' }}>
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="star-twinkle-interactive" style={{ bottom: '-15px', left: '80px', fontSize: '0.8rem', animationDelay: '2.5s', animationDuration: '5s' }}>
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="star-twinkle-interactive" style={{ top: '80px', left: '200px', fontSize: '0.7rem', animationDelay: '0.8s', animationDuration: '7s' }}>
                  <i className="fa-solid fa-star"></i>
                </div>
                <div className="star-twinkle-interactive" style={{ bottom: '25px', right: '180px', fontSize: '1.1rem', animationDelay: '3.1s', animationDuration: '9s' }}>
                  <i className="fa-solid fa-star"></i>
                </div>

                <h4 className="skills-heading github-info" style={{ marginTop: '0', borderTop: 'none', paddingTop: '0' }}>Check GitHub For More</h4>

                <a href="https://github.com/thechampgit" target="_blank" rel="noopener noreferrer" className="search-pill-btn github-link" style={{ marginTop: '30px' }}>
                  <div className="search-icon-bg"><i className="fa-solid fa-search"></i></div>
                  <span>https://github.com/thechampgit</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Projects Gallery */}
        <section className="projects-section" id="projects">
          <div className="projects-header reveal-item">
            <h2 className="projects-title"  >Selected Work</h2>
            <div className="filter-btn-group">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} 
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'web' ? 'active' : ''}`} 
                onClick={() => setActiveFilter('web')}
              >
                Web Dev
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'design' ? 'active' : ''}`} 
                onClick={() => setActiveFilter('design')}
              >
                Software Testing
              </button>
            </div>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((project, idx) => (
              <div 
                key={project.id} 
                className="project-card reveal-item" 
                style={{ 
                  transitionDelay: `${idx * 0.1}s`,
                  display: 'flex' // React handles show/hide dynamically
                }}
              >
                <div className="project-image-box">
                  <span className="project-tag">{project.tag}</span>
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-info">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.desc}</p>
                    <div className="card-tech-tags">
                      {project.techStack && project.techStack.map((tech, i) => (
                        <span key={i} className="card-tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                  <div className="project-actions">
                    <button 
                      onClick={() => setSelectedProject(project)} 
                      className="view-project-btn"
                    >
                      View Project <i className="fa-solid fa-eye"></i>
                    </button>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                        LIVE <i className="fa-solid fa-arrow-right"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Activities, Languages & Hobbies */}
        <section className="misc-section">
          {/* Activities timeline */}
          <div className="misc-left reveal-item">
            <h2 class="misc-heading">Certifications</h2>
            <div className="Certifications-timeline">
              {certificationsData.map((cert) => (
                <div 
                  key={cert.id} 
                  className="Certifications-item"
                  onClick={() => setSelectedCertificate(cert)}
                >
                  <div className="activity-year">{cert.year}</div>
                  <h4 className="activity-title">{cert.title}</h4>
                  <p className="activity-desc">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Languages and Hobbies */}
          <div className="misc-right reveal-item" style={{ transitionDelay: '0.2s' }}>
            {/* Languages */}
            <div className="languages-box">
              <h3>Languages</h3>
              <div className="languages-grid">
                <div className="language-card">
                  <h4 className="lang-name">English</h4>
                  <p className="lang-level">Fluent Speaker</p>
                </div>
                <div className="language-card">
                  <h4 className="lang-name">Hindi</h4>
                  <p className="lang-level">Native Speaker</p>
                </div>
              </div>
            </div>

            {/* Soft Skills */}
            <section className="soft-skills" id="soft-skills">
              <h2>Soft Skills</h2>
              <div className="softskills-grid">
                <div className="skill-card">
                  <i className="fa-solid fa-puzzle-piece"></i>
                  <h3>Problem Solving</h3>
                </div>
                <div className="skill-card">
                  <i className="fa-solid fa-lightbulb"></i>
                  <h3>Critical Thinking</h3>
                </div>
                <div className="skill-card">
                  <i className="fa-solid fa-users"></i>
                  <h3>Team Collaboration</h3>
                </div>
                <div className="skill-card">
                  <i className="fa-solid fa-comments"></i>
                  <h3>Communication</h3>
                </div>
                <div className="skill-card">
                  <i className="fa-solid fa-brain"></i>
                  <h3>Quick Learner</h3>
                </div>
                <div className="skill-card">
                  <i className="fa-solid fa-rocket"></i>
                  <h3>Agile Mindset</h3>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* Section 6: Contact form & Footer */}
        <section className="contact-section" id="contact">
          <div className="contact-container">
            {/* Contact Left */}
            <div className="contact-header reveal-item">
              <h2>Get in touch!</h2>
              <p>Have an exciting project in mind or want to grab a coffee? Send me a message and let's build something beautiful.</p>
              
              <div className="contact-footer-info">
                <div className="info-block">
                  <h4>Direct Email</h4>
                  <p>champgmail@gmail.com</p>
                </div>
                <div className="info-block">
                  <h4>Social Profiles</h4>
                  <div className="social-links">
  <a
    href="https://www.linkedin.com/in/thechamphub/"
    target="_blank"
    rel="noopener noreferrer"
    className="social-item"
  >
    LinkedIn
  </a>

  <span className="separator">•</span>

  <a
    href="https://github.com/thechampgit"
    target="_blank"
    rel="noopener noreferrer"
    className="social-item"
  >
    GitHub
  </a>

  <span className="separator">•</span>

  <a
    href="https://discord.com/channels/@me"
    target="_blank"
    rel="noopener noreferrer"
    className="social-item"
  >
    Discord
  </a>

  <span className="separator">•</span>

  <a
    href="https://www.instagram.com/raszpberryy/"
    target="_blank"
    rel="noopener noreferrer"
    className="social-item"
  >
    Instagram
  </a>
</div>
  </div>            </div>
            </div>
 
            {/* Contact Right: Form Component */}
            <ContactForm />
          </div>

          <div className="footer-bottom">
            {/* Stars only inside the footer bottom section */}
            <div className="star-twinkle-interactive" style={{ top: '10px', left: '15%', fontSize: '0.8rem', animationDelay: '0.3s', animationDuration: '6s' }}>
              <i className="fa-solid fa-star"></i>
            </div>
            <div className="star-twinkle-interactive" style={{ top: '25px', right: '15%', fontSize: '1rem', animationDelay: '1.5s', animationDuration: '8s' }}>
              <i className="fa-solid fa-star"></i>
            </div>
            <div className="star-twinkle-interactive" style={{ top: '5px', left: '35%', fontSize: '0.6rem', animationDelay: '0.9s', animationDuration: '5s' }}>
              <i className="fa-solid fa-star"></i>
            </div>
            <div className="star-twinkle-interactive" style={{ top: '20px', right: '35%', fontSize: '0.7rem', animationDelay: '2.2s', animationDuration: '7s' }}>
              <i className="fa-solid fa-star"></i>
            </div>
            <p>&copy; {new Date().getFullYear()} Champa Jha.</p>
          </div>
        </section>
      </main>

      <ProjectDetailModal 
        project={selectedProject} 
        index={projectsData.findIndex(p => p.id === selectedProject?.id)}
        onClose={() => setSelectedProject(null)} 
      />

      <CertificateDetailModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <ChampAI />
    </>
  );
}
