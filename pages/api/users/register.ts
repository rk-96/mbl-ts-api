import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../../lib/mongodb';
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const KEY = 'shhhhh';

// res: NextApiResponse<Data>
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { password, ...user } = req.body;

    user.hash = bcrypt.hashSync;

    // TODO encrypt password and store to database
    var token = jwt.sign({ password: password }, KEY);

    console.log(token);
    var decoded = jwt.verify(token, KEY);
    console.log(decoded);


    var isSamePassword = "pass";

    if (password == decoded.password) {
        isSamePassword = "complete";
    }

    if (req.method === "POST") {
        try {
            let dataItems = token;
            // const body = { "username": req.body.username, "password": token };
            const body = { "username": req.body.username };
            const upsert = { upsert: true };
            const update = { $set: { "password": dataItems } };
            let { db } = await connectToDatabase();
            let result = await db.collection("user").updateOne(body, update, upsert);


            const userid = { "user": req.body.username };
            const upsert1 = { upsert: true };
            const update1 = { $set: { "favorite": [] } };
            // TODO UPDATE ONE TO db
            await db.collection("db").updateOne(userid, update1, upsert1);
            return res.status(200).json({ status: { code: 200, message: 'OK' }, data: result });
        } catch (error) {
            return res.json({ message: error, success: false })
        }
    }
}