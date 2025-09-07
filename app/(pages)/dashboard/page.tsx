import { Button } from "@/components/ui/button";
import Image, { StaticImageData } from "next/image";

import {
  Package,
  Play,
  BookOpen,
  Wand2,
  FolderOpen,
  Palette,
  Sparkles
} from "lucide-react";
import { StatsBar } from "@/components/dashboard/Statbar";
import { ModeToggle } from "@/components/toggle-theme";
import { SidebarProvider } from "@/components/ui/sidebar";

import dashboardHero from "@/assets/dashboard-hero.jpg";
import productStudioHero from "@/assets/product-studio-hero.jpg";
import youtubeIcon from "@/assets/youtube-icon.png";
import { ModuleCard } from "@/components/dashboard/ModuleCard";

// import { useRouter } from "next/navigation";

interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'active' | 'coming-soon';
  image?: StaticImageData;
  route?: string;
}

const modules: Module[] = [
  {
    id: 'product-studio',
    title: 'Product Studio',
    description: 'Create stunning product images and promotional videos',
    icon: Package,
    status: 'active',
    image: productStudioHero,
    route: '/product-studio'
  },
  {
    id: 'youtube-creator',
    title: 'YouTube Creator Suite',
    description: 'Generate thumbnails and short video content',
    icon: Play,
    status: 'coming-soon',
    image: youtubeIcon
  },
  {
    id: 'story-generator',
    title: 'Story Generator',
    description: 'AI-powered text and visual storytelling',
    icon: BookOpen,
    status: 'coming-soon'
  },
  {
    id: 'smart-editor',
    title: 'Smart Editor',
    description: 'AI-powered image editing and enhancement',
    icon: Wand2,
    status: 'coming-soon'
  },
  {
    id: 'asset-library',
    title: 'Asset Library',
    description: 'Manage all your generated content',
    icon: FolderOpen,
    status: 'active',
    route: '/asset-library'
  },
  {
    id: 'brand-kit',
    title: 'Brand Kit',
    description: 'Manage brand colors, fonts, and logos',
    icon: Palette,
    status: 'coming-soon'
  }
];

export default function Home() {
  return (
    <div className="p-5 ">
      <div className="relative w-full mx-auto rounded-lg p-4 bg-white dark:bg-[#11151c]">
        {/* Background Image */}
        {dashboardHero && (
          <div
            className="absolute inset-0 rounded-xl shadow-lg opacity-90 dark:opacity-70 z-0 "
            style={{
              backgroundImage: `url(${dashboardHero.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.6)',
            }}
          />
        )}
        <div className="relative z-10 text-white p-6 md:p-8 lg:p-12">
          <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Welcome to Your AI Content Studio</h1>
        </div>
        <p className="mt-2 text-lg md:w-2/3 dark:text-gray-400">Transform your creative workflow with our powerful AI tools. Generate stunning product images, create engaging videos, and manage your brand assets all in one place</p>
        <Button size="lg" className="mt-4 text-xl bg-blue-500 hover:bg-blue-600 cursor-pointer text-white transition-transform duration-200 hover:scale-105 px-18 py-6">Get Started</Button>
        </div>
      </div>
      {/* StatBar Cards */}
      <StatsBar />
      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-6">Creative Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
            // onClick={() =>{console.log("Module clicked");}}
            />
          ))}
        </div>
         <div className="my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">Recent Creations</h3>
              <Button className="bg-transparent hover:bg-transparent text-blue-500 hover:text-blue-600 transition-colors">
                View All
              </Button>
            </div>
            <div className="rounded-xl p-8 text-center bg-gray-200 dark:bg-[#1a1e2d]">
              <div className="animate-bounce special-effect transition-all duration-500 p-2">
                <Sparkles className="h-15 w-15 text-blue-500 mx-auto mb-4" />
              </div>
              <h4 className="text-xl font-semibold mb-2">No creations yet</h4>
              <p className="text-muted-foreground mb-6">
                Start by creating your first AI-generated content using our Product Studio
              </p>
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105"
                // onClick={() => handleModuleClick(modules[0])}
              >
                Create Your First Project
              </Button>
            </div>
          </div>
      </div>
    </div>
  );
}
