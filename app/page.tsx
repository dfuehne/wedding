import Link from "next/link";
import Image from "next/image";
import { Pinyon_Script } from 'next/font/google';
import Navbar from "@/components/Navbar/navbar";


const fancyFont = Pinyon_Script({subsets: ['latin'], weight: '400' });

const sections = [
  { name: "Gallery", href: "/gallery" },
  { name: "Proposal", href: "/proposal" },
  { name: "Wedding Party", href: "/party" },
];

export default function Web() {

  return (
    <>
        <Navbar/>
        <main className="pt-14 p-6">
        <div className="mx-auto grid max-w-[--breakpoint-xl] px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            {/* Logo */}
            <img
              src="logo.png"
              alt="Wedding Logo"
              className="mx-auto mb-6 w-32 h-auto"
            />
            
            <h1 className={`mb-4 max-w-2xl text-4xl leading-none font-extrabold tracking-tight md:text-5xl xl:text-6xl ${fancyFont.className}`}>
              Zoe + Duncan
            </h1>
            <h1 className="mb-6 text-2xl font-medium">
                    4 Septmeber, 2026
            </h1>
            <h1 className="mb-6 text-2xl font-medium">
                    Buena Vista, Colorado
            </h1>

                 {/* Firebase image */}
            <div className="mb-8 mt-8">
              <Image
                src={"https://firebasestorage.googleapis.com/v0/b/zdwedding.firebasestorage.app/o/engagement-photos%2FIMG_1563.jpg?alt=media&token=4bb9160f-41a9-4464-aee0-ed7d0d5537a2"}
                alt="Home Image"
                width={600} // set desired width
                height={400} // set desired height
                className="rounded-lg shadow-md"
              />
            </div>

            <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> {/* top line */}

            {sections.map((section, idx) => (
              <div key={section.name} className="w-full text-center my-8">
                {idx !== 0 && (
                  <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> // line between sections
                )}
                <Link href={section.href}>
                  <span className="text-2xl font-medium cursor-pointer hover:underline transition">
                    {section.name}
                  </span>
                </Link>
              </div>
            ))}

            <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> {/* bottom line */}

          </div>
        </div>
        </main>
    </>
  )
}
