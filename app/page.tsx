import { Button } from "components/Button/Button"


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
            
            <h1 className="mb-4 max-w-2xl text-4xl leading-none font-extrabold tracking-tight md:text-5xl xl:text-6xl">
              Zoe and Duncan
            </h1>

            <Button href="gallery" className="mr-3">
              Gallery
            </Button>
            <Button href="party" className="mr-3">
              Wedding Party
            </Button>
            <Button href="proposal" className="mr-3">
              Proposal
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
