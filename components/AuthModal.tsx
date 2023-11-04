"use client"

import { use, useEffect } from "react"
import Modal from "./Modal"
import { 
    useSupabaseClient,
    useSessionContext,
} from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import useAuthModal from "@/hooks/useAuthModal"





const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const {} = useAuthModal();
    const { onClose, isOpen } = useAuthModal();
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
    },[session, router, onClose]);


    return (
        <Modal
            title="Welcome back"
            description="Sign in to your account to continue"
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth
                theme = "dark"
                // co thể add thêm các cách đăng nhập khác 
                // như google, facebook, twitter, ...
                magicLink
                providers={['github']} 
                supabaseClient={supabaseClient}
                appearance={
                    {
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#404040',
                                    brandAccent: '#22c55e'
                                }
                            }
                        }
                    }
                }
            />
        </Modal>
    )
}


export default AuthModal;
