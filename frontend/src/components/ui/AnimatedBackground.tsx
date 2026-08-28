export function AnimatedBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#faf8f7]"
    >
      <div 
        className="animate-blob-1 absolute -top-32 -right-32 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#fde9e7] via-[#fcd4ce] to-transparent opacity-70 blur-[100px]" 
      />

      <div 
        className="animate-blob-2 absolute -bottom-32 -left-32 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-[#fae5e1] via-[#f9d7cf] to-transparent opacity-60 blur-[120px]" 
      />

      <div 
        className="animate-blob-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-[#fde9e7]/40 blur-[90px]" 
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="light-curve-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8a89f" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f5c6c1" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="light-curve-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d98277" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fde9e7" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <path
          d="M-100,100 C300,200 200,700 -50,900"
          fill="none"
          stroke="url(#light-curve-1)"
          strokeWidth="1.5"
        />

        <path
          d="M1200,-50 C900,300 1100,600 1300,900"
          fill="none"
          stroke="url(#light-curve-2)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}