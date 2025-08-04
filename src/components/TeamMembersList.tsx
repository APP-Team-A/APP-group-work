import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fm from 'front-matter';

interface Member {
  name: string;
  title: string;
  image: string;
}

interface Frontmatter {
  title?: string;
  image?: string;
}

const TeamMembersList: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/team_members/members.json');
        if (!response.ok) {
          throw new Error('Failed to fetch team members list');
        }
        const fileList: string[] = await response.json();

        const membersData = await Promise.all(
          fileList.map(async (fileName: string) => {
            try {
              const mdResponse = await fetch(`/team_members/${fileName}`);
              if (!mdResponse.ok) return null;
              const text = await mdResponse.text();

              const { attributes } = fm<Frontmatter>(text);
              return {
                name: fileName.replace('.md', ''),
                title: attributes.title || 'Unknown',
                image: attributes.image || '/images/default.jpg',
              };
            } catch (error) {
              console.error(`Error fetching ${fileName}:`, error);
              return null;
            }
          })
        );

        setMembers(membersData.filter((member): member is Member => member !== null));
      } catch (error) {
        console.error('Error fetching team members:', error);
        setMembers([]);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Team</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.length === 0 && (
          <p className="text-center col-span-full">No team members found.</p>
        )}
        {members.map((member) => (
          <Link
            key={member.name}
            to={`/team_members/${member.name}`}
            className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col items-center p-4">
              <img
                src={member.image}
                alt={member.title}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
              <h2 className="text-xl font-semibold text-center">{member.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeamMembersList;