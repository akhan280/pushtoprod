"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';


// Define the item interface
interface Item {
  name: string;
  id: number;
}

interface HomeProps {
  // You can add any additional props if needed
}

const Home: React.FC<HomeProps> = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [items, setItems] = useState<Item[]>([
    { name: 'NextJS', id: 1693653637084 },
    { name: 'ReactJS', id: 1693653637086 },
    { name: 'Astro', id: 1693653637088 },
    { name: 'Vue', id: 1693653637090 },
  ]);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);

        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  }

  function handleDelete(idToDelete: number) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== idToDelete));
  }

  let idx = Date.now();

  function addNewItem(newItem: string) {
    setItems((prevItems) => [...prevItems, { name: newItem, id: idx }]);
  }

  return (
    <main className='flex justify-center items-center h-screen px-2 mx-auto select-none'>
      <Card className='w-full md:max-w-lg'>
        <CardHeader className='space-y-1 '>
          <CardTitle className='text-2xl flex justify-between'>
            Frameworks
            {/* <AddNewItem addNewItem={addNewItem} /> */}
          </CardTitle>
          <CardDescription>List Popular web development frameworks</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableLinks key={item.id} id={item} onDelete={handleDelete} />
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </main>
  );
};

export default Home;

interface Item {
    id: number;
    name: string;
}

interface SortableLinkCardProps {
    id: Item;
    onDelete: (id: number) => void;
}

const SortableLinks: FC<SortableLinkCardProps> = ({ id, onDelete }) => {
    const uniqueId = id.id;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: uniqueId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleButtonClick = () => {
        onDelete(uniqueId);
    };

    const isCursorGrabbing = attributes['aria-pressed'];

    return (
        <div ref={setNodeRef} style={style} key={uniqueId}>
            <Card className='p-4 relative flex justify-between gap-5 group'>
                <div>{id.name}</div>
                <div className='flex justify-center items-center gap-4'>
                    <button className="hidden group-hover:block" onClick={handleButtonClick}>
                        <svg className='text-red-500' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                    <button {...attributes} {...listeners} className={` ${isCursorGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`} aria-describedby={`DndContext-${uniqueId}`}>
                        <svg viewBox="0 0 20 20" width="15">
                            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"
                                fill="currentColor"></path>
                        </svg>
                    </button>
                </div>
            </Card>
        </div>
    );
};
