import Link from "next/link";

import { Typewriter } from "../components/ui/Typewriter";
import { UploadCard } from "../home/components/UploadCard";


export function Home() {
  return (
    <section className="min-h-[calc(100vh-4rem)] w-full bg-transparent px-4 pt-6 pb-12 sm:px-6 lg:px-8 flex flex-col justify-start">
      <div className="mx-auto w-full max-w-6xl grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">
        
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left justify-start space-y-4 pt-6 sm:pt-16 lg:pt-24">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#752b26] sm:text-5xl lg:text-6xl leading-[1.15]">
            Your perfect <br />
            learning with AI
          </h1>
          
          <p className="max-w-md text-base font-medium text-[#752b26]/75 sm:text-lg min-h-[3rem]">
            <Typewriter 
              text="Lorem ipsum dolor sit amet, consectetur adipiscing elit" 
              speed={40} 
              delay={400} 
            />
          </p>
        </div>
        
        <div className="flex justify-center lg:justify-end pt-0 md:pt-0 lg:pt-30">
          <UploadCard />
        </div>

      </div>
    </section>
  );
}