// pages/api/random-bills.js
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const loadCSV = (filename) => {
    const filePath = path.join(process.cwd(), 'public', filename);
    const file = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse(file, { skipEmptyLines: true }).data;
    return parsed.slice(4); // skip headers/junk
};

export default function handler(req, res) {
    const dem = loadCSV('dem_bills.csv').map(row => ({ row, party: 'Democratic' }));
    const rep = loadCSV('rep_bills.csv').map(row => ({ row, party: 'Republican' }));

    const all = [...dem, ...rep];
    const shuffled = all.sort(() => 0.5 - Math.random());
    const sample = shuffled.slice(0, 5).map(({ row, party }) => ({
        title: row[3],
        legislationNumber: row[0],
        url: row[1],
        cosponsors: row[2],
        summary: row.at(-1)?.replace(/<[^>]+>/g, "").trim() || "Sorry, no summary provided",
        party
    }));

    res.status(200).json(sample);
}
