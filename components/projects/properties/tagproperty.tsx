import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useMainStore from "@/lib/hooks/use-main-store";

import { useState } from "react";
import { updateProjectField } from "@/lib/actions";
import { Tag, TagInput } from "emblor";
import React from "react";


export default function TagProperty() {
    const { setProjectProperty } = useMainStore();
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(null);

    return (
        <div className="max-h-40 overflow-y-auto"> {/* Set the max height and make it scrollable */}
            <div className="flex items-center space-x-12">
                <TagInput
                    placeholder="Enter a topic"
                    tags={tags}
                    setTags={(newTags) => {
                        setTags(newTags);
                        const stringTags = newTags.map(tag => tag.text);
                        setProjectProperty("tags", stringTags);
                    }}
                    activeTagIndex={activeTagIndex}
                    setActiveTagIndex={setActiveTagIndex}
                />
            </div>
        </div>
    );
}
