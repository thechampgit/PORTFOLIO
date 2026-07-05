import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({
    type: '', // 'success' | 'error' | ''
    message: ''
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double-check inputs (HTML5 required validation covers this, but good practice)
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        type: 'error',
        message: 'All fields are required and must be filled.'
      });
      return;
    }

    setIsSending(true);
    setStatus({ type: '', message: '' });

    // Read values from environment variables
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Check if configuration is present
    if (!serviceId || !templateId || !publicKey || 
        serviceId === 'your_service_id_here' || 
        templateId === 'your_template_id_here' || 
        publicKey === 'your_public_key_here') {
      setStatus({
        type: 'error',
        message: 'EmailJS credentials are not configured yet. Please update the .env file with your actual keys.'
      });
      setIsSending(false);
      return;
    }

    try {
      await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully.'
      });
      // Reset form fields
      setFormData({ name: '', email: '', message: '' });
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus({
        type: 'error',
        message: error?.text || 'An error occurred while sending your message. Please try again later.'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="reveal-item" style={{ transitionDelay: '0.2s' }}>
      <form 
        ref={formRef} 
        className="contact-form" 
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label className="form-label" htmlFor="name">Your Name</label>
          <input 
            className="form-input" 
            type="text" 
            id="name" 
            name="name" // maps to default EmailJS templates
            required 
            placeholder="Manish Aggarwal"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Your Email</label>
          <input 
            className="form-input" 
            type="email" 
            id="email" 
            name="email" // maps to default EmailJS templates
            required 
            placeholder="manishofficial@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="message">Your Message</label>
          <input 
            className="form-input" 
            type="text" 
            id="message" 
            name="message" // maps to default EmailJS templates
            required 
            placeholder="Let's build a website together..."
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSending} 
          className="btn-pill btn-gold" 
          style={{ marginTop: '15px', width: 'fit-content' }}
        >
          {isSending ? (
            <>
              Sending... <i className="fa-solid fa-spinner fa-spin" style={{ marginLeft: '8px' }}></i>
            </>
          ) : (
            <>
              Send Message <i className="fa-solid fa-paper-plane" style={{ marginLeft: '8px' }}></i>
            </>
          )}
        </button>

        {status.message && (
          <div className={`form-message ${status.type}`}>
            {status.type === 'success' ? (
              <i className="fa-solid fa-circle-check"></i>
            ) : (
              <i className="fa-solid fa-triangle-exclamation"></i>
            )}
            <span>{status.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}
