const shortid = require("shortid");
const validUrl = require("valid-url");
const Url = require("../Models/urlModel");
const url=require('url')

const UrlController = {
    handlers: {
        shortenURL: async (req, res) => {
            try {
                const { longUrl } = req.body
           
                const baseUrl =req.protocol+'://'+req.get('host')+'/api/url'
              

                const urlCode = shortid.generate();
                if (validUrl.isUri(longUrl)) {
                    let currDate = new Date().toString().slice(4, 15);

                    let url = await Url.findOne({ longUrl });
                    if (url) {
                        return res.status(200).json({status:false,message:"Already URl is registered"});
                    } else {

                        shortUrl = `${baseUrl}/${urlCode}`;
                        url = new Url({
                            urlCode,
                            longUrl,
                            shortUrl,
                            date: currDate,
                            count: 0
                        });
                        url.created_by=req.user.email
                        
                        await url.save();
                        return res.json({status:true,message:"Url created succesfully",data:url});
                    }
                }
                else {
                    return res.json({ error: "Invalid long URL" })
                }
            }
            catch (ex) {
                console.log(ex);
                return res.json({ "message": "Something went wrong" });
            }
        },
        listURL: async (req, res) => {
            try {
                const urls = await Url.find({created_by:req.user.email}).sort({created_date: -1});
                if (urls) {
                    res.json({ status: true, data: urls });
                } else {
                    res.json({ status: false, message: "No URL found" });
                }
            }
            catch (ex) {
                console.log(ex)
                res.json({ status: false, message: "No URL found" });
            }
        },
        getURLCount: async (req, res) => {
            try {
                let todaysCount = 0;
                let monthsCount = 0;
                let currDate = new Date();
                let tDate = currDate.toString().slice(4, 15);
                currDate.setMonth(currDate.getMonth() - 1);
                let oDate = currDate.toString().slice(4, 15);
                const urls = await Url.find({created_by:req.user.email});
                const totalClicks=await Url.aggregate([
                    { $match : { created_by : req.user.email} },
                    {
                        $project: {
                          totalClicks: { $sum: "$clicks"},
                        }
                    }
                  
                ])
             

                 const lastday=await Url.aggregate( [
                    { $match : { created_by : req.user.email} },
                    {
                      $group:
                        {
                          _id: "$date",
                          count: { $sum: "$clicks" }
                        }
                    },
                   
                  ])

                  const shortURL=await Url.aggregate( [
                    { $match : { created_by : req.user.email} },
                    {
                      $group:
                        {
                          _id: "$shortUrl",
                          count: { $sum: "$clicks" }
                        }
                    }
                  ])
                
                    
                if (urls) {
                    urls.map((url) => {
                        if (Date.parse(url.date) === Date.parse(tDate)) {
                            todaysCount++;
                            monthsCount++;
                        } else if (Date.parse(url.date) >= Date.parse(oDate)) {
                            monthsCount++;
                        }
                    });
                    console.log(todaysCount,monthsCount)
                    let totalCount=0
                    if(totalClicks.length!=0)
                    {    
                        
                        totalClicks.map((x)=>{
                            console.log(x)
                            totalCount+=x.totalClicks

                        })
                    }

                    let resultObj={
                         totalcount:urls.length,
                         totalClicks:totalCount,
                         todaysCount:todaysCount,
                         monthsCount:monthsCount,
                         dateWiseCount:lastday,
                         shortURLCount:shortURL                          
                    }
                    res.json({status:true,resultObj});
                } else {
                    res.json({ status:false,message: "Server Error" });
                }
            }
            catch (ex) {
                console.log(ex)
            }

        },
        redirectURL: async (req, res) => {
            const shortUrlCode = req.params.shortUrl;
            const url = await Url.findOne({ urlCode: shortUrlCode });
            let currDate = new Date().toString().slice(4, 15);
            try {
                if (url) {
                    url.clicks++;
                    url.date=currDate
                    
                    await url.save();
                    return res.redirect(url.longUrl);
                } else {
                    res.json({ error: "No URL found." });
                }
            } catch (err) {
                console.log(err);
                res.json({ error: "Server error" });
            }
        },
        updateURL: async (req, res) => {
            try {
                
                let data = req.body.id
            
                const url = await Url.findOne({ _id: data });
                url.longUrl=req.body.longUrl
                url.created_date=new Date().getTime()
                url.save()
                res.json({status:true,message:"Url has been updated Successfully"})
  
            } catch (ex) {
                res.json({ status: false, message: "Something went wrong" })
            }
        },
        deleteURL: async (req, res) => {
            try {
                let data = req.body.id
                console.log(data)
                const url = await Url.deleteOne({ _id: data });
                res.json({status:true,message:"Url has been deleted Successfully"})
            } catch (ex) {
                res.json({ status: false, message: "Something went wrong" })
            }
        },
    }
}

module.exports = UrlController