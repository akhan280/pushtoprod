"use client"

import { useEffect, useCallback, useState, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  PointerSensor,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LocalSiteData, Section, Header, TextBox, Contact, Media, Footer, MediaItem, SiteProjects } from "../types";
import { Github, GripVertical, Instagram, Linkedin, Sparkles, Twitter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/plate-ui/avatar";
import { Input } from "../../../../../components/ui/input";
import { toast } from "sonner";
import useMainStore from "../../../../../lib/hooks/use-main-store";
import { PlateEditor } from "../../../../../components/projects/plate";
import { Plate, Value } from "@udecode/plate-common";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { FixedToolbar } from "../../../../../components/ui/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "../../../../../components/ui/plate-ui/fixed-toolbar-buttons";
import { Editor } from "../../../../../components/ui/plate-ui/editor";
import { FloatingToolbar } from "../../../../../components/ui/plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "../../../../../components/ui/plate-ui/floating-toolbar-buttons";
import { ELEMENT_H2 } from "@udecode/plate-heading";
import {
  plugins,
} from "@/plateconfig";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd/dist/core";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import { Label } from "../../../../../components/ui/label";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { MultiSelect } from "../../../../../components/ui/multi-select-dropdown";
import { getAllColumnProjects, getMultipleProjects } from "@/lib/site-actions";
import { ProjectContextMenu } from "../../../../../components/ui/project-sections-menu";

export function SiteRender({ initialSiteData, url }: { initialSiteData: LocalSiteData, url: string }) {
  const { localSite, setLocalSiteData, moveSection } = useMainStore();
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    setLocalSiteData(initialSiteData);
  }, [initialSiteData, setLocalSiteData]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
    useSensor(PointerSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic here if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localSite!.parsedSections.findIndex((section) => section.id === active.id);
      const newIndex = localSite!.parsedSections.findIndex((section) => section.id === over?.id);
      moveSection(oldIndex, newIndex);
    }
    setActiveId(null);
  };

  if (!localSite) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={localSite.parsedSections.map((section) => section.id)}>
        <div className="flex flex-col justify-center items-center">
          <div>

        {localSite.parsedSections.map((section) => (
          <SectionComponent
            key={section.id}
            sectionId={section.id}
            isOver={activeId === section.id}
          />
        ))}
                  </div>
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <SectionComponent
            sectionId={activeId}
            isOver={false}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function SectionComponent({ sectionId, isOver }: { sectionId: number, isOver: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: sectionId });
  const { localSite, updateSection } = useMainStore();

  const section = localSite!.parsedSections.find(s => s.id === sectionId)!;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transform ? 'transform 200ms ease' : undefined
  };

  const handleUpdate = useCallback((field: string, value: any) => {
    updateSection(sectionId, { content: { ...section.content, [field]: value } });
  }, [sectionId, section.content, updateSection]);

  const isHeader = (content: any): content is Header => 'title' in content;
  const isTextBox = (content: any): content is TextBox => 'content' in content;
  const isContact = (content: any): content is Contact => 'socials' in content;
  const isMedia = (content: any): content is Media => 'mediaItems' in content;
  // Array.isArray(content) && content.every(item => 'href' in item && 'type' in item);
  const isFooter = (content: any): content is Footer => 'quote' in content;

  const renderContent = () => {
    switch (section.type) {
      case 'header':
        return isHeader(section.content) ? (
          <div className="flex flex-row gap-3">
            <Uploader
              onUpdate={handleUpdate}
              imageUrl={section.content.profileUrl}
              title={section.content.title}
            />
          </div>
        ) : null;
      case "textbox":
        return isTextBox(section.content) ?
          <div>
            <SitePlateEditor handleUpdate={handleUpdate} section={section}></SitePlateEditor></div> : null;

      case "contact":
        return isContact(section.content) ? <div><ShowContact section={section}></ShowContact><ContactDialog handleUpdate={handleUpdate} section={section}></ContactDialog></div> : null;
      case "projects":
        return <div><ProjectsDisplay section={section}></ProjectsDisplay></div>;
      case "media":
        return isMedia(section.content) ? (
          <MediaCarousel section={section} handleUpdate={handleUpdate}></MediaCarousel>
        ) : null;
      case "footer":
        return isFooter(section.content) ? <FooterDialog section={section} handleUpdate={handleUpdate} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-row flex-shrink-0 flex-grow-0 ${isOver ? 'bg-gray-700' : ''}`} ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners}>
        <GripVertical />
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
}

function Uploader({ onUpdate, imageUrl, title }: { onUpdate: (field: string, value: any) => void, imageUrl: string, title: string }) {
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size / 1024 / 1024 > 50) {
      toast.error("File size too big (max 50MB)");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "content-type": file.type || "application/octet-stream" },
        body: file,
      });

      if (response.ok) {
        const { url } = await response.json();
        onUpdate('profileUrl', url);
        toast.success("File uploaded successfully!");
      } else {
        const error = await response.text();
        toast.error(error);
      }
    } catch (error) {
      toast.error("An error occurred while uploading");
    } finally {
      setUploading(false);
    }
  }, [onUpdate]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate('title', event.target.value);
  }, [onUpdate]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      <div onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
        {imageUrl ? (
          <Avatar>
            <AvatarImage width={30} height={30} src={imageUrl} alt={title} />
            <AvatarFallback>{title[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar>
            <AvatarFallback className="bg-gray-300">{title[0]}</AvatarFallback>
          </Avatar>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {isEditing ? (
        <Input
          defaultValue={title}
          onBlur={(e) => {
            handleTitleChange(e);
            setIsEditing(false);
          }}
          autoFocus
        />
      ) : (
        <div onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>{title}</div>
      )}
      {uploading && <span>Uploading...</span>}
    </div>
  );
}

type GetAllColumnProjectsProp = {
  columnToProject: {
    section: string; 
    projects: { title: string; description: string; id: string; display: boolean }[];
  }[];
  error: any;
};

function ProjectsDisplay({ section }: { section: Section }) {
 
  const [selectedProjects, setSelectedProjects] = useState<{ section: string; ids: string[] }[]>([]);
  const [projectDetails, setProjectDetails] = useState<{ id: string; title: string; description: string; columnId: string }[]>([]);
  const [hiddenCounts, setHiddenProjectCounts] = useState<{ [key: string]: number }>({});
  const [columnIdToProject, setColumnIdToProject] = useState<GetAllColumnProjectsProp>({ columnToProject: [], error: null });

  const frameworksList = [
    { value: "ideas", label: "ideas", icon: Sparkles },
    { value: "development", label: "development", icon: Sparkles },
    { value: "launches", label: "launches", icon: Sparkles },
    { value: "writing", label: "writing", icon: Sparkles },
  ];
  // iterate through projects
  useEffect(() => {
    const content = (section.content as { projects: SiteProjects }).projects;
    const presentSections = frameworksList.map(framework => {
      const sectionContent = content[framework.value as keyof SiteProjects];
      if (sectionContent.length > 0) {
        return { section: framework.value, ids: sectionContent ? sectionContent : [] };
      } 
      return { section: "", ids: [] };
    })
    setSelectedProjects(presentSections)
  }, [section]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const allIds = selectedProjects.flatMap(project => project.ids);
      if (allIds.length > 0) {

        // JSON (stored in DB) -> Project Object is how we render for unprotected
        // but bc we're editing our own site, we can directly fetch ALL OF OUR PROJECTS (because we own them, so we don't necessarily have to do the JSON -> Project mapping)
        // BUT when we make changes, we need to push them to JSON using the project id (because this is how an unprotected user will view the page)
        const { projects, hiddenProjectsCount, error } = await getMultipleProjects(allIds);
        const columnToProjects = await getAllColumnProjects();

        console.log('[All Projects]', projects)
        if (!error) {
          const selectedHiddenCounts = selectedProjects.reduce((acc, project) => {
            if (hiddenProjectsCount[project.section] !== undefined) {acc[project.section] = hiddenProjectsCount[project.section];}
            return acc;
          }, {} as { [key: string]: number });

          setProjectDetails(projects);
          setHiddenProjectCounts(selectedHiddenCounts);
          console.log('Column ID to Project', columnToProjects)
          setColumnIdToProject(columnToProjects);

        }
      }
    };
    fetchProjectDetails();
  }, [selectedProjects]);

  const renderProjectsForSection = (columnId: string) => {
    const sectionProjects = projectDetails.filter(project => 
      selectedProjects.find(sp => sp.section === columnId)?.ids.includes(project.id)
    );

    const columnProjects = columnIdToProject.columnToProject?.find(
      (section) => section.section === columnId
    )?.projects || [];  

    return (
      <div className="p-12">
          <div className="flex flex-row">
            <div>{columnId}</div>
            <ProjectContextMenu columnId={columnId} projects={columnProjects} />
          </div>
        {columnId === "development" && <div>development</div>}

        {sectionProjects.map((project, index) => (
          <div key={index}>
            <strong>Title:</strong> {project.title}
            <br />
            <strong>Description:</strong> {project.description}
          </div>
        ))}
       <div>{hiddenCounts[columnId as string]}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
    <MultiSelect
    options={frameworksList}
    onValueChange={setSelectedProjects}
    value={selectedProjects}
    placeholder="Select frameworks"
    variant="default"
    className="max-w-[30px]"
    animation={2}
    maxCount={3}
  />
   <div className="grid grid-cols-3">
  {selectedProjects
    .filter((selectedProject) => selectedProject.section)
    .map((selectedProject) => (
      <div key={selectedProject.section}>
        {renderProjectsForSection(selectedProject.section)}
      </div>
    ))}
</div>
</div>
  )
}

// Combine the editors into a single component with tabs

function SitePlateEditor({ handleUpdate, section }: { handleUpdate: (field: string, value: any) => void, section: Section }) {

  const handleEditorChange = async (newValue: Value) => {
    const serializedValue = JSON.stringify(newValue);
    console.log('[Editor] Setting data', serializedValue);
    const data = await handleUpdate('content', serializedValue);
  };

  const editorInitialValue = [
    {
      type: ELEMENT_H2,
      children: [
        { text: '🌳 ' },
        { text: 'Untitled' },
      ],
    },
    {
      type: ELEMENT_PARAGRAPH,
      children: [
        { text: 'Easily create headings of various levels, from H1 to H6, to structure your content and make it more organized.' },
      ],
    },
  ];

  const deserializedInitialValue: Value = section.content
    ? JSON.parse((section.content as TextBox).content)
    : editorInitialValue;


  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        onChange={handleEditorChange}
        plugins={plugins}
        initialValue={deserializedInitialValue}
      >

        <Editor />
        <FloatingToolbar>
          <FloatingToolbarButtons />
        </FloatingToolbar>
      </Plate>
    </DndProvider>
  );
}

function ShowContact({ section }: { section: Section }) {
  return (
    <div>
      {(section.content as Contact).socials.map((social, index) => (
        social.display && (
          <a key={index} href={social.url}>
            {social.platform}
          </a>
        )
      ))}
    </div>
  )
}

function ContactDialog({ handleUpdate, section }: { handleUpdate: (field: string, value: any) => void, section: Section }) {
  const [socials, setSocials] = useState((section.content as Contact).socials);


  const handleSocialChange = (index: number, field: 'url' | 'display', value: string | boolean) => {
    const updatedSocials = socials.map((social, i) => {
      if (i === index) {
        return { ...social, [field]: value };
      }
      return social;
    });
    setSocials(updatedSocials);


    handleUpdate('socials', socials);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {socials.map((social, index) => (
            <div className="grid grid-cols-4 items-center gap-4" key={index}>
              <Label htmlFor={social.platform} className="text-right">
                {social.platform}
              </Label>
              <Input
                id={social.platform}
                value={social.url}
                className="col-span-3"
                onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
              />
            </div>
          ))}
        </div>

      </DialogContent>
    </Dialog>
  );
}

interface MediaCarouselProps {
  handleUpdate: (field: string, value: any) => void;
  section: Section;
}

function MediaCarousel({ handleUpdate, section }: MediaCarouselProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(
    (section.content as Media).mediaItems || []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);


  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size / 1024 / 1024 > 50) {
      toast.error("File size too big (max 50MB)");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        const newMediaItem: MediaItem = {
          href: url,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        };

        console.log("[URL]: ", url);
        const updatedMediaItems = [...mediaItems, newMediaItem];

        console.log("updated", updatedMediaItems)

        setMediaItems(updatedMediaItems);
        handleUpdate('mediaItems', updatedMediaItems);

        console.log("updatedpt2", updatedMediaItems)
        toast.success("File uploaded successfully!");
      } else {
        const error = await response.text();
        toast.error(error);
      }
    } catch (error) {
      toast.error("An error occurred while uploading");
    } finally {
      setUploading(false);
    }
  }, [mediaItems, handleUpdate, section.content]);

  const handleAddMediaClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    console.log("MediaItems updated:", mediaItems);
  }, [mediaItems]);
  return (
    <div className="media-carousel">
      AF
      <Carousel className="w-full max-w-sm">
        <CarouselContent className="-ml-1">

          {mediaItems.length > 0 ? (
            <>
              {mediaItems.map((mediaItem, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        {mediaItem.type === 'image' ? (
                          <img
                            src={mediaItem.href}
                            alt={mediaItem.alt || 'Image'}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <video
                            src={mediaItem.href}
                            className="object-cover w-full h-full"
                            controls
                          />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
              <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                        accept="image/*,video/*"
                      />
                      <button onClick={handleAddMediaClick} disabled={uploading} className="text-2xl font-semibold">
                        + Add Media
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </>
          ) : (
            <CarouselItem className="pl-1">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={uploading}
                      accept="image/*,video/*"
                    />
                    <button onClick={handleAddMediaClick} disabled={uploading} className="text-2xl font-semibold">
                      + Add Media
                    </button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {uploading && <div>Uploading...</div>}
    </div>
  );
}
export default MediaCarousel;


function FooterDialog({ handleUpdate, section }: { handleUpdate: (field: string, value: any) => void, section: Section }) {
  const [footer, setFooter] = useState((section.content as Footer).quote)

  const handleFooterChange = async (newValue: string) => {
    setFooter(newValue)
    handleUpdate('quote', newValue);
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Footer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Footer</DialogTitle>
          <DialogDescription>
            Make changes to footer
          </DialogDescription>
        </DialogHeader>

        <Input
          id={footer}
          value={footer}
          className="col-span-3"
          onChange={(e) => handleFooterChange(e.target.value)}
        />


      </DialogContent>
    </Dialog>
  );
}

