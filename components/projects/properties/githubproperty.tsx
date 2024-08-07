import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useMainStore from "@/lib/hooks/use-main-store";

export default function GithubProperty() {
    const { selectedProject} = useMainStore();
    return (
        <div>
        {selectedProject?.githuburl ? (
            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-700">project_name</span>
            </div>
          ) : (
            <Button className="flex items-center space-x-2">
              <img src="/path/to/github-icon.svg" alt="GitHub" className="w-5 h-5" />
              <span>Link GitHub</span>
            </Button>
          )}
        </div>
       
    );
}
