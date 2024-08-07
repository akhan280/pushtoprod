import { Button } from "@/components/ui/button";
import useMainStore from "@/lib/hooks/use-main-store";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function WebsiteProperty() {
    const { selectedProject, setProjectProperty } = useMainStore();
    const [inputValue, setInputValue] = useState("");

    const handleLinkWebsite = () => {

        console.log("Here")
        setProjectProperty("websiteurl", inputValue)
        
    };
    return (
        <div>
            {selectedProject?.websiteurl ? (
                <div className="flex items-center space-x-12">
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <a 
                            href={selectedProject.websiteurl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-700">
                            {selectedProject.websiteurl}
                        </a>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>Edit</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input
                                    type="url"
                                    placeholder="Edit"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)} />
                                <Button onClick={handleLinkWebsite}>Enter</Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger>Link Website</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                                type="url"
                                placeholder="Add Website"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)} />
                            <Button onClick={handleLinkWebsite}>Enter</Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>

    );
}
