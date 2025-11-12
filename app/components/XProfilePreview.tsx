'use client'

import { forwardRef, useEffect, useState } from "react";
import BannerCanvas, { type CanvasHandle } from "./BannerCanvas";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, MapPin, Link, Calendar } from "lucide-react";
import { FabricObject } from "fabric";

interface XProfilePreviewProps {
  background: string;
  hideControls?: boolean;
  onSelectionChange?: (object: FabricObject | null) => void;
}

const XProfilePreview = forwardRef<CanvasHandle, XProfilePreviewProps>(
  ({ background, hideControls = false, onSelectionChange }, ref) => {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    
    // Static profile data for preview
    const profileData = {
      name: "Your Name",
      username: "@username",
      bio: "Your bio goes here • Building awesome things",
      following: "234",
      followers: "1,234",
      avatarUrl: "https://github.com/github.png",
    };

    // Handle window resize for responsive canvas
    useEffect(() => {
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      
      // Set initial size
      handleResize();
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Responsive canvas sizing based on parent container
    const getResponsiveCanvasSize = () => {
      if (windowSize.width === 0) return { width: 1500, height: 500, zoom: 1 };
      
      const screenWidth = windowSize.width;
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;
      
      if (hideControls) {
        return { width: 598, height: 200, zoom: 1 };
      } else if (isMobile) {
        // Mobile: use full width with padding, max 598px
        const maxWidth = Math.min(screenWidth - 32, 598); // Account for padding, max 598px
        const scaledWidth = Math.max(maxWidth, 300); // Minimum 300px
        const scaledHeight = Math.round(scaledWidth / 3); // Maintain 3:1 aspect ratio
        return { 
          width: scaledWidth, 
          height: scaledHeight, 
          zoom: 1
        };
      } else if (isTablet) {
        // Tablet: max 598px width
        const maxWidth = Math.min(screenWidth - 48, 598); // Account for padding, max 598px
        const scaledWidth = Math.max(maxWidth, 500); // Minimum 500px
        const scaledHeight = Math.round(scaledWidth / 3);
        return { 
          width: scaledWidth, 
          height: scaledHeight, 
          zoom: 1
        };
      } else {
        // Desktop: max 598px width for preview
        const sidebarWidth = 520; // Fixed sidebar width
        const totalPadding = 96; // Padding on both sides
        const availableWidth = screenWidth - sidebarWidth - totalPadding;
        const scaledWidth = Math.max(Math.min(availableWidth, 598), 400); // Between 400px and 598px max
        const scaledHeight = Math.round(scaledWidth / 3);
        return { 
          width: scaledWidth, 
          height: scaledHeight, 
          zoom: 1
        };
      }
    };
    
    const { width: containerWidth, height: containerHeight, zoom: canvasZoom } = getResponsiveCanvasSize();

    // Apply zoom to Fabric canvas when mode changes
    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.setCanvasZoom(canvasZoom);
      }
    }, [canvasZoom, ref]);

    return (
      <div className="w-full flex flex-col items-center">
        {/* X Profile Preview Container */}
        <div className="relative bg-black dark:bg-black w-full border border-border rounded-lg overflow-hidden" style={{ width: `${containerWidth}px` }}>
          {/* Banner Canvas - Raw banner without any styling */}
          <div className="relative" style={{ width: `${containerWidth}px`, height: `${containerHeight}px`, overflow: 'hidden' }}>
            <BannerCanvas
              ref={ref}
              background={background}
              onSelectionChange={onSelectionChange}
            />
          </div>

          {/* Profile Information Section - X style */}
          <div className="relative px-4 pt-3 pb-4 bg-white dark:bg-black">
            {/* Profile Picture - Overlays the banner - responsive size */}
            <div className="absolute -top-8 md:-top-10 left-3 md:left-4">
              <Avatar className={`${windowSize.width < 768 ? 'w-16 h-16' : 'w-[120px] h-[120px]'} border-4 border-white dark:border-black`}>
                <AvatarImage src={profileData.avatarUrl} />
                <AvatarFallback className={`${windowSize.width < 768 ? 'text-lg' : 'text-2xl'} font-bold bg-muted text-muted-foreground`}>
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Follow Button */}
            <div className={`flex justify-end ${windowSize.width < 768 ? 'mb-8' : 'mb-12'}`}>
              <Button className="rounded-full font-bold text-xs md:text-sm bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-4 cursor-pointer" data-testid="button-follow-preview">
                Follow
              </Button>
            </div>

            {/* Name and Username */}
            <div className="space-y-0.5 mb-2 md:mb-3">
              <div className="flex items-center gap-1">
                <h2 className={`${windowSize.width < 768 ? 'text-base' : 'text-xl'} font-bold text-black dark:text-white`}>{profileData.name}</h2>
                <BadgeCheck className={`${windowSize.width < 768 ? 'w-4 h-4' : 'w-5 h-5'} text-primary fill-current`} />
              </div>
              <p className={`${windowSize.width < 768 ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400`}>{profileData.username}</p>
            </div>

            {/* Bio */}
            <p className={`${windowSize.width < 768 ? 'text-xs' : 'text-sm'} mb-2 md:mb-3 text-black dark:text-white`}>{profileData.bio}</p>

            {/* Location, Website, Join Date */}
            <div className={`flex flex-wrap items-center gap-3 mb-2 md:mb-3 ${windowSize.width < 768 ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400`}>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Remote</span>
              </div>
              <div className="flex items-center gap-1">
                <Link className="w-4 h-4" />
                <span className="text-primary hover:underline cursor-pointer">abc.tech</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined June 2015</span>
              </div>
            </div>

            {/* Stats */}
            <div className={`flex gap-3 md:gap-4 ${windowSize.width < 768 ? 'text-xs' : 'text-sm'}`}>
              <div>
                <span className="font-bold text-black dark:text-white">{profileData.following}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold text-black dark:text-white">{profileData.followers}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Banner size: 1500 × 500 px • Zoom: {Math.round(canvasZoom * 100)}%
          </p>
        </div>
      </div>
    );
  }
);

XProfilePreview.displayName = "XProfilePreview";

export default XProfilePreview;
