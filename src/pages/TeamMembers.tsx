import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: "Engineering" | "Design" | "ML/AI" | "Product" | "Data";
  bio: string;
  avatar: string;
  skills: string[];
  location: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    department: "Engineering", 
    bio: "Full-stack developer with 8+ years of experience building scalable web applications. Passionate about clean code and mentoring junior developers.",
    avatar: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png",
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    location: "San Francisco, CA"
  },
  {
    id: "2", 
    name: "Marcus Rodriguez",
    role: "Lead UI/UX Designer",
    department: "Design",
    bio: "Design systems expert focused on creating intuitive user experiences. Previously worked at major tech companies designing products used by millions.",
    avatar: "/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping", "Accessibility"],
    location: "Austin, TX"
  },
  {
    id: "3",
    name: "Dr. Priya Patel", 
    role: "Senior ML Engineer",
    department: "ML/AI",
    bio: "PhD in Computer Science specializing in deep learning and natural language processing. Leading our AI initiatives and research.",
    avatar: "/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png",
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
    location: "Boston, MA"
  },
  {
    id: "4",
    name: "Alex Kim",
    role: "Frontend Engineer", 
    department: "Engineering",
    bio: "React specialist with a keen eye for performance optimization and modern web technologies. Loves building beautiful, fast user interfaces.",
    avatar: "/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png",
    skills: ["React", "Next.js", "Tailwind CSS", "GraphQL", "Performance"],
    location: "Seattle, WA"
  },
  {
    id: "5",
    name: "Maya Johnson",
    role: "Data Scientist",
    department: "Data", 
    bio: "Expert in statistical modeling and data visualization. Transforms complex datasets into actionable business insights.",
    avatar: "/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png",
    skills: ["Python", "R", "SQL", "Tableau", "Machine Learning"],
    location: "New York, NY"
  },
  {
    id: "6",
    name: "David Thompson",
    role: "DevOps Engineer",
    department: "Engineering",
    bio: "Infrastructure and automation specialist ensuring reliable, scalable deployments. Expert in cloud platforms and CI/CD pipelines.",
    avatar: "/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png", 
    skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    location: "Denver, CO"
  }
];

const departmentColors = {
  "Engineering": "bg-blue-100 text-blue-800",
  "Design": "bg-purple-100 text-purple-800", 
  "ML/AI": "bg-green-100 text-green-800",
  "Product": "bg-orange-100 text-orange-800",
  "Data": "bg-pink-100 text-pink-800"
};

const TeamMembers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 pt-24 pb-16">
        <div className="section-container text-center">
          <h1 className="section-title text-gray-900">Meet Our Team</h1>
          <p className="section-subtitle mx-auto">
            A diverse group of talented professionals passionate about building the future of technology
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Name and Role */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {member.role}
                  </p>
                  
                  {/* Department Badge */}
                  <Badge 
                    variant="secondary" 
                    className={`mb-3 ${departmentColors[member.department]}`}
                  >
                    {member.department}
                  </Badge>
                  
                  {/* Location */}
                  <p className="text-sm text-gray-500 mb-3">📍 {member.location}</p>
                  
                  {/* Bio */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {member.bio}
                  </p>
                  
                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-1">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16 mt-16">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to Join Our Team?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion for innovation and excellence.
          </p>
          <button className="button-primary">
            View Open Positions
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TeamMembers;