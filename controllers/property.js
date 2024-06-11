import propertyModel from '../models/property.js'

async function getData(req, res) {
    await propertyModel.find().
    then(result => {
        res.status(200).json({data : result});
    }).
    catch(err => {
        console.error(err);
    })
}

async function addProperty (req, res) {
   
}

async function searchProperties (req, res) {
    const {state, city, size, type} = req.query;
    
    if(req.size === 'more')
        req.size = '5BHK';
    await propertyModel.find({state : state, city : city, size : size, type : type}).
    then(result => {
        if(result.length != 0)
            res.status(200).json({data : result});
        else
            res.json({});
    }).
    catch(err => {
        console.error(err);        
    })
}

export {getData, addProperty, searchProperties}