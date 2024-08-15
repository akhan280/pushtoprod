"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { generateContent } from "@/lib/actions"
import { POST } from "@/app/api/auth/route"

const platforms = [
    { id: 'producthunt', name: 'Product Hunt', logo: 'P' },
    { id: 'hackernews', name: 'Hacker News', logo: 'Y' },
    { id: 'seo', name: 'SEO', logo: 'SEO' },
    { id: 'twitter', name: 'X', logo: 'X' },
    { id: 'linkedin', name: 'LinkedIn', logo: 'in' },
    { id: 'instagram', name: 'Instagram', logo: 'IG' },
    { id: 'tiktok', name: 'TikTok', logo: 'TT' },
]

interface Platform {
    id: string;
    name: string;
    logo: string;
}


type PlatformComponentProps = {
    platform: Platform;
};

function PlatformComponent({ platform }: PlatformComponentProps) {
    const [content, setContent] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        setIsGenerating(true)
        try {
            const generatedContent = await POST(platform.id)
            setContent(generatedContent)
        } catch (error) {
            console.error('Error generating content:', error)
            setContent('Failed to generate content. Please try again.')
        }
        setIsGenerating(false)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(content)
            .then(() => alert('Content copied to clipboard!'))
            .catch(err => console.error('Failed to copy: ', err))
    }

    return (
        <Card className="p-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">{platform.name}</h2>
            <button
                className="bg-black text-white px-4 py-2 rounded mb-2"
                onClick={handleGenerate}
                disabled={isGenerating}
            >
                {isGenerating ? 'Generating...' : 'Generate'}
            </button>
            <textarea
                className="w-full h-40 p-2 border rounded mb-2"
                value={content}
                readOnly
                placeholder="Generated content will appear here..."
            />
            <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={copyToClipboard}
                disabled={!content}
            >
                Copy to Clipboard
            </button>
        </Card>
    )
}

export default function MarketRenderer() {
    const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);

    const handlePlatformToggle = (platform: Platform) => {
        setSelectedPlatforms(prev => 
            prev.some(p => p.id === platform.id)
                ? prev.filter(p => p.id !== platform.id)
                : [...prev, platform]
        )
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Let's market your product</h1>
            <p className="mb-4">We've fine tuned our models on the most successful launches in their respective platforms.</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
                {platforms.map((platform) => (
                    <Card 
                        key={platform.id}
                        className={`p-2 cursor-pointer ${selectedPlatforms.some(p => p.id === platform.id) ? 'bg-blue-100' : ''}`}
                        onClick={() => handlePlatformToggle(platform)}
                    >
                        {platform.logo}
                    </Card>
                ))}
            </div>

            {selectedPlatforms.map(platform => (
                <PlatformComponent
                    key={platform.id}
                    platform={platform}
                />
            ))}
        </div>
    )
}




//MIGHT NEED 

// function PlatformComponent({ platform }: PlatformComponentProps) {
//     const [content, setContent] = useState('')
//     const [isGenerating, setIsGenerating] = useState(false)

//     const handleGenerate = async () => {
//         setIsGenerating(true)
//         try {
//             const response = await fetch('/api/generate-content', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ platformId: platform.id }),
//             });

//             if (!response.ok) {
//                 throw new Error(await response.text());
//             }

//             const reader = response.body.getReader();
//             const decoder = new TextDecoder();
//             let result = '';

//             while (true) {
//                 const { done, value } = await reader.read();
//                 if (done) break;
//                 result += decoder.decode(value);
//                 setContent(result);  // Update content as it streams in
//             }
//         } catch (error) {
//             console.error('Error generating content:', error)
//             setContent('Failed to generate content. Please try again.')
//         }
//         setIsGenerating(false)
//     }

//     // ... (keep the copyToClipboard function and the rest of the component as is)
// }