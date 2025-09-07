import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StaticImageData } from "next/image";

interface Module {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    status: 'active' | 'coming-soon';
    image?: StaticImageData;
    route?: string;
}

interface ModuleCardProps {
    module: Module;
    //   onClick: () => void;
}

export const ModuleCard = ({ module }: ModuleCardProps) => {
    const { title, description, icon: Icon, status, image } = module;
    console.log("Rendering ModuleCard for:", image);
    return (
        <Card
            className="card-gradient cursor-pointer group relative overflow-hidden"
        //   onClick={onClick}
        >
            {/* Background Image */}
            {image && (
                <div
                    className="absolute inset-0 opacity-30 group-hover:opacity-50 dark:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                        backgroundImage: `url(${image.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 transition-all duration-300 ">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <Icon className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
                                    {title}
                                </CardTitle>
                            </div>
                        </div>
                        <Badge
                            className={status === 'active' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}
                            variant="secondary"
                        >
                            {status === 'active' ? 'Active' : 'Coming Soon'}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <CardDescription className="text-gray-700 dark:text-gray-400 mb-4 text-sm leading-relaxed ">
                        {description}
                    </CardDescription>

                    <Button
                        className={`w-full ${status === 'active'
                            ? 'bg-blue-500 hover:bg-blue-600 text-white transition-transform duration-200 hover:scale-105'
                            : 'bg-gray-300 text-gray-800 cursor-not-allowed'
                            }`}
                        disabled={status === 'coming-soon'}
                    >
                        {status === 'active' ? 'Launch Studio' : 'Coming Soon'}
                    </Button>
                </CardContent>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </Card>
    );
};