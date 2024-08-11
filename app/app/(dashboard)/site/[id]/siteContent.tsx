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
import { LocalSiteData, Section, Header, TextBox, Contact, Media, Footer } from "../types";
import { GripVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/plate-ui/avatar";
import { Input } from "../../../../../components/ui/input";
import { toast } from "sonner";
import useMainStore from "../../../../../lib/hooks/use-main-store";

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
          {localSite.parsedSections.map((section) => (
            <SectionComponent 
              key={section.id} 
              sectionId={section.id} 
              isOver={activeId === section.id}
            />
          ))}
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
  const isContact = (content: any): content is Contact => 'email' in content;
  const isMedia = (content: any): content is Media[] => Array.isArray(content) && content.every(item => 'href' in item && 'type' in item);
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
        return isTextBox(section.content) ? <p>{section.content.content}</p> : null;
      case "contact":
        return isContact(section.content) ? <div>Contact: {section.content.email}</div> : null;
      case "projects":
        return <div>Projects: {}</div>;
      case "media":
        return isMedia(section.content) ? (
          <div>
            Media:
            {section.content.map((item, index) => (
              <div key={index}>
                {item.type === 'image' ? (
                  <img src={item.href} alt={item.alt || ''} />
                ) : (
                  <video src={item.href} />
                )}
              </div>
            ))}
          </div>
        ) : null;
      case "footer":
        return isFooter(section.content) ? <footer>{section.content.quote}</footer> : null;
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