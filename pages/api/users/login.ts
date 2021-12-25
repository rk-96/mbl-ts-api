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

    user.hash = bcrypt.hashSync;

    var token = jwt.sign({ password: password }, KEY);

    var decoded = jwt.verify(token, KEY);

    var isSamePassword = "";

    if (password == decoded.password) {
        isSamePassword = "complete";
    }

    if (req.method === "POST") {
        try {
            const query = { "user": req.body.username };
            let { db } = await connectToDatabase();
            const result = await db.collection("user").findOne(query);

            if (result == null) {
                return res.status(404).json({ message: "No item found" })
            }

            return res.status(200).send(result);

        } catch (error) {
            return res.json({ message: error, success: false })
        }
    }

}