import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Linkedin, Twitter, Github, Mail } from "lucide-react";
import fm from "front-matter";
import { Link } from "react-router-dom";

interface Member {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
}

interface Frontmatter {
  title?: string;
  image?: string;
  role?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
}

const TeamMemberCard = ({
  name,
  role,
  bio,
  image,
  linkedin,
  twitter,
  github,
  email,
  index,
}: Member & { index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => cardRef.current && observer.unobserve(cardRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn("glass-card group opacity-0 hover-lift", "relative overflow-hidden")}
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-display font-semibold mb-1 text-gray-900">{name}</h3>
        <p className="text-pulse-500 font-medium mb-3">{role}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{bio}</p>

        <div className="flex gap-3">
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="icon-btn">
              <Linkedin size={16} />
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" className="icon-btn">
              <Twitter size={16} />
            </a>
          )}
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="icon-btn">
              <Github size={16} />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="icon-btn">
              <Mail size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const TeamMembersList = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("/team_members/members.json");
        if (!response.ok) throw new Error("Failed to fetch list");

        const fileList: string[] = await response.json();
        const memberData = await Promise.all(
          fileList.map(async (fileName: string) => {
            try {
              const mdResponse = await fetch(`/team_members/${fileName}`);
              if (!mdResponse.ok) return null;

              const raw = await mdResponse.text();
              const { attributes } = fm<Frontmatter>(raw);

              return {
                name: fileName.replace(".md", ""),
                role: attributes.role || "Unknown Role",
                bio: attributes.bio,
                image: attributes.image || "/images/default.jpg",
                linkedin: attributes.linkedin,
                twitter: attributes.twitter,
                github: attributes.github,
                email: attributes.email,
              };
            } catch (err) {
              console.error(`Error fetching ${fileName}:`, err);
              return null;
            }
          })
        );

        setMembers(memberData.filter((m): m is Member => m !== null));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll(".fade-in-element");
            children.forEach((el, i) => {
              setTimeout(() => el.classList.add("animate-fade-in"), i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 relative bg-gray-50" ref={sectionRef}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pulse-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pulse-100/20 rounded-full blur-3xl -z-10"></div>

      <div className="section-container">
        <div className="text-center mb-12 sm:mb-16">
          <div className="pulse-chip mx-auto mb-4 opacity-0 fade-in-element">
            <span>Our Team</span>
          </div>
          <h1 className="section-title mb-4 opacity-0 fade-in-element">
            Meet the Brilliant Minds <br className="hidden sm:block" />
            Behind Atlas
          </h1>
          <p className="section-subtitle mx-auto opacity-0 fade-in-element">
            Our diverse team of engineers, scientists, and visionaries are pushing the boundaries of what's possible in humanoid robotics and artificial
            intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {members.map((member, index) => (
            <Link
              to={`/team_members/${member.name}`}
              key={member.name}
              className="block rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <TeamMemberCard {...member} index={index} />
            </Link>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16 opacity-0 fade-in-element">
          <div className="glass-card p-8 sm:p-12 mx-auto max-w-2xl">
            <h3 className="text-2xl font-display font-semibold mb-4">Join Our Mission</h3>
            <p className="text-gray-600 mb-6">
              We're always looking for passionate individuals who want to shape the future of robotics. Explore career opportunities and become part of
              something extraordinary.
            </p>
            <a href="mailto:careers@atlas-robotics.com" className="button-primary inline-flex items-center">
              View Open Positions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamMembersList;
