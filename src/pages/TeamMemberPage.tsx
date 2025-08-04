import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import fm from 'front-matter';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Linkedin, Twitter, Github, Mail, MapPin, Calendar, Award } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Frontmatter {
  title?: string;
  role?: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
  location?: string;
  joinDate?: string;
  expertise?: string[];
  achievements?: string[];
  education?: string;
}

interface TeamMemberPageProps {
  memberName: string;
}

const TeamMemberPage: React.FC<TeamMemberPageProps> = ({ memberName }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({});
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        const response = await fetch(`/team_members/${memberName}.md`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();

        const { attributes, body } = fm<Frontmatter>(text);
        setFrontmatter(attributes);
        setMarkdown(body);
      } catch (error) {
        console.error('Error fetching markdown:', error);
        setMarkdown('## Content Not Found\n\nSorry, the profile you are looking for does not exist.');
      }
    };

    fetchMarkdown();
  }, [memberName]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-element");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-fade-in");
              }, index * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [markdown, frontmatter]);

  if (markdown.includes('Content Not Found')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-semibold mb-4">Team Member Not Found</h1>
          <button 
            onClick={() => navigate('/team-members')}
            className="button-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" ref={sectionRef}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pulse-100/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pulse-100/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="section-container py-12 sm:py-16 md:py-20">
          <button 
            onClick={() => navigate('/team-members')}
            className="inline-flex items-center gap-2 text-pulse-500 hover:text-pulse-600 transition-colors mb-8 opacity-0 fade-in-element"
          >
            <ArrowLeft size={20} />
            Back to Team
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="pulse-chip mb-4 opacity-0 fade-in-element">
                <span>{frontmatter.role}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-6 opacity-0 fade-in-element">
                {frontmatter.title}
              </h1>
              <div className="text-lg text-gray-600 mb-6 opacity-0 fade-in-element">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
              </div>
              
              <div className="flex gap-3 mb-8 opacity-0 fade-in-element">
                {frontmatter.linkedin && (
                  <a 
                    href={frontmatter.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-pulse-50 flex items-center justify-center text-pulse-500 hover:bg-pulse-500 hover:text-white transition-colors duration-300"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                {frontmatter.twitter && (
                  <a 
                    href={frontmatter.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-pulse-50 flex items-center justify-center text-pulse-500 hover:bg-pulse-500 hover:text-white transition-colors duration-300"
                  >
                    <Twitter size={20} />
                  </a>
                )}
                {frontmatter.github && (
                  <a 
                    href={frontmatter.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-pulse-50 flex items-center justify-center text-pulse-500 hover:bg-pulse-500 hover:text-white transition-colors duration-300"
                  >
                    <Github size={20} />
                  </a>
                )}
                {frontmatter.email && (
                  <a 
                    href={`mailto:${frontmatter.email}`}
                    className="w-10 h-10 rounded-full bg-pulse-50 flex items-center justify-center text-pulse-500 hover:bg-pulse-500 hover:text-white transition-colors duration-300"
                  >
                    <Mail size={20} />
                  </a>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-0 fade-in-element">
                {frontmatter.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin size={18} className="text-pulse-500" />
                    <span>{frontmatter.location}</span>
                  </div>
                )}
                {frontmatter.joinDate && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar size={18} className="text-pulse-500" />
                    <span>Joined {frontmatter.joinDate}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="order-1 lg:order-2 opacity-0 fade-in-element">
              {frontmatter.image && (
                <div className="relative">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src={frontmatter.image} 
                      alt={frontmatter.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pulse-500 rounded-full flex items-center justify-center shadow-lg">
                    <Award className="text-white" size={32} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {frontmatter.expertise && frontmatter.expertise.length > 0 && (
              <div className="glass-card p-8 opacity-0 fade-in-element">
                <h2 className="text-2xl font-display font-semibold mb-6">Areas of Expertise</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {frontmatter.expertise.map((skill, index) => (
                    <div key={index} className="bg-pulse-50 text-pulse-700 px-4 py-2 rounded-lg text-sm font-medium">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {frontmatter.education && (
              <div className="glass-card p-8 opacity-0 fade-in-element">
                <h2 className="text-2xl font-display font-semibold mb-6">Education</h2>
                <div className="bg-gradient-to-r from-pulse-50 to-pulse-100 p-6 rounded-xl">
                  <p className="text-pulse-700 font-medium">{frontmatter.education}</p>
                </div>
              </div>
            )}
          </div>

          {frontmatter.achievements && frontmatter.achievements.length > 0 && (
            <div className="mt-12">
              <div className="glass-card p-8 opacity-0 fade-in-element">
                <h2 className="text-2xl font-display font-semibold mb-6">Key Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {frontmatter.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-2 h-2 bg-pulse-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {frontmatter.email && (
            <div className="mt-12 text-center opacity-0 fade-in-element">
              <div className="glass-card p-8 sm:p-12 mx-auto max-w-2xl">
                <h3 className="text-2xl font-display font-semibold mb-4">Connect with {frontmatter.title?.split(' ')[0]}</h3>
                <p className="text-gray-600 mb-6">
                  Interested in learning more about their work or discussing collaboration opportunities?
                </p>
                <a 
                  href={`mailto:${frontmatter.email}`}
                  className="button-primary inline-flex items-center gap-2"
                >
                  <Mail size={20} />
                  Send Message
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamMemberPage;