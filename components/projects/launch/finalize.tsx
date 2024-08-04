// import { Card, CardContent, CardHeader } from 

import { Card, CardContent, CardHeader } from "../../ui/card";
import React from "react";

export default function Finalize() {
  return (
    <div className="p-4 mt-10">
        <Card className="p-4">
      <Card className="mb-6">
        <CardHeader className="text-lg font-semibold">Finalize</CardHeader>
        <CardContent className="space-y-4">
          
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
