import { verify } from 'crypto';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb';
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const KEY = 'shhhhh';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { password, ...user } = req.body;
    let isPassVerifyPassword = false;

    if (req.method === "POST") {

        try {
            let { db } = await connectToDatabase();
            let result = await db.collection("user").findOne({ username: req.body.username });
            //check password compare
            let decodedFromCollection = jwt.verify(result.password, KEY);
            if (decodedFromCollection.password == password) {
                console.log("COMPARE PASS")
                isPassVerifyPassword = true;
            }

        } catch (error) {
            return res.json({ message: error, success: false });
        }


        // after login complete find and return list of fav 
        if (isPassVerifyPassword) {
            console.log("condition true");
            try {
                const query = { "user": req.body.username };
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

}