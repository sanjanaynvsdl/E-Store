import SignIn from "./components/SignIn";

export default function App(){
  return(
    <div className="bg-[#A3C4EB] w-full h-screen flex justify-center items-center flex-col gap-2">
      <p className="">Hello, welcome to smart store!</p>
      <SignIn/>
    </div>
  )
}