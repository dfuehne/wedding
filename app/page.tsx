import { Metadata } from "next"
import { Button } from "components/Button/Button"


export const metadata: Metadata = {
  title: "Zoe Baker and Duncan Fuehne Wedding Website!",
}

export default function Web() {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-(--breakpoint-xl) px-4 py-8 text-center lg:py-16">
          <div className="mx-auto place-self-center">
            <h1 className="mb-4 max-w-2xl text-4xl leading-none font-extrabold tracking-tight md:text-5xl xl:text-6xl dark:text-white">
              Zoe Baker and Duncan Fuehne Wedding!
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
