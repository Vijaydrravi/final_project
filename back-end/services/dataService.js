

const getData = async(model,prisma) =>
{
    try{
        const result = await prisma[model].findMany();
        return result;
    }
    catch(err)
    {
        return `error fetching data from ${model}`;
    }
}

module.exports = {
    getData
}