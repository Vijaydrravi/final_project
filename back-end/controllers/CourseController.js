const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()
const dataService = require('../services/dataService')

const getAllCourses = async (req,res) =>
{
    const courses = await dataService.getData('course',prisma)

    res.json(courses)
    console.log('hello world')

}


const getCourse = async (req,res) =>
{
    const {course} = req.params;
    const targetCourse = await prisma.course.findMany(
        {
            where: {
                title :{
                  contains : course
            }}
        }
    );
    res.json(targetCourse);
}


const createCourse = async(req,res) =>
{
    const {title,duration,difficulty_level,learning_Path} = req.body;
    try{
    const find_learning_path = await prisma.learningPath.findFirst({
        where:{title:learning_Path}
    })
    if(!find_learning_path) 
    {
        return res.status(404).json({message:"learning path not found"})
    }
    const newCourse = await prisma.course.create(
        {
            data:{
                title,
                duration,
                difficulty_level
            }
        }
    )

    return res.json("success")
}
catch(err)
{
    console.log(err)
    return res.json({"message":"error in creating course"})
}
}


module.exports ={
    getAllCourses,
    getCourse,
    createCourse
}