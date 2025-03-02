import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"

const AuthComponent = () => {
  const supabase = useSupabaseClient()

  return (
    <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} theme="dark" providers={["google", "github"]} />
  )
}

export default AuthComponent

