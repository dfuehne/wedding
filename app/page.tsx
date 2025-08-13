import { Button } from "components/Button/Button"
import { Pinyon_Script } from 'next/font/google';

const fancyFont = Pinyon_Script({subsets: ['latin'], weight: '400' });

export default function Web() {

  return (
    <>
      <section>
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

            <Button href="gallery" className="mr-3">
              Gallery
            </Button>
            {/* <Button href="party" className="mr-3">
              Wedding Party
            </Button> */}
            <Button href="proposal" className="mr-3">
              Proposal
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
