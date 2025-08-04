import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import fm from 'front-matter';

interface Frontmatter {
  title?: string;
  role?: string;
  image?: string;
}

interface TeamMemberPageProps {
  memberName: string;
}

const TeamMemberPage: React.FC<TeamMemberPageProps> = ({ memberName }) => {
  const [markdown, setMarkdown] = useState<string>('');
  const [frontmatter, setFrontmatter] = useState<Frontmatter>({});

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

  return (
    <div className="team-member-profile container mx-auto p-4">
      {frontmatter.title && <h1 className="text-3xl font-bold mb-4">{frontmatter.title}</h1>}
      {frontmatter.role && <p className="text-xl text-gray-600 mb-4">{frontmatter.role}</p>}
      {frontmatter.image && (
        <img
          src={frontmatter.image}
          alt={frontmatter.title}
          className="w-48 h-48 object-cover rounded-full mb-4 mx-auto"
        />
      )}
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default TeamMemberPage;