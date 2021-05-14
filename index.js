var express=require('express');
var app=express();
var port=process.env.PORT || 3000;
var multer = require('multer');
var fs=require("fs");
var path = require("path");

app.use(express.static('upload'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

var storage = multer.diskStorage({
    destination:  './upload',
    filename: (req, file, callback) => {
        
        var new_file_name=file.originalname;
        var file_type=new_file_name.split(".")[new_file_name.split(".").length-1];
        var temp_file_name=new_file_name;
        var count=1;
        while(fs.existsSync('./upload/'+new_file_name))
        {
            count++;
            new_file_name=temp_file_name.substr(0,temp_file_name.length-file_type.length-1)+"_"+count+"."+file_type;
        }

        callback(null, new_file_name);//numm คือ error
    }
});
var upload=multer({"storage": storage });

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.post("/upload",upload.array("my_upload_file",10),(req,res)=>{

    //console.log(req.body.picture_description);
    if(req.files==null)
    {
        res.send([]);
    }
    else
    {
        console.log(req.files);
        res.send(req.files);

        //console.log(req.file.filename);
    }
    

});

//กรณีไม่พบหน้า
app.get('*', (req, res)=>{
    res.status(404).send('Page Not Found');
});

app.listen(port);
console.log("Server Start");
