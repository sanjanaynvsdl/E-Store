import SignIn  from "../components/SignIn"

export default function LandingPage() {
    return(
        <div>
            <div className="bg-white w-full min-h-screen flex justify-center items-center flex-col gap-2">
                <SignIn />
            </div>
        </div>
    )
}