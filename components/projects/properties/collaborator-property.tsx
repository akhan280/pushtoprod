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
import { Collaborator, User } from "@/lib/types";

export default function CollaboratorProperty() {
    const { selectedProject, setProjectProperty } = useMainStore();
    const [inputValue, setInputValue] = useState("");

    const handleInvite = () => {
        //TODO:
        //Find user using username? or email??
        const newUser: User = {
            id: uuid(),
            name: inputValue, // You might replace this with a name from input
            username: inputValue, // You might replace this with a username from input
            email: null,
            gh_username: null,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            paid: false,
        };

        // Create a new collaborator with the new user
        const newCollaborator: Collaborator = {
            user: newUser,
        };

        // Add the new collaborator to the existing collaborators
        const updatedCollaborators = [...(selectedProject?.collaborators || []), newCollaborator];
        setProjectProperty("collaborators", updatedCollaborators);

        // Reset the input field
        setInputValue("");
    };

    return (
        <div>
            {selectedProject?.collaborators.length == 1 ? (
                <div className="flex items-center space-x-12">
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2">

                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-700">me</span>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>Invite</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input
                                    type="string"
                                    placeholder="Invite"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)} />
                                <Button onClick={handleInvite}>Enter</Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger>Multiple</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                                type="url"
                                placeholder="Add Website"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)} />
                            <Button onClick={handleInvite}>Enter</Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>

    );
}
function uuid(): string {
    throw new Error("Function not implemented.");
}

