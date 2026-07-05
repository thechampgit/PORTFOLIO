import React, { useState, useEffect } from 'react';

export default function ProjectDetailModal({ project, index, onClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const isLeftImage = index % 2 === 0;

  useEffect(() => {
    if (!project) return;
    
    // Set active image to the main project image initially
    setActiveImage(project.image);
    
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    // Tiny delay to allow modal container to mount before GSAP queries it
    const timer = setTimeout(() => {
      setIsOpen(true);
      if (!gsap) return;

      // Animate backdrop and wrapper entry
      gsap.fromTo('.project-detail-overlay', { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo('.project-detail-wrapper', 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );

      // Determine slide directions
      const imgDirection = isLeftImage ? -80 : 80;
      const textDirection = isLeftImage ? 80 : -80;

      // Animating image mockup
      gsap.fromTo('.main-image-display-container',
        { x: imgDirection, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1, delay: 0.2, ease: 'power4.out' }
      );

      // Animating the details text components
      gsap.fromTo('.project-detail-header-block > *',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, stagger: 0.12, ease: 'power3.out' }
      );

      // Setup ScrollTrigger for scroll-reveal items inside the modal scrollable area
      if (ScrollTrigger) {
        // Refresh ScrollTrigger to recognise the new DOM elements inside modal
        ScrollTrigger.refresh();

        const scrollerSelector = '.project-detail-content';

        gsap.utils.toArray('.scroll-reveal-item').forEach((item) => {
          gsap.fromTo(item,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                scroller: scrollerSelector,
                start: 'top 85%',
                toggleActions: 'play none none none',
              }
            }
          );
        });

        // Add subtle parallax on image scroll
        gsap.to('.main-image-display img', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: '.main-image-display-container',
            scroller: scrollerSelector,
            start: 'top center',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [project, isLeftImage]);

  if (!project) return null;

  const handleClose = () => {
    const gsap = window.gsap;
    if (gsap) {
      gsap.to('.project-detail-wrapper', { y: 60, opacity: 0, duration: 0.4, ease: 'power3.in' });
      gsap.to('.project-detail-overlay', { opacity: 0, duration: 0.4, delay: 0.1 });
    }
    setIsOpen(false);
    
    // Wait for animations to complete before unmounting
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const gallery = project.gallery || [project.image];

  return (
    <div className={`project-detail-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose}>
      <div className="project-detail-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="project-detail-header">
          <button className="project-detail-close" onClick={handleClose}>
            <i className="fa-solid fa-xmark"></i> Close
          </button>
        </div>
        
        <div className="project-detail-content">
          <div className={`project-detail-grid ${isLeftImage ? '' : 'layout-reversed'}`}>
            
            {/* Visual Case Study Mockup (Left/Right alternating) */}
            <div className="project-detail-visuals main-image-display-container">
              <div className="main-image-display">
                <img src={activeImage || project.image} alt={project.title} />
              </div>
              {gallery.length > 1 && (
                <div className="thumbnail-gallery">
                  {gallery.map((img, i) => (
                    <div 
                      key={i} 
                      className={`thumbnail-item ${activeImage === img ? 'active' : ''}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img src={img} alt={`${project.title} slide ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Editorial Information Sidebar (Right/Left alternating) */}
            <div className="project-detail-info">
              <div className="project-detail-header-block">
                <span className="project-detail-tag">{project.category || 'CASE STUDY'} • {project.tag}</span>
                <h2 className="project-detail-title">{project.title}</h2>
                <p className="vivid-description">{project.vividDesc || project.desc}</p>
              </div>
              
              {/* Divider */}
              <div className="editorial-divider"></div>
              
              {/* Metadata Grid */}
              <div className="project-metadata-grid scroll-reveal-item">
                <div className="meta-item">
                  <span className="meta-label">Role</span>
                  <span className="meta-val">{project.role || 'Lead Developer'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Timeline</span>
                  <span className="meta-val">{project.timeline || 'Ongoing'}</span>
                </div>
              </div>

              {/* Key Features Block */}
              {project.features && project.features.length > 0 && (
                <div className="project-detail-section scroll-reveal-item">
                  <h4 className="section-title-label">Key Features</h4>
                  <ul className="features-editorial-list">
                    {project.features.map((feature, i) => (
                      <li key={i}>
                        <span className="feature-bullet">•</span>
                        <p>{feature}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Technologies Block */}
              {project.techStack && project.techStack.length > 0 && (
                <div className="project-detail-section scroll-reveal-item">
                  <h4 className="section-title-label">Technologies Used</h4>
                  <div className="tech-tags">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Call to Actions */}
              <div className="project-detail-links scroll-reveal-item">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-github">
                    <i className="fa-brands fa-github"></i> Codebase
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-live">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
                  </a>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
