const clientModel = require("../models/Client.models");

async function registerClient(req, res) {
    try {
        const {
            clientKey,
            clientName,
            capacity,
            refillRate,
            algorithm
        } = req.body;

        const existingClient = await clientModel.findOne({ clientKey });

        if (existingClient) {
            return res.status(409).json({
                message: "Client already exists"
            });
        }

        const client = await clientModel.create({
            clientKey,
            clientName,
            capacity,
            refillRate,
            algorithm,
            remainingTokens:capacity,
            lastRefillTime:Date.now()
        });

        res.status(201).json({
            message: "Client created successfully",
            client
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function getallclients(req,res){
    try{
        const client=await clientModel.find({});
        
        res.status(201).json({
        message:"clients are successfully fetched",
        client:client
    })
        
        
    }
    catch(error){
       console.log("There is an error of fetching the clients");
       res.status(500).json({ message: "Internal Server Error" });
    }
    
    
}

async function checkRateLimit(req, res) {
    const { clientKey } = req.body;
    let retries = 3;

    while (retries > 0) {
        try {
            const client = await clientModel.findOne({ clientKey });
            if (!client) {
                return res.status(404).json({ message: "Unauthorized user" });
            }

            const now = Date.now();

            if (client.algorithm === "token_bucket") {
                const timeElapsedInSeconds = (now - client.lastRefillTime.getTime()) / 1000;
                const tokensToAdd = timeElapsedInSeconds * client.refillRate;
                const newTotalTokens = Math.min(client.remainingTokens + tokensToAdd, client.capacity);

                if (newTotalTokens >= 1) {
                    client.remainingTokens = newTotalTokens - 1;
                    client.lastRefillTime = now;
                    await client.save();

                    res.setHeader('X-RateLimit-Limit', client.capacity);
                    res.setHeader('X-RateLimit-Remaining', Math.floor(client.remainingTokens));
                    return res.status(200).json({ message: "ALLOW" });
                } else {
                    client.remainingTokens = newTotalTokens;
                    client.lastRefillTime = now;
                    await client.save();

                    res.setHeader('X-RateLimit-Limit', client.capacity);
                    res.setHeader('X-RateLimit-Remaining', Math.floor(client.remainingTokens));
                    return res.status(429).json({ message: "DENY - Too Many Requests" });
                }

            } else if (client.algorithm === "sliding_window") {
                const windowStart = now - 60000; 

                client.windowLog = client.windowLog.filter(timestamp => timestamp.getTime() > windowStart);

                if (client.windowLog.length < client.capacity) {
                    client.windowLog.push(now);
                    await client.save();

                    res.setHeader('X-RateLimit-Limit', client.capacity);
                    res.setHeader('X-RateLimit-Remaining', client.capacity - client.windowLog.length);
                    return res.status(200).json({ message: "ALLOW" });
                } else {
                    await client.save(); 
                    
                    res.setHeader('X-RateLimit-Limit', client.capacity);
                    res.setHeader('X-RateLimit-Remaining', 0);
                    return res.status(429).json({ message: "DENY - Too Many Requests" });
                }
            }

        } catch (error) {
            if (error.name === 'VersionError') {
                retries--;
                console.log(`Race condition caught! Retrying... (${retries} retries left)`);
                continue; 
            }
            
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            });
        }
    }

    return res.status(503).json({ message: "Service Unavailable - High Traffic Contention" });
}
        

    

module.exports = {
    registerClient,getallclients,checkRateLimit
};