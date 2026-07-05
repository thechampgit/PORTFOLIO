import portfolioData from '../data/portfolioData.json';

// Detect scroll actions based on text keywords
export function detectScrollAction(text) {
  const lowercaseText = text.toLowerCase();
  
  if (lowercaseText.includes('project') || lowercaseText.includes('work') || lowercaseText.includes('portfolio') || lowercaseText.includes('app') || lowercaseText.includes('game')) {
    if (lowercaseText.includes('sign language') || lowercaseText.includes('isl')) return 'project-1';
    if (lowercaseText.includes('naye pankh') || lowercaseText.includes('ngo')) return 'project-2';
    if (lowercaseText.includes('swachh') || lowercaseText.includes('sanitation')) return 'project-3';
    if (lowercaseText.includes('one piece') || lowercaseText.includes('luffy')) return 'project-4';
    if (lowercaseText.includes('selfie') || lowercaseText.includes('puzzle')) return 'project-5';
    return 'projects';
  }
  
  if (lowercaseText.includes('skill') || lowercaseText.includes('technology') || lowercaseText.includes('languages') || lowercaseText.includes('frameworks') || lowercaseText.includes('tools')) {
    return 'resume';
  }
  
  if (lowercaseText.includes('internship') || lowercaseText.includes('experience') || lowercaseText.includes('job') || lowercaseText.includes('work history')) {
    return 'resume';
  }
  
  if (lowercaseText.includes('education') || lowercaseText.includes('college') || lowercaseText.includes('school') || lowercaseText.includes('degree') || lowercaseText.includes('b.tech') || lowercaseText.includes('diploma')) {
    return 'resume';
  }

  if (lowercaseText.includes('certification') || lowercaseText.includes('nptel') || lowercaseText.includes('cisco') || lowercaseText.includes('codsoft') || lowercaseText.includes('java certificate')) {
    return 'resume';
  }
  
  if (lowercaseText.includes('contact') || lowercaseText.includes('email') || lowercaseText.includes('social') || lowercaseText.includes('github') || lowercaseText.includes('linkedin') || lowercaseText.includes('instagram') || lowercaseText.includes('phone') || lowercaseText.includes('message')) {
    return 'contact';
  }
  
  if (lowercaseText.includes('about') || lowercaseText.includes('who is') || lowercaseText.includes('biography') || lowercaseText.includes('champa')) {
    return 'about';
  }
  
  return null;
}

// Local offline responder that uses fuzzy matching on portfolioData (strictly first-person clone)
// Local offline responder that uses fuzzy matching on portfolioData (strictly first-person clone)
function localFuzzyResponse(message) {
  const msg = message.toLowerCase().trim();
  
  const relatedKeywords = [
    'champa','portfolio', 'project', 'work', 'app', 'game', 'skill', 'technology', 'language',
    'framework', 'tool', 'intern', 'experience', 'job', 'education', 'college', 'school', 'degree', 'b.tech',
    'diploma', 'certification', 'nptel', 'cisco', 'codsoft', 'contact', 'email', 'social', 'github', 'linkedin',
    'resume', 'cv', 'about', 'who', 'bio', 'hobby', 'hobbies', 'hobbi', 'interest', 'goal', 'future', 'career', 'achievement',
    'accomplish', 'award', 'strength', 'weakness', 'hire', 'why', 'help', 'greet', 'hi', 'hello', 'hey',
    'greetings', 'yo', 'sign', 'isl', 'naye', 'pankh', 'ngo', 'swachh', 'sanitation', 'luffy', 'one piece',
    'selfie', 'shuffle', 'puzzle', 'tell me about'
  ];

  const isRelated = relatedKeywords.some(keyword => msg.includes(keyword));

  if (!isRelated && (msg.includes('weather') || msg.includes('news') || msg.includes('cook') || msg.includes('recipe') || msg.includes('joke') || msg.includes('music') || msg.includes('movie') || msg.includes('today') || msg.includes('sport'))) {
    return {
      text: "I'm here to talk about my background, projects, and experience. Feel free to ask me anything about those.",
      action: null
    };
  }

  // Greetings
  if (msg.match(/\b(hi|hello|hey|greetings|hola|wasup|yo)\b/)) {
    return {
      text: "Hi! I'm Champa Jha. I'm here to chat about my background, projects, and experience. Feel free to ask me anything!",
      action: null
    };
  }

  // Help / Capabilities
  if (msg.includes('help') || msg.includes('what can you do') || msg.includes('capabilities') || msg.includes('features')) {
    return {
      text: "I can tell you all about my career, skills, and projects. For example:\n- **Projects**: I built Indian Sign Language Gen, the Naye Pankh NGO portal, E-Swachh, One Piece adventure, and Selfie Shuffle.\n- **Skills**: I work with React, Node.js, Python, Java, SQL, Firebase, and MongoDB.\n- **Education**: I'm pursuing a B.Tech in IT and hold a Diploma in Civil Engineering.\n- **Internships**: I worked as a MERN developer at Techies Gateway and completed Cisco AI training.\n- **Certifications**: I hold NPTEL Java, Cisco AI, and Codsoft AI certifications.\n- Ask me about my **strengths**, **accomplishments**, **weaknesses**, or **why you should hire me**!",
      action: null
    };
  }
  
  // Specific project details
  if (msg.includes('sign') || msg.includes('isl') || msg.includes('gesture')) {
    const proj = portfolioData.projects[0];
    return {
      text: `**${proj.title}** (${proj.tag})\n\n${proj.vividDesc}\n\n**My Role**: ${proj.role}\n**Timeline**: ${proj.timeline}\n**Tech Stack**: ${proj.techStack.join(', ')}\n\n**Key Features I implemented**:\n- ${proj.features.join('\n- ')}`,
      action: 'projects'
    };
  }
  
  if (msg.includes('naye pankh') || msg.includes('ngo') || msg.includes('fundraising')) {
    const proj = portfolioData.projects[1];
    return {
      text: `**${proj.title}** (${proj.tag})\n\n${proj.vividDesc}\n\n**My Role**: ${proj.role}\n**Timeline**: ${proj.timeline}\n**Tech Stack**: ${proj.techStack.join(', ')}\n\n**Key Features I implemented**:\n- ${proj.features.join('\n- ')}\n\n[Live Link](${proj.link})`,
      action: 'projects'
    };
  }
  
  if (msg.includes('swachh') || msg.includes('sanitation') || msg.includes('complaint')) {
    const proj = portfolioData.projects[2];
    return {
      text: `**${proj.title}** (${proj.tag})\n\n${proj.vividDesc}\n\n**My Role**: ${proj.role}\n**Timeline**: ${proj.timeline}\n**Tech Stack**: ${proj.techStack.join(', ')}\n\n**Key Features I implemented**:\n- ${proj.features.join('\n- ')}\n\n[Live Link](${proj.link})`,
      action: 'projects'
    };
  }
  
  if (msg.includes('one piece') || msg.includes('luffy') || msg.includes('pirate')) {
    const proj = portfolioData.projects[3];
    return {
      text: `**${proj.title}** (${proj.tag})\n\n${proj.vividDesc}\n\n**My Role**: ${proj.role}\n**Timeline**: ${proj.timeline}\n**Tech Stack**: ${proj.techStack.join(', ')}\n\n**Key Features I implemented**:\n- ${proj.features.join('\n- ')}`,
      action: 'projects'
    };
  }
  
  if (msg.includes('selfie') || msg.includes('shuffle') || msg.includes('puzzle') || msg.includes('jigsaw')) {
    const proj = portfolioData.projects[4];
    return {
      text: `**${proj.title}** (${proj.tag})\n\n${proj.vividDesc}\n\n**My Role**: ${proj.role}\n**Timeline**: ${proj.timeline}\n**Tech Stack**: ${proj.techStack.join(', ')}\n\n**Key Features I implemented**:\n- ${proj.features.join('\n- ')}\n\n[Live Link](${proj.link})`,
      action: 'projects'
    };
  }
  
  // Show Projects navigation
  if (msg.includes('show me your projects') || msg.includes('show your projects') || msg.includes('show projects')) {
    return {
      text: "You can find all of my projects in the Projects section of my portfolio. I've built various web apps, games, and AI projects like Indian Sign Language Gen, E-Swachh, and Selfie Shuffle.",
      action: 'projects'
    };
  }

  // All Projects general query
  if (msg.includes('project') || msg.includes('work') || msg.includes('portfolio') || msg.includes('app') || msg.includes('game')) {
    const titles = portfolioData.projects.map(p => `- **${p.title}**: ${p.desc}`).join('\n');
    return {
      text: `I have built several interactive web applications and AI tools:\n\n${titles}\n\nAsk me about any specific project (e.g. "Tell me about Indian Sign Language Gen") to see more details and live links!`,
      action: 'projects'
    };
  }
  
  // Skills query
  if (msg.includes('skill') || msg.includes('technology') || msg.includes('languages') || msg.includes('frameworks') || msg.includes('tools')) {
    const s = portfolioData.skills;
    return {
      text: `Here is my technical skillset:\n\n- **Languages**: ${s.languages.join(', ')}\n- **Frameworks**: ${s.frameworks.join(', ')}\n- **Tools**: ${s.tools.join(', ')}\n- **Concepts**: ${s.concepts.join(', ')}\n- **Soft Skills**: ${s.softSkills.join(', ')}`,
      action: 'resume'
    };
  }
  
  // Internships / Experience
  if (msg.includes('intern') || msg.includes('experience') || msg.includes('job') || msg.includes('work history')) {
    const exp = portfolioData.experience.map(e => `- **${e.title}** at _${e.institution}_ (${e.duration}) - Skills: ${e.tags.join(', ')}`).join('\n');
    return {
      text: `My practical internships & training experience include:\n\n${exp}`,
      action: 'resume'
    };
  }
  
  // Education
  if (msg.includes('education') || msg.includes('college') || msg.includes('school') || msg.includes('degree') || msg.includes('b.tech') || msg.includes('diploma') || msg.includes('study')) {
    const edu = portfolioData.education.map(e => `- **${e.title}** from _${e.institution}_ (${e.duration}) ${e.tags.length ? '- Focus: ' + e.tags.join(', ') : ''}`).join('\n');
    return {
      text: `My educational background:\n\n${edu}`,
      action: 'resume'
    };
  }
  
  // Certifications
  if (msg.includes('certification') || msg.includes('nptel') || msg.includes('cisco') || msg.includes('codsoft') || msg.includes('certificate')) {
    const certs = portfolioData.certifications.map(c => `- **${c.title}** issued by _${c.issuer}_ (${c.year})\n  _${c.description}_`).join('\n\n');
    return {
      text: `I have earned the following certifications:\n\n${certs}`,
      action: 'resume'
    };
  }
  
  // Contact info
  if (msg.includes('contact') || msg.includes('email') || msg.includes('social') || msg.includes('linkedin') || msg.includes('instagram') || msg.includes('github') || msg.includes('phone') || msg.includes('message')) {
    const p = portfolioData.personal;
    return {
      text: `You can reach out to me via the Contact section. Here are my direct links:\n\n- **Email**: [${p.email}](mailto:${p.email})\n- **LinkedIn**: [LinkedIn Profile](${p.socials.linkedin})\n- **GitHub**: [GitHub Profile](${p.socials.github})\n- **Instagram**: [Instagram Profile](${p.socials.instagram})\n- **Discord**: [Discord](${p.socials.discord})`,
      action: 'contact'
    };
  }

  // Resume navigation
  if (msg.includes('resume') || msg.includes('cv') || msg.includes('download')) {
    return {
      text: "You can download my full resume from the Resume section of this portfolio page.",
      action: 'resume'
    };
  }

  // About info
  if (msg.includes('about') || msg.includes('who is') || msg.includes('biography') || msg.includes('champa') || msg.includes('rashi') || msg.includes('yourself') || msg.includes('tell me about yourself')) {
    const p = portfolioData.personal;
    return {
      text: `Hi! I'm Champa Jha. Here's a bit about me:\n\n${p.bio}\n\nI am currently pursuing my B.Tech in Information Technology and have built multiple full-stack and interactive canvas/game applications, with a strong focus on AI integrations and clean UI design.`,
      action: 'about'
    };
  }
  
  // Hobbies
  if (msg.includes('hobby') || msg.includes('hobbies') || msg.includes('interest') || msg.includes('leisure') || msg.includes('anime') || msg.includes('one piece')) {
    const hobbies = portfolioData.hobbies.map(h => `- ${h}`).join('\n');
    return {
      text: `In my free time, here is what I enjoy doing:\n\n${hobbies}`,
      action: null
    };
  }

  // Career goals / Future aspirations
  if (msg.includes('goal') || msg.includes('aspiration') || msg.includes('future') || msg.includes('career') || msg.includes('short term') || msg.includes('long term')) {
    const g = portfolioData.careerGoals;
    return {
      text: `My career goals are structured into short-term and long-term milestones:\n\n- **Short-Term Goal**: ${g.shortTerm}\n- **Long-Term Goal**: ${g.longTerm}`,
      action: null
    };
  }

  // Strengths
  if (msg.includes('strength') || msg.includes('greatest strength')) {
    return {
      text: "I am a self-taught, hands-on builder. I learn best by designing and coding functional apps. I love taking complex, dry logic and turning it into an interactive UI—like the custom sliding fragment algorithm in Selfie Shuffle or Leaflet maps in E-Swachh.",
      action: null
    };
  }

  // Accomplishments
  if (msg.includes('accomplish') || msg.includes('achievement') || msg.includes('award') || msg.includes('success')) {
    const ach = portfolioData.achievements.map(a => `- ${a}`).join('\n');
    const acc = portfolioData.accomplishments.map(a => `- ${a}`).join('\n');
    const aw = portfolioData.awards.map(a => `- ${a}`).join('\n');
    return {
      text: `Here are my proudest achievements and accomplishments:\n\n**Achievements**:\n${ach}\n\n**Accomplishments**:\n${acc}\n\n**Awards & Recognitions**:\n${aw}`,
      action: null
    };
  }

  // Weaknesses
  if (msg.includes('weakness') || msg.includes('biggest weakness')) {
    return {
      text: "One of my areas of improvement is that I sometimes get so caught up in the details of a project or pixel-perfect design that I can spend too much time on it. I'm learning to balance that with overall milestones.",
      action: null
    };
  }

  // Why should we hire you
  if (msg.includes('why should we hire you') || msg.includes('why hire') || msg.includes('should i hire')) {
    return {
      text: "You should hire me because I am a highly motivated, hands-on developer who transitions fast and adapts to new challenges. I have practical experience in MERN stack development and AI integrations from my internships, and a proven track record of building and deploying complete applications like Indian Sign Language Gen and E-Swachh. I bring a strong problem-solving mindset and a passion for creating impactful software.",
      action: null
    };
  }

  // Frequently Asked Questions
  for (const faq of portfolioData.frequentlyAskedQuestions) {
    const questionKeywords = faq.question.toLowerCase().split(' ');
    const matchCount = questionKeywords.filter(keyword => keyword.length > 3 && msg.includes(keyword)).length;
    if (matchCount >= 2 || (msg.includes('strength') && faq.question.includes('strength')) || (msg.includes('challenge') && faq.question.includes('challenge')) || (msg.includes('civil') && faq.question.includes('Civil'))) {
      return {
        text: faq.answer,
        action: null
      };
    }
  }

  // Polite decline for completely unrelated questions
  if (!isRelated) {
    return {
      text: "I'm here to talk about my background, projects, and experience. Feel free to ask me anything about those.",
      action: null
    };
  }

  // Default fallback for missing info
  return {
    text: "I don't have enough information to answer that.",
    action: null
  };
}

// Main query entry point (calls the backend server)
export async function queryChampAI(userMessage, chatHistory = [], abortSignal = null) {
  const formattedHistory = chatHistory
    .filter(msg => msg.id && !msg.id.toString().startsWith('err-') && !msg.id.toString().startsWith('aborted-'))
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));

  const messagesPayload = [
    ...formattedHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: messagesPayload
      }),
      signal: abortSignal
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }
    
    const result = await response.json();
    const replyText = result.response.trim();
    
    const action = detectScrollAction(userMessage) || detectScrollAction(replyText);
    
    return {
      text: replyText,
      action
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.error("ChampAI service error calling backend, falling back to offline responder:", err);
    return localFuzzyResponse(userMessage);
  }
}
