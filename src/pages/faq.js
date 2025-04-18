import React from "react";
import Ticker from './components/Ticker';

const Home = () => {
    return (
        <div className="flex flex-col justify-between min-h-screen bg-gray-100 text-white p-8">
            <div>
                <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">
                    FAq
                </h1>

                <div className="mt-12 text-black w-full">
                    <p className="text-xl font-semibold mb-2">
                        Q: Where’d you get the legislative data from?
                    </p>
                    <p className="text-lg leading-relaxed">
                        A: all bills were pulled straight from{" "}
                        <a
                            href="https://www.congress.gov/search?q=%7B%22congress%22%3A%5B%22119%22%2C%22118%22%2C%22117%22%2C%22116%22%2C%22115%22%2C%22114%22%2C%22113%22%2C%22112%22%2C%22111%22%5D%2C%22source%22%3A%22legislation%22%2C%22party%22%3A%22Democratic%22%2C%22type%22%3A%5B%22bills%22%2C%22resolutions%22%5D%2C%22bill-status%22%3A%5B%22committee%22%2C%22floor%22%2C%22failed-one%22%2C%22passed-one%22%2C%22passed-both%22%2C%22resolving%22%2C%22president%22%2C%22veto%22%2C%22law%22%5D%7D&id=115403&pageSort=billCosponsorCount%3Adesc"
                            className="text-blue-600 underline hover:text-blue-800"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            congress.gov
                        </a>
                        . we ran two searches: one filtered for republican sponsors, one for democrats.
                        grabbed the top 2,500 bills (sorted by cosponsors).
                        <br />
                        <span className="text-sm text-gray-600">
                            (data last downloaded: 4/5/2025)
                        </span>
                    </p>
                </div>
            </div>

            <div className="absolute bottom-10 w-full">
                <Ticker bgColor="" />
            </div>
        </div>
    );
};

export default Home;
