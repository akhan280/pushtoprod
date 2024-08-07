import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GithubProperty from "./properties/github-property";
import WebsiteProperty from "./properties/website-property";
import TagProperty from "./properties/tag-property";

export default function Sidebar() {
  return (
    <div className="p-4 mt-10">
        <Card className="p-4">
      <Card className="mb-6">
        <CardHeader className="text-lg font-semibold">Properties</CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            {/* <span>Status</span>
            <Badge variant="outline">Backlog</Badge> */}
            <GithubProperty/>
          </div>
          <div className="flex justify-between items-center">
            <WebsiteProperty/>
          </div>
          <div className="flex justify-between items-center">
            <TagProperty/>
          </div>
          <div className="flex justify-between items-center space-x-4">
            <span>Members</span>
            <Button variant="outline">Add members</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Teams</span>
            <Badge variant="outline">Hyperfan20</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span>Dates</span>
            <div className="flex space-x-2">
              <span>Start</span>
              <span className="text-gray-400">→</span>
              <span>Target</span>
            </div>
          </div>
        </CardContent>
      </Card>


      <div className="space-y-4 mt-20"> 
        <Card>
          <CardContent className="flex items-center">
            <span className="text-xl">💡</span>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Idea #12</h3>
              <p className="text-sm text-gray-500">Description</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <span className="text-xl">🖥</span>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Development</h3>
              <p className="text-sm text-gray-500">Working on the project</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center">
            <span className="text-xl">🚀</span>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Launch</h3>
              <p className="text-sm text-gray-500">Ready for launch</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </Card>
    </div>
  );
}
