import { forwardRef, useEffect } from "react";
import BannerCanvas, { type CanvasHandle } from "./BannerCanvas";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FabricObject } from "fabric";

interface TwitterProfilePreviewProps {
  background: string;
  showSafeZone: boolean;
  hideControls?: boolean;
  onSelectionChange?: (object: FabricObject | null) => void;
  onExport?: () => void;
}

const TwitterProfilePreview = forwardRef<CanvasHandle, TwitterProfilePreviewProps>(
  ({ background, showSafeZone, hideControls = false, onSelectionChange, onExport }, ref) => {
    // Static profile data for preview
    const profileData = {
      name: "Your Name",
      username: "@username",
      bio: "Your bio goes here • Building awesome things",
      following: "234",
      followers: "1,234",
      avatarUrl: "https://github.com/github.png",
    };

    // Apply Fabric zoom instead of CSS transform
    const canvasZoom = hideControls ? 0.4 : 1.0;
    const containerWidth = hideControls ? 600 : 1500;
    const containerHeight = hideControls ? 200 : 500;

    // Apply zoom to Fabric canvas when mode changes
    useEffect(() => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.setCanvasZoom(canvasZoom);
      }
    }, [canvasZoom, ref]);

    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] p-8 overflow-auto">
        {/* Twitter Profile Preview Container */}
        <div className="relative bg-background rounded-lg overflow-hidden shadow-2xl" style={{ width: `${containerWidth}px` }}>
          {/* Banner Canvas - Using Fabric zoom instead of CSS transform */}
          <div className="relative" style={{ width: `${containerWidth}px`, height: `${containerHeight}px`, overflow: 'hidden' }}>
            <BannerCanvas
              ref={ref}
              background={background}
              showSafeZone={showSafeZone}
              hideControls={hideControls}
              onSelectionChange={onSelectionChange}
              onExport={onExport}
            />
          </div>

          {/* Profile Information Section */}
          <div className="relative px-4 pt-2 pb-4">
            {/* Profile Picture - Overlays the banner */}
            <div className="absolute -top-10 left-4">
              <Avatar className="w-[120px] h-[120px] border-4 border-background">
                <AvatarImage src={profileData.avatarUrl} />
                <AvatarFallback className="text-2xl font-bold">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Follow Button */}
            <div className="flex justify-end mb-12">
              <Button variant="outline" className="rounded-full font-bold" data-testid="button-follow-preview">
                Follow
              </Button>
            </div>

            {/* Name and Username */}
            <div className="space-y-0.5 mb-3">
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground">{profileData.username}</p>
            </div>

            {/* Bio */}
            <p className="text-sm mb-3">{profileData.bio}</p>

            {/* Stats */}
            <div className="flex gap-4 text-sm">
              <div>
                <span className="font-bold text-foreground">{profileData.following}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold text-foreground">{profileData.followers}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Info */}
        <div className="mt-4 text-center">
          <Badge variant="secondary" className="text-xs">
            {hideControls ? 'Preview Mode (40% zoom)' : 'Editor Mode'}
          </Badge>
          <p className="text-xs text-white/50 mt-2">
            Banner size: 1500 × 500 px
          </p>
        </div>
      </div>
    );
  }
);

TwitterProfilePreview.displayName = "TwitterProfilePreview";

export default TwitterProfilePreview;
