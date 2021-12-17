
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

type Data = {
    name: string
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>) {

    const { favid } = req.query;


    // create or update list fav by favid
    if (req.method === "POST") {
        try {
            const favItems = req.body;
            const userid = { "user": favid };
            const upsert = { upsert: true };
            const update = { $set: { "favorite": favItems } };
            let { db } = await connectToDatabase();
            let result = await db.collection("db").updateOne(userid, update, upsert);
            return res.status(200).json({ status: { code: 200, message: 'OK' }, data: result });
        } catch (error) {
            return res.json({ message: error, success: false })
        }
    }


    // get After login and create fav list or what ever 
    if (req.method === "GET") {
        try {
            const query = { "user": favid };
            let { db } = await connectToDatabase();
            const result = await db.collection("db").findOne(query);

            if (result == null) {
                return res.status(404).json({ message: "No item found" })
            }

            return res.status(200).send(result);

        } catch (error) {
            return res.json({ message: error, success: false })
        }
    }

}