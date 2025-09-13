"use client";

import Navbar from "@/components/Navbar/navbar";
import Image from "next/image";
import Link from "next/link";


export default function VenuePage() {
  return (
    <div>
      <Navbar/>
      <main className="pt-14 p-6">
          <div className="mx-auto place-self-center">
            {/* Logo */}
            <img
              src="logo.png"
              alt="Wedding Logo"
              className="mx-auto mb-6 w-32 h-auto"
            />
          </div>
        <div className="flex justify-center">
                <Image
                src={"https://firebasestorage.googleapis.com/v0/b/zdwedding.firebasestorage.app/o/travel%2Fsurf-hotel-chateau-buena-vista-co-1200x600.jpg?alt=media&token=bfde38e8-da86-441c-aaf2-d6aaaac08514"}
                alt="Photo 0"
                className="rounded-xl shadow"
                width={800}
                height={800}
                />
        </div>
          <div className="flex justify-center">
            <div className="text-center mb-6 mt-6">
            <p className="mt-2 text-2xl font-extrabold"> Buena Vista </p>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <p className="mt-2 text-2xl font-extrabold"> Accomadations </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> 
                    <p className="mt-2 text-xl font-medium"> September 4 is a holiday weekend, </p>
                    <p className="mt-2 text-xl font-medium"> Book accommadations as soon as you can! </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" />
                    <Link href={"https://www.airbnb.com"}>
                        <span className="text-2xl font-extrabold cursor-pointer hover:underline transition">
                            AirBnb
                        </span>
                    </Link>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> 
                    <p className="text-xl font-medium "> Buena Vista is mainly an AirBnb town</p>
                    <p className="text-xl font-medium "> This is probably the way to go</p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" />
                    <p className="mt-2 text-2xl font-extrabold"> Hotels </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> 
                        <Link href={"https://www.bestwestern.com/en_US/book/hotel-rooms.06164.html?iata=00170260&ssob=PSBM00199G&cid=PSBM00199G:google:Conversion_National_X_US_Google_BW_BW_BR_X_Consolidated_En_District1_CO_Tertiary:best%20western%20buena%20vista%20co&gclsrc=aw.ds&gad_source=1&gad_campaignid=21226517701&gbraid=0AAAAAD-tl1gU2oeOTj5zjRfWGXOtP2odt&gclid=Cj0KCQjwrJTGBhCbARIsANFBfgtR_T95yp81zKXLCDLgKxDHB6KW_OnA8z3mz4XoSYar1t7YID4ZIDgaAvfREALw_wcB"}>
                        <p className="text-xl font-medium cursor-pointer hover:underline transition">
                            Best Western Vista Inn
                        </p>
                        </Link>
                        <Link href={"https://www.super.com/travel/hotels/elXBpNEG?utm_source=adwords_semst&utm_campaign=G%3AST%3AUS%3APPC%3ANB%3AProp%3AUS-US%3AEN%3A1_2-Star&gad_source=1&gad_campaignid=19593026602&gclid=Cj0KCQjwrJTGBhCbARIsANFBfgvKk-aR68iAeuWIj5H0YMQ73qmw5nZmrvqDPsdaKJ9r89dXhkRUzIoaAmDFEALw_wcB&redirect_auth_retry=true"}>
                        <p className="text-xl font-medium cursor-pointer hover:underline transition">
                            Super 8 By Wyndham Buena Vista
                        </p>
                        </Link>
                        <Link href={"https://surfhotel.com"}>
                        <p className="text-xl font-medium cursor-pointer hover:underline transition">
                            Surf Hotel & Chateau
                        </p>
                        </Link>
                        <Link href={"https://www.theinnbv.com"}>
                        <p className="text-xl font-medium cursor-pointer hover:underline transition">
                            The Inn
                        </p>
                        </Link>
                        <Link href={"https://www.shorehousebv.com"}>
                        <p className="text-xl font-medium cursor-pointer hover:underline transition">
                            Shorehouse Hotel
                        </p>
                        </Link>
                        <Link href={"https://mtprinceton.com"}>
                        <p className="text-xl font-medium cursor-pointer hover:underline transition">
                            Mt. Princeton Hot Springs Resort
                        </p>
                        </Link>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" />
                    <p className="mt-2 text-2xl font-extrabold"> Camping / Glamping </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> 
                        <Link href={"https://www.bvoverlook.com"}>
                            <p className="text-xl font-medium cursor-pointer hover:underline transition">
                                BV Overlook
                            </p>
                        </Link>
                        <Link href={"https://www.fs.usda.gov/r02/psicc/recreation/collegiate-peaks-campground"}>
                            <p className="text-xl font-medium cursor-pointer hover:underline transition">
                                Collegiate Peaks Campground
                            </p>
                        </Link>
                    


                </div>
                <div>
                    <p className="mt-2 text-2xl font-extrabold"> Getting Here </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" />
                    <p className="text-2xl font-extrabold">
                        Flying In?
                    </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> 
                    <p className="text-xl font-medium">
                        Fly to Denver International Airport and rent a car
                    </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" />
                    <p className="text-2xl font-extrabold">
                        From Denver
                    </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> 
                    <p className="text-xl font-medium">
                        Take US 285 South to Buena Vista
                    </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> 
                    <p className="text-2xl font-extrabold">
                        From New Mexico
                    </p>
                    <hr className="border-gray-300 w-full max-w-md mx-auto my-8" /> 
                    <p className="text-xl font-medium">
                        Take US 285 North to Buena Vista
                    </p>

                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
