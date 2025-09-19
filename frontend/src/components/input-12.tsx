"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Dropzone from "react-dropzone";

const ImagePreview = ({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) => (
  <div className="relative aspect-square">
    <button
      className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
      onClick={onRemove}
    >
      <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
    </button>
    <Image
      src={url}
      height={500}
      width={500}
      alt=""
      className="border border-border h-full w-full rounded-md object-cover"
    />
  </div>
);

export default function InputDemo({media, setMedia}: {media: string | null, setMedia: React.Dispatch<React.SetStateAction<string | null>>}) {
  // const [profilePicture, setProfilePicture] = useState<string | null>(null);

  return (
    <div className="w-full max-w-40">
      <div className="mt-1 w-full">
        {media ? (
          <ImagePreview
            url={media}
            onRemove={() => setMedia(null)}
          />
        ) : (
          <Dropzone
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = () => {
                  setMedia(reader.result as string);
                };
              }
            }}
            accept={{
              "image/png": [".png", ".jpg", ".jpeg", ".webp"],
            }}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => (
              <div
                {...getRootProps()}
                className={cn(
                  "w-8 h-8 border border-dashed flex items-center justify-center aspect-square rounded-md focus:outline-hidden focus:border-primary cursor-pointer",
                  {
                    "border-primary bg-secondary": isDragActive && isDragAccept,
                    "border-destructive bg-destructive/20":
                      isDragActive && isDragReject,
                  }
                )}
              >
                <input {...getInputProps()} id="profile" />
                <ImageIcon className="h-16 w-16" strokeWidth={1.25} />
              </div>
            )}
          </Dropzone>
        )}
      </div>
    </div>
  );
}
