import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useMainStore from "@/lib/hooks/use-main-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuPortal
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { updateProjectField } from "@/lib/actions";

export default function GithubProperty() {
    const { selectedProject, setProjectProperty } = useMainStore();
    const [inputValue, setInputValue] = useState("");

    const handleLinkWebsite = () => {

        console.log("Here")
        setProjectProperty("githuburl", inputValue)
        
    };
    return (
        <div>
            {selectedProject?.githuburl ? (
                <div className="flex items-center space-x-12">
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2">

                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-700">{selectedProject?.githuburl}</span>
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
                    <DropdownMenuTrigger>Link Github</DropdownMenuTrigger>
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
