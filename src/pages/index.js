import React from "react";
import Link from "next/link";
import Ticker from './components/Ticker';

const Home = () => {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-900 text-white p-8">
      <div>
        <h1 className="text-4xl font-semibold text-center mb-6">
          Do You Even Know What Your Party Stands For?
        </h1>

        <div className="flex flex-col gap-4 items-center">
          <Link href="/game">
            <button className="rounded-full bg-red-600 text-white px-8 py-5 hover:bg-red-700 transition text-3xl mb-6">
              Prove Yourself
            </button>
          </Link>

          <Link href="/about">
            <button className="rounded-full bg-gray-800 text-white px-8 py-4 hover:bg-gray-700 transition text-xl">
              Learn More
            </button>
          </Link>
        </div>

        <div className="mt-12 text-center text-xl">
          <p>
            <a>
              “It's silly that a country that prides itself on choice allows only two.” - Bill Maher <br /> <br />
            </a>
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 w-full">
        <Ticker bgColor="bg-gray-900" />
      </div>
    </div>
  );
};

export default Home;
