const {PrismaClient} = require('@prisma/client');

const prisma = new PrismaClient();


const getUsers = async(req,res) =>
{
    const users = await prisma.user.findMany();
    res.json(users)
}


const getUser = async(req,res) =>
{
    const {user} = req.params;
    const targetUser = await prisma.user.findMany({
        where:{
            name: {
                contains: user
            }
        }
    })
}


module.exports ={
    getUsers,
    getUser
}