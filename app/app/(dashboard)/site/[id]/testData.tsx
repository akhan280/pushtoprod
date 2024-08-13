import { Site } from "@prisma/client";
import { Collaborator, Project, Technology, User } from "../../../../../lib/types";
import { LocalSiteData, Section, SiteProjects } from "../types";


const testUsers: User[] = [
  {
    id: "user1",
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    gh_username: "johndoe_gh",
    image: "",
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-08-10T12:00:00Z"),
    siteReferral: ["site1", "site2"],
    paid: true,
    siteId: "site1",
    managedAI: true,
  },
  {
    id: "user2",
    name: "Jane Smith",
    username: "janesmith",
    email: "jane@example.com",
    gh_username: "janesmith_gh",
    image: "https://example.com/jane.jpg",
    createdAt: new Date("2023-02-15T00:00:00Z"),
    updatedAt: new Date("2023-08-09T10:00:00Z"),
    siteReferral: [],
    paid: false,
    siteId: "site2",
    managedAI: true,
  }
];

const testTechnologies: Technology[] = [
  {
    id: "tech1",
    logo: "https://example.com/react-logo.png",
    name: "React",
    description: "A JavaScript library for building user interfaces"
  },
  {
    id: "tech2",
    logo: "https://example.com/typescript-logo.png",
    name: "TypeScript",
    description: "A typed superset of JavaScript that compiles to plain JavaScript"
  }
];

const testCollaborators: Collaborator[] = [
  {
    user: testUsers[0]
  },
  {
    user: testUsers[1]
  }
];

const testProjects: SiteProjects = {
  development: ['b3446c76-06ca-4798-bb46-85ecaa1f7fe6'],
  launches: ['b3446c76-06ca-4798-bb46-85ecaa1f7fe6'],
  writing: [],
  ideas: [],  
}

const testSiteData: Site = {
  id: "clzp555ph00004dblukv42fw6",
  name: "My Test Site",
  description: "A sample site for testing purposes",
  logo: "https://example.com/logo.png",
  font: "font-roboto",
  image: "https://example.com/hero-image.jpg",
  imageBlurhash: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADI...",
  subdomain: "test-site",
  customDomain: "www.mytestsite.com",
  message404: "Oops! This page doesn't exist.",
  createdAt: new Date("2023-08-10T12:00:00Z"),
  updatedAt: new Date("2023-08-10T12:00:00Z"),
  userId: testUsers[0].id,
  sections: JSON.stringify([
    {
      id: 1,
      type: "header",
      content: {
        profileUrl: testUsers[0].image,
        title: `Welcome to ${testUsers[0].name}'s Site`
      }
    },
    {
      id: 2,
      type: "textbox",
      content: {
        content: "[{\"type\":\"h2\",\"children\":[{\"text\":\"🌳 My name is Areeb, I love codin\"}]},{\"type\":\"p\",\"children\":[{\"text\":\"Easily create headings of various levels, from H1 to H6, to structure your content and make it more organized.\"}]},{\"type\":\"blockquote\",\"children\":[{\"text\":\"Create blockquotes to emphasize important information or highlight quotes from external sources.\"}]},{\"type\":\"code_block\",\"children\":[{\"type\":\"code_line\",\"children\":[{\"text\":\"// Use code blocks to showcase code snippets\"}]},{\"type\":\"code_line\",\"children\":[{\"text\":\"function greet() {\"}]},{\"type\":\"code_line\",\"children\":[{\"text\":\"  console.info('Hello World!');\"}]},{\"type\":\"code_line\",\"children\":[{\"text\":\"}\"}]}]},{\"children\":[{\"text\":\"\"}],\"type\":\"p\",\"id\":\"0xi4y\"}]"
      }
    },
    {
      id: 3,
      type: "contact",
      content: {
        socials: [
          { platform: "Email", url: `areebkhan280@gmail.com`, display: true },
          { platform: "Phone", url: `1-623-745-6654`, display: true },
          { platform: "Twitter", url: `https://twitter.com/${testUsers[0].username}`, display: true },
          { platform: "GitHub", url: `https://github.com/${testUsers[0].gh_username}`, display: true }
        ]
      }
    },
    {
      id: 4,
      type: "projects",
      content: {
        projects: testProjects
      }
    },
    
    {
      id: 5,
      type: "media",
      content: {
        mediaItems: [
        {
          href: "https://example.com/image1.jpg",
          type: "image",
        },
        {
          href: "https://example.com/video1.mp4",
          type: "video"
        }
      ]
      }
    },
    {
      id: 6,
      type: "footer",
      content: {
        quote: "This is a test footer quote."
      }
    }
  ])
};

const testLocalSiteData: LocalSiteData = {
  ...testSiteData,
  parsedSections: JSON.parse(testSiteData.sections as string) as Section[]
};

export { testSiteData, testLocalSiteData, testUsers, testProjects };