import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  websiteUrl: string;
  score: number;
}

export const ShareButtons = ({ websiteUrl, score }: ShareButtonsProps) => {
  const shareText = `I just checked ${websiteUrl} for AdSense eligibility and got a score of ${score}/100! Check your website too at`;
  const shareUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    toast.success("Results copied to clipboard!");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const shareViaEmail = () => {
    const subject = "AdSense Eligibility Check Results";
    const body = `${shareText}\n\n${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={copyToClipboard} variant="outline" size="sm">
        <Share2 className="mr-2 h-4 w-4" />
        Copy Link
      </Button>
      <Button onClick={shareOnTwitter} variant="outline" size="sm">
        <Twitter className="mr-2 h-4 w-4" />
        Twitter
      </Button>
      <Button onClick={shareOnFacebook} variant="outline" size="sm">
        <Facebook className="mr-2 h-4 w-4" />
        Facebook
      </Button>
      <Button onClick={shareOnLinkedIn} variant="outline" size="sm">
        <Linkedin className="mr-2 h-4 w-4" />
        LinkedIn
      </Button>
      <Button onClick={shareViaEmail} variant="outline" size="sm">
        <Mail className="mr-2 h-4 w-4" />
        Email
      </Button>
    </div>
  );
};
