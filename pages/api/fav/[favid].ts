
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

type Data = {
    name: string
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>) {

    const { proid } = req.query;

    if (req.method === "POST") {
        try {
            const product = req.body;
            let { db } = await connectToDatabase();
            await db.collection("db").insertOne({ "user": "merry", "favorite": ["a 1 ea", "b 2 ea"] });
            return res.status(200).json({ status: { code: 200, message: 'OK' }, data: "" });
        } catch (error) {
            return res.json({ message: error, success: false })
        }
    }

}