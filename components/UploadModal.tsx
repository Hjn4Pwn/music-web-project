"use client";

import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import uniqid from "uniqid";
import { useRouter } from "next/navigation";


import { useSupabaseClient } from "@supabase/auth-helpers-react";


import useUploadModal from "@/hooks/useUploadModal"
import { useUser } from "@/hooks/useUser";

import Modal from "./Modal"
import Input from "./Input"
import Button from "./Button";

const UploadModal = () => {
    const [ isLoading, setIsLoading ] = useState(false);

    const uploadModal = useUploadModal();
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            author: "",
            title: "",
            song: null,
            image: null,
        }
    })
    const onChange = (open: boolean)  => {
        if(!open)
        {
            //Reset the form
            reset();
            uploadModal.onClose();
        }
    }
    const onSubmit : SubmitHandler<FieldValues> = async (values) => {
        //Upload to supabase
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!imageFile || !songFile || !user) {
                toast.error("Please select a song and image file");
                return;
            }

            const uniqueID = uniqid();

            //Upload song
            const {
                data: songData,
                error: songError,
            } = await supabaseClient
                .storage
                .from("songs")
                .upload(
                    `song-${values.title}-${uniqueID}`, songFile, {
                        cacheControl: "3600",
                        upsert: false,
                });
            
            if (songError) {
                setIsLoading(false);
                return toast.error("Error uploading song");
            }
            //Upload image
            const {
                data: imageData,
                error: imageError,
            } = await supabaseClient
                .storage
                .from("images")
                .upload(
                    `image-${values.title}-${uniqueID}`, imageFile, {
                        cacheControl: "3600",
                        upsert: false,
                });

            
            if (imageError) {
                setIsLoading(false);
                return toast.error("Error uploading image");
            }

            // Create record
                const { error: supabaseError } = await supabaseClient
                    .from("songs")
                    .insert({
                        user_id: user.id,
                        title: values.title,
                        author: values.author,
                        image_path: imageData.path,
                        song_path: songData.path,
                    });
                if (supabaseError) {
                    setIsLoading(false);
                    return toast.error(supabaseError.message);
                }

                router.refresh();
                setIsLoading(false);
                toast.success("Song uploaded successfully");
                reset();
                uploadModal.onClose();

        } catch (error) {
            return toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Modal
            title = "Upload modal title"
            description = "Upload mp3 file"
            isOpen = {uploadModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input 
                    id="title"
                    disabled={isLoading}
                    {...register("title", {required: true})}
                    placeholder="Song title"
                />
                <Input 
                    id="author"
                    disabled={isLoading}
                    {...register("author", {required: true})}
                    placeholder="Song author"
                />
                <div>
                    <div className="pb-1">
                        Select a song file
                    </div>
                    <Input
                        id="song"
                        type="file"
                        disabled={isLoading}
                        accept=".mp3"
                        {...register("song", {required: true})}
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Select a song image
                    </div>
                    <Input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        {...register("image", {required: true})}
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                        Create 
                </Button>
            </form>
        </Modal>
    )
}


export default UploadModal

