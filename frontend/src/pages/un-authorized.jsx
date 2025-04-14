export default function  UnauthorizedPage() {

  return(

    <div className="flex flex-col items-center justify-center h-screen bg-light-gray">
      <h1 className="text-3xl font-bold text-deep-navy mb-4">Unauthorized Access</h1>
      <p className="text-lg mb-6">You don't have permission to access this page.</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="px-4 py-2 bg-mustard-yellow font-bold hover:scale-105 cursor-pointer  duration-200 text-deep-navy rounded-lg hover:bg-opacity-90 transition-all"
      >
        Back to Home
      </button>
    </div>
  )
}