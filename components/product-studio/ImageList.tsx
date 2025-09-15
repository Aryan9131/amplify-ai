import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { 
  Play, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Video,
  ExternalLink,
  Eye,
  AlertCircle,
  Calendar,
  FileImage,
  X,
  Maximize2,
  Info
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Image {
  _id: string;
  imageId: string,
  imageUrl: string,
  fileName: string,
  fileSize: number,
  productName: string,
  style: string,
  size: string,
  description: string,
  generatedAt: string,
  status?: "generating" | "completed" | "failed",
  generationError?: string,
  userId?: string,
  userEmail?: string,
  videoPrompt: string
}

interface VideoRecord {
  _id: string;
  videoId: string;
  videoUrl: string;
  fileName: string;
  fileSize: number;
  originalImageId: string;
  originalImageUrl: string;
  videoPrompt: string;
  productName: string;
  style: string;
  description: string;
  selectedProduct: {
    id: number;
    name: string;
    image: string;
    category: string;
  };
  generatedAt: string;
  status: "generating" | "completed" | "failed";
  generationError?: string;
  userId?: string;
  userEmail?: string;
}

interface GeneratedImagesListProps {
  userId?: string;
  generatedResult?: Image | null;
}

export default function GeneratedImagesList({ userId, generatedResult }: GeneratedImagesListProps) {
  const [generatingVideos, setGeneratingVideos] = useState<Set<string>>(new Set());
  const [videoResults, setVideoResults] = useState<Map<string, any>>(new Map());
  const [showVideoModal, setShowVideoModal] = useState<string | null>(null);

  // Fetch images and videos from Convex
  const images = useQuery(api.images.getUserImages, { userId });
  const videos = useQuery(api.videos.getUserVideos, { userId });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGenerateVideo = async (image: Image) => {
    if (generatingVideos.has(image.imageId)) return;
    
    setGeneratingVideos(prev => new Set(prev).add(image.imageId));
    
    try {
      console.log('🎬 Starting video generation for:', image.productName);
      
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: image.userId || userId,
          imageId: image.imageId,
          imageUrl: image.imageUrl,
          videoPrompt: image.videoPrompt || `Professional promotional video for ${image.productName}, ${image.style} style, high quality cinematic presentation`,
          productName: image.productName,
          style: image.style,
          description: image.description,
          selectedProduct: image.productName
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Video generation successful:', result.data);
        
        // Store video result locally for immediate display
        setVideoResults(prev => new Map(prev).set(image.imageId, result.data));
        
        // Show success notification with options
        const shouldOpenVideo = window.confirm(
          `🎉 Video generated successfully!\n\nWould you like to view it now?`
        );
        
        if (shouldOpenVideo) {
          setShowVideoModal(result.data.videoUrl);
        }
        
      } else {
        console.error('❌ Video generation failed:', result.error);
        alert(`❌ Video generation failed: ${result.error}\n\nService: ${result.details?.service || 'Unknown'}`);
      }
      
    } catch (error) {
      console.error('❌ Video generation error:', error);
      alert('❌ Video generation failed. Please check your connection and try again.');
    } finally {
      setGeneratingVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(image.imageId);
        return newSet;
      });
    }
  };

  const getVideoForImage = (imageId: string): VideoRecord | any => {
    // First check local results
    const localVideo = videoResults.get(imageId);
    if (localVideo) return localVideo;
    
    // Then check Convex videos
    const convexVideo = videos?.find(v => v.originalImageId === imageId);
    return convexVideo;
  };

  const StatusBadge = ({ status }: { status?: "generating" | "completed" | "failed" }) => {
    const variants = {
      completed: { variant: "default" as const, icon: CheckCircle, label: "Ready", className: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" },
      generating: { variant: "secondary" as const, icon: Clock, label: "Generating", className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" },
      failed: { variant: "destructive" as const, icon: XCircle, label: "Failed", className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" }
    };

    if (!status) return null;
    
    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} px-2 py-1 text-xs font-medium`}>
        <Icon className={`w-3 h-3 mr-1 ${status === 'generating' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  };

  const VideoModal = ({ videoUrl, onClose }: { videoUrl: string, onClose: () => void }) => (
    <Dialog open={!!videoUrl} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-muted border shadow-2xl">
        <DialogHeader className="p-4 border-b bg-muted/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-lg font-semibold text-foreground">Generated Video</DialogTitle>
              <p className="text-sm text-muted-foreground">AI-generated promotional content</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="relative rounded-lg overflow-hidden bg-black/5 dark:bg-black/20 mb-4">
            <video 
              src={videoUrl} 
              controls 
              autoPlay 
              className="w-full h-auto max-h-[50vh] rounded-lg"
              style={{ aspectRatio: '16/9' }}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => window.open(videoUrl, '_blank')}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-sm"
              size="sm"
            >
              <Maximize2 className="w-4 h-4" />
              Open Full Screen
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const a = document.createElement('a');
                a.href = videoUrl;
                a.download = `generated-video-${Date.now()}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              className="flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(videoUrl);
                // You could add a toast notification here
              }}
              className="flex items-center gap-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (!images) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-square w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <FileImage className="w-8 h-8 text-muted-foreground/60" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Generated Images</h3>
        <p className="text-muted-foreground text-center text-sm max-w-md">
          Start by generating your first product image to create amazing promotional videos.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((image) => {
            const associatedVideo = getVideoForImage(image.imageId);
            const isGeneratingVideo = generatingVideos.has(image.imageId);
            
            return (
              <Card key={image._id} className="group overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 hover:border-border bg-card">
                {/* Image Preview */}
                <div className="relative aspect-square overflow-hidden bg-muted/30">
                  <img
                    src={image.imageUrl}
                    alt={image.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Top Badges Row */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start gap-2">
                    {/* Video Badge */}
                    {associatedVideo && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 px-2 py-1 text-xs font-medium">
                        <Video className="w-3 h-3 mr-1" />
                        Video Ready
                      </Badge>
                    )}
                    
                    {/* Status Badge */}
                    <StatusBadge status={image.status} />
                  </div>

                  {/* File Size Badge */}
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Badge variant="secondary" className="bg-black/70 text-white border-0 backdrop-blur-sm text-xs">
                      {formatFileSize(image.fileSize)}
                    </Badge>
                  </div>
                </div>
                
                {/* Card Content */}
                <CardContent className="p-3 space-y-3">
                  {/* Product Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground text-sm truncate leading-tight">{image.productName}</h4>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                        {image.style}
                      </Badge>
                      <span className="text-xs opacity-60">•</span>
                      <span className="text-xs">{image.size}</span>
                    </div>
                    
                    {image.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {image.description}
                      </p>
                    )}

                    {/* Generation Date */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(image.generatedAt)}</span>
                    </div>
                  </div>

                  {/* Video Info Section */}
                  {associatedVideo && (
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-200/50 dark:border-purple-800/30">
                      <div className="flex items-center gap-2">
                        <Video className="w-3 h-3 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-purple-700 dark:text-purple-300 text-xs">
                            Video Generated
                          </div>
                          <div className="text-purple-600 dark:text-purple-400 text-xs">
                            1280×720 • {formatFileSize(associatedVideo.fileSize || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Primary Action Button */}
                    {associatedVideo ? (
                      <Button
                        size="sm"
                        onClick={() => setShowVideoModal(associatedVideo.videoUrl)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-medium text-xs h-8"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Video
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleGenerateVideo(image)}
                        disabled={isGeneratingVideo || image.status !== 'completed'}
                        className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground font-medium disabled:text-muted-foreground text-xs h-8"
                      >
                        {isGeneratingVideo ? (
                          <>
                            <Clock className="w-3 h-3 mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-1" />
                            Create Video
                          </>
                        )}
                      </Button>
                    )}
                    
                    {/* Secondary Actions */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(image.imageUrl, '_blank')}
                      className="px-2 h-8"
                      title="Download Image"
                    >
                      <Download className="w-3 h-3" />
                    </Button>

                    {associatedVideo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(associatedVideo.videoUrl, '_blank')}
                        className="px-2 h-8 border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-900/10"
                        title="Download Video"
                      >
                        <Video className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {/* Error Display */}
                  {image.status === 'failed' && image.generationError && (
                    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10 p-2">
                      <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-red-700 dark:text-red-300 text-xs ml-2">
                        {image.generationError}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        videoUrl={showVideoModal || ''} 
        onClose={() => setShowVideoModal(null)} 
      />
    </>
  );
}