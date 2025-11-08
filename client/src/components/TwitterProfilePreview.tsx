import { forwardRef } from "react";
import BannerCanvas, { type CanvasHandle } from "./BannerCanvas";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FabricObject } from "fabric";

interface TwitterProfilePreviewProps {
  background: string;
  showSafeZone: boolean;
  onSelectionChange?: (object: FabricObject | null) => void;
  onAddIcon?: (svgString: string) => void;
  onAddImage?: (imageUrl: string) => void;
}

const TwitterProfilePreview = forwardRef<CanvasHandle, TwitterProfilePreviewProps>(
  ({ background, showSafeZone, onSelectionChange, onAddIcon, onAddImage }, ref) => {
    // Static profile data for preview
    const profileData = {
      name: "Your Name",
      username: "@username",
      bio: "Your bio goes here • Building awesome things",
      following: "234",
      followers: "1,234",
      avatarUrl: "https://github.com/github.png",
    };

    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] p-8 overflow-auto">
        {/* Twitter Profile Preview Container */}
        <div className="relative bg-background rounded-lg overflow-hidden shadow-2xl" style={{ width: '600px' }}>
          {/* Banner Canvas - Scaled to fit Twitter desktop width */}
          <div className="relative" style={{ width: '600px', height: '200px', overflow: 'hidden' }}>
            <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '1500px', height: '500px' }}>
              <BannerCanvas
                ref={ref}
                background={background}
                showSafeZone={showSafeZone}
                hideControls={true}
                onSelectionChange={onSelectionChange}
              />
            </div>
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

        {/* Preview Info */}
        <div className="mt-4 text-center">
          <Badge variant="secondary" className="text-xs">
            Twitter Profile Preview (40% scale)
          </Badge>
          <p className="text-xs text-white/50 mt-2">
            Actual banner size: 1500 × 500 px
          </p>
        </div>
      </div>
    );
  }
);

TwitterProfilePreview.displayName = "TwitterProfilePreview";

export default TwitterProfilePreview;
