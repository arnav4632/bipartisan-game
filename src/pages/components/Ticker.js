import React from "react";

const Ticker = ({ bgColor }) => {
    return (
        <div className={`w-full ${bgColor} text-white py-2 overflow-hidden  text-lg`}>
            <div className="animate-scroll flex">
                {/* first copy */}
                <div className="inner-copy whitespace-nowrap">
                    {facts.map((fact, i) => (
                        <a
                            key={`fact-${i}`}
                            href={fact.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 hover:underline text-blue-400"
                        >
                            {fact.text}
                        </a>
                    ))}
                </div>
                {/* second copy */}
                <div className="inner-copy whitespace-nowrap">
                    {facts.map((fact, i) => (
                        <a
                            key={`fact-dup-${i}`}
                            href={fact.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 hover:underline text-blue-400"
                        >
                            {fact.text}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const facts = [
    {
        text: "Over 70% of voters choose candidates based solely on party affiliation, even when they disagree with key issues.",
        link: "https://www.pewresearch.org/politics/2016/06/22/5-views-of-parties-positions-on-issues-ideologies/",
    },
    {
        text: "Political polarization in the U.S. has reached unprecedented levels, with most voters unwilling to consider candidates from the opposite party.",
        link: "https://www.npr.org",
    },
    {
        text: "Nearly half of voters don't know the basic positions of their party’s candidates.",
        link: "https://www.pewresearch.org/short-reads/2016/09/23/ahead-of-debates-many-voters-dont-know-much-about-where-trump-clinton-stand-on-major-issues",
    },
    {
        text: "Nearly half of younger adults say they wish there were more parties to choose from.",
        link: "https://www.pewresearch.org/politics/2022/08/09/as-partisan-hostility-grows-signs-of-frustration-with-the-two-party-system/",
    },
    {
        text: "“It’s silly that a country that prides itself on choice allows only two.” - Bill Maher",
        link: "https://www.pbs.org/newshour/politics/politics-july-dec04-third_parties",
    },
];

export default Ticker;
