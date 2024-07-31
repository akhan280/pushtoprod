import Editor from "../../../components/editor";
import { KanbanBoard } from "../../../components/kanban/kanban";
import { Project } from "../../../lib/types";

export default function Overview() {
  const dummyProjects: Project[] = [
    {
      id: "1",
      title: "Project 1",
      description: "Description for project 1",
      columnId: "ideas",
      collaborators: [
        {
          id: "collab1",
          email: "collab1@example.com",
          name: "Collaborator 1",
          username: "collab1",
          gh_username: "gh_collab1",
          image: "https://example.com/image1.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      notes: "Notes for project 1",
      technologies: "React, Node.js",
      githuburl: "https://github.com/project1",
    },
    {
      id: "2",
      title: "Project 2",
      description: "Description for project 2",
      columnId: "development",
      collaborators: [
        {
          id: "collab2",
          email: "collab2@example.com",
          name: "Collaborator 2",
          username: "collab2",
          gh_username: "gh_collab2",
          image: "https://example.com/image2.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      notes: "Notes for project 2",
      technologies: "Vue, Django",
      githuburl: "https://github.com/project2",
    },
    {
      id: "3",
      title: "Project 3",
      description: "Description for project 3",
      columnId: "to-launch",
      collaborators: [
        {
          id: "collab3",
          email: "collab3@example.com",
          name: "Collaborator 3",
          username: "collab3",
          gh_username: "gh_collab3",
          image: "https://example.com/image3.png",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      notes: "Notes for project 3",
      technologies: "Angular, .NET",
      githuburl: "https://github.com/project3",
    },
  ];

  const dummyPost = {
    id: "post1",
    title: "Dummy Post",
    description: "This is a dummy post",
    content: "Lorem ipsum dolor sit amet",
    slug: "dummy-post",
    image: "https://example.com/image.png",
    imageBlurhash: "U29nQ=fQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ",
    createdAt: new Date(),
    updatedAt: new Date(),
    published: true,
    siteId: "site1",
    userId: "user1",
    site: {
      id: "site1",
      name: "Dummy Site",
      description: "This is a dummy site",
      logo: "https://example.com/logo.png",
      font: "Arial",
      image: "https://example.com/site-image.png",
      imageBlurhash: "U29nQ=fQfQfQfQfQfQfQfQfQfQfQfQfQfQfQ",
      subdomain: "dummy-site",
      customDomain: "dummy-site.com",
      message404: "Page not found",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "user1",
    },
  };

  return (
    <div className="flex max-w-screen flex-col min-h-screen">
      {/* SVG Filter Definition */}
      <svg className="hidden">
        <filter id="grainy">
          <feTurbulence type="turbulence" baseFrequency="0.5"></feTurbulence>
          <feColorMatrix type="saturate" values="0"></feColorMatrix>
          <feBlend mode="multiply" in2="SourceGraphic" />
        </filter>
      </svg>

      {/* Grainy Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ opacity: 0.18 }}>
        <div className="w-full h-full" style={{ filter: 'url(#grainy)', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </div>

      <div className="flex flex-col space-y-6 z-10 items-center">
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          areeb and ani are goated
        </h1>
        <h1 className="font-cal text-3xl font-bold dark:text-white">
          YEET
        </h1>

        <h1 className="font-cal text-3xl font-bold dark:text-white">
          YEET
        </h1>
      </div>
      <div className="min-h-screen">
        <KanbanBoard fetchedProjects={dummyProjects}></KanbanBoard>
      </div>
      <Editor post={dummyPost}></Editor>
    </div>
  );
}
