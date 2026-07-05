import React, { useState, useEffect } from 'react';

export default function CertificateDetailModal({ certificate, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!certificate) return;
    
    const gsap = window.gsap;
    
    const timer = setTimeout(() => {
      setIsOpen(true);
      if (!gsap) return;

      // Animate backdrop and wrapper entry
      gsap.fromTo('.cert-detail-overlay', { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo('.cert-detail-wrapper', 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );

      // Animate image container
      gsap.fromTo('.cert-image-display-container',
        { x: -50, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 1, delay: 0.2, ease: 'power4.out' }
      );

      // Animate details content
      gsap.fromTo('.cert-detail-info > *',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, stagger: 0.1, ease: 'power3.out' }
      );
    }, 50);

    return () => clearTimeout(timer);
  }, [certificate]);

  if (!certificate) return null;

  const handleClose = () => {
    const gsap = window.gsap;
    if (gsap) {
      gsap.to('.cert-detail-wrapper', { y: 60, opacity: 0, duration: 0.4, ease: 'power3.in' });
      gsap.to('.cert-detail-overlay', { opacity: 0, duration: 0.4, delay: 0.1 });
    }
    setIsOpen(false);
    
    // Wait for animations to complete before unmounting
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className={`project-detail-overlay cert-detail-overlay ${isOpen ? 'active' : ''}`} onClick={handleClose}>
      <div className="project-detail-wrapper cert-detail-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="project-detail-header">
          <button className="project-detail-close" onClick={handleClose}>
            <i className="fa-solid fa-xmark"></i> Close
          </button>
        </div>
        
        <div className="project-detail-content" style={{ maxHeight: '120vh' }}>
          <div className="project-detail-grid">
            
            {/* Visual display of certificate (Left Side) */}
            <div className="project-detail-visuals cert-image-display-container">
              <div className="main-image-display" style={{ background: '#f5f5f7', borderRadius: '10px', padding: '8px' }}>
                <img 
                  src={certificate.image} 
                  alt={certificate.title} 
                  className="cert-modal-image"
                  onClick={() => window.open(certificate.image, '_blank')}
                  title="Click to view full size"
                />
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-cream)', opacity: 0.6, marginTop: '10px' }}>
                <i className="fa-solid fa-magnifying-glass-plus"></i> Click image to view in full size
              </p>
            </div>
            
            {/* Information Sidebar (Right Side) */}
            <div className="project-detail-info cert-detail-info">
              <div className="project-detail-header-block">
                <span className="project-detail-tag">{certificate.year} • CERTIFICATION</span>
                <h2 className="project-detail-title" style={{ fontSize: '2.4rem', color: 'var(--color-cream-dark' }}>{certificate.title}</h2>
                <p className="vivid-description" style={{ color: '#f8d3d3ff', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Issued by :  <strong style={{color:'#f2eaeaff'}}>{certificate.issuer}</strong>
                </p>
              </div>
              
              <div className="editorial-divider"></div>
              
              {/* Detailed Description */}
              <div className="project-detail-section">
                <h4 className="section-title-label">Description & Learnings</h4>
                <p style={{ color: '#e7d9d9ff', lineHeight: '1.7', fontSize: '0.98rem' }}>
                  {certificate.description}
                </p>
              </div>
              
              {/* Key Skills */}
              {certificate.skills && certificate.skills.length > 0 && (
                <div className="project-detail-section">
                  <h4 className="section-title-label">Skills & Technologies</h4>
                  <div className="tech-tags">
                    {certificate.skills.map((skill, i) => (
                      <span key={i} className="tech-tag" style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-green-dark)' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
