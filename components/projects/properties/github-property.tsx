import { useState } from "react";
import Image from 'next/image';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useMainStore from "@/lib/hooks/use-main-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function GithubProperty() {
    const { selectedProject, setProjectProperty } = useMainStore();
    const [inputValue, setInputValue] = useState("");
    const [projectName, setProjectName] = useState<string | null>(null);

    const handleLinkWebsite = async () => {
        if (!inputValue) {
            // If the input is empty, reset the GitHub URL and project name
            setProjectProperty("githuburl", "");
            setProjectName(null);
            return;
        }

        try {
            // Extract owner and repo name from GitHub URL
            const urlParts = inputValue.split('/');
            const owner = urlParts[urlParts.length - 2];
            const repo = urlParts[urlParts.length - 1];

            // Fetch repository details from GitHub API
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            const data = await response.json();

            if (response.ok) {
                setProjectProperty("githuburl", inputValue);
                setProjectName(data.name);
            } else {
                console.error("Failed to fetch repository details:", data.message);
            }
        } catch (error) {
            console.error("Error fetching repository details:", error);
        }
    };

    return (
        <div>
            {selectedProject?.githuburl && selectedProject.githuburl !== "empty" && selectedProject.githuburl !== "" ? (
                <div className="flex items-center space-x-12">
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <Link 
                            href={selectedProject.githuburl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-gray-700">
                            {projectName}
                        </Link>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>Edit</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input
                                    type="url"
                                    placeholder="Edit"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <Button onClick={handleLinkWebsite}>Enter</Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button className="flex items-center space-x-2 border border-black rounded-full px-4 py-2 bg-white hover:bg-black transition-all duration-300">
                            <Image 
                                src="https://sopheddvjgzwigrybjyy.supabase.co/storage/v1/object/public/technology-logos/github.png?t=2024-08-10T02%3A46%3A23.041Z" 
                                alt="GitHub Logo" 
                                width={24} 
                                height={24} 
                                className="rounded-full"
                            />
                            <span className="text-black hover:text-white">Link Github</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                                type="url"
                                placeholder="Add GitHub URL"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <Button onClick={handleLinkWebsite}>Enter</Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}
