const pool  = require("../database/database");

const addUser = async (req, res) => {
    const { name, age, email } = req.body;
    try {
        if(!name || !age || !email){
            return res.status(404).json({message :"some value missing"})
        }
        const existingUser = pool.query("SELECT email FROM users WHERE email=?" ,[email])
        if (existingUser) {
            return res.status(400).json({message :"this mail already exist in database use another mail"})
        }
        const [newUser] = pool.query("INSERT INTO users(name, age, email) VALUES (?, ?, ?)" ,[name, age, email])
        
    } catch (error) {
        console.log("ERROR IN CREATE", error);
        return res.status(500).json({message :"server error"})
        

    }
}

module.exports ={
    addUser
}