"use client"

import { useEffect } from "react";

import { Song } from "@/types";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";

interface LikeContentProps {
    songs: Song[]
}


const LikeContent: React.FC<LikeContentProps> = ({
    songs
}) => {
    const router = useRouter();
    const { isLoading, user } = useUser();

    useEffect(() => {
        if(!isLoading && !user) {
            router.push("/");
        }
    }, [isLoading, user, router]);

    if (songs.length===0) {
        return (
            <div className="mt-4 text-neutral-400">
                No songs available
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {songs.map((song: any) => (
                <div 
                    key={song.id}
                    className="flex items-center gap-x-4 w-full"
                >
                    <div className="flex-1">
                        <MediaItem onClick={() => {}}
                        data={song}
                        />    
                    </div>
                    <LikeButton songId={song.id} />
                </div>
            ))}
        </div>
    )
}

export default LikeContent
