import { Site } from "@prisma/client";
import { Project, Technology } from "../../../../lib/types";

// Base interfaces

  
  export interface Social {
    platform: string;
    url: string; //mailto: areebkhan280@gmail.com
    display: boolean;
  }


  
  // Main interfaces
  export interface Section {
    id: number;
    type: 'header' | 'textbox' | 'contact' | 'projects' | 'media' | 'footer';
    content: Header | TextBox | Contact | SiteProjects | Media | Footer;
  }
  
  export interface Header {
    profileUrl: string;
    title: string;
  }
  
  export interface TextBox {
    content: string;
  }
  
  export interface Contact {
    socials: Social[];
  }
  
  export interface SiteProjects {
    development: DevelopmentProject[];
    launches: LaunchProject[];
    writing: WritingProject[];
    ideas: Project[];
  }

  export interface MediaItem {
    href: string;
    type: 'image' | 'video';
    alt?: string;
    
  }
  
  export interface Media {
    mediaItems: MediaItem[];
    
  }
  
  export interface Footer {
    quote: string;
  }
  
  // Extended project interfaces
  interface DevelopmentProject extends Project {
    status: 'in-progress' | 'completed';
  }
  
  interface LaunchProject extends Project {
    productHuntRank?: number;
    launchDate: Date;
  }
  
    interface WritingProject extends Project {
    publishDate: Date;
    wordCount: number;
  }
  
  // Main site data interface
  export interface LocalSiteData extends Site {
    parsedSections: Section[];
  }

