var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req,file,cb) {
      cb(null,'public/img/');
  },
  filename: function(req, file, cb){
      cb(null, file.fieldname + '-'+Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({storage: storage});

var pedido = upload.array('fileselect');


router.post('add', pedido, (req,res) => {
  console.log(req.files);
  console.log(req.body.name);

  if (req.fileValidationError){
    return res.send(req.fileValidationError);

  }else if (!req.files){
    return res.send("Please select an image to upload");
  }

  let result = [{name : req.body.name}];
  result.push({tlf : req.body.tlf});
  result.push({email : req.body.email});
  result.push({libro : req.body.libro});
  result.push({cantidad : req.body.cantidad});
  const files = req.files;

  let index,len;

  for (index = 0, len = files.length; index<len;++index){
    result.push({ file : req.files[index].path.replace("public","")});
  }

  res.send(result);
});



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
