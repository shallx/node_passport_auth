const errorHandler = require("./errors");
const dirTree = require("directory-tree");
const path = require("path");
const Chat = require('../Model/Chat');
const {initials, firstName} = require('../libs/string');
const io = require('../socket');
const fs = require("fs");

const commonPath = 'E:\\Development\\Workgroup\\Node JS\\node_passport_auth\\';

exports.test = (req, res, next) => {
  res.render('ftp',{extractStyles: true});
};

exports.getCategories = (req, res, next) => {
  const tree = dirTree(path.resolve(__dirname , '../assets'));
  // console.log(tree.children);
  let categories = tree.children.map((cat,index) => {
    if(cat.type == 'directory'){
      return {
        path: '/categories/' + index,
        name: cat.name,
        image: '/images/folder.svg'
      }
    } else return;
  });
  res.render('ftp', {categories, extractStyles: true});
}

exports.getCategoriesChildren = (req,res,next) => {
  try {
    let fath = req.path; // /categories/2/3/
    let fath_length = fath.length-1;
    fath = fath[fath_length] == '/' ? fath.slice(0,fath_length) : fath; // /categories/2/3
    let fath_normalized = fath.replace('/categories/', ''); // 2/3
    let arr = fath_normalized.split('/'); // ['2','3']
    let arr_length = arr.length;
  
    const tree = dirTree(path.resolve(__dirname , '../assets'));
    let categories = tree;
    let navigation = []; // [{ slug: 'English Movies', path: '1' },{ slug: 'Marvel', path: '1/3' }]
    let navigation_fullpath = ''; // English Movies-Marvel-Captain America-
    for(let i=0;i<arr_length;i++){
      let str = categories.children[arr[i]].name;
      navigation_fullpath += str + '-';
      navigation.push({slug: str, path: arr.slice(0,i+1).join('/')});
      categories = categories.children[arr[i]];
    }
    categories = categories.children.map((category,index) => {
      if(category.type == 'directory'){
        return {
          path: fath + '/' + index,
          name: category.name,
          image: '/images/folder.svg'
        }
      } else {
        return {
          path: '/video/'+ navigation_fullpath + category.name,
          name: category.name,
          image: '/images/vid.svg'
        }
      }
    });
    res.render('ftp', {categories: categories, extractStyles: true, navigation: navigation})
  } catch (error) {
    console.log(error);
    res.send('<h3>Failed to parse path</h3>');
    
  }
}

exports.getWatchPage = async(req, res, next) => {
  try {
    const video_link = req.params.link;

    // Getting subtitle
    let sub_link = video_link.replace(/-/g, '/');
    sub_link ='/subtitles/' + sub_link.split('.')[0].split('/').pop() + '.vtt';
    // console.log('Subtitle_link: '+ sub_link);
    let connected_users = await Chat.find({room_id: "watchparty"});
    let users = connected_users.map(user =>initials(user.name));
    let username = firstName(req.user.name);
    if(users.findIndex(user => user == initials(req.user.name)) == -1) {
        users.push(initials(req.user.name));
    }
    res.render('video', {username, users, video_link, sub_link, extractStyles: true});

  } catch (error) {
    errorHandler.throwErrorc(error, next);
  }
}

exports.videoSource = (req, res) => {
  let params = req.params.link;
  link = params.replace(/-/g, '/');
  const path = "assets/" + link;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  const extension = link.split('.').pop();
  if (range) {
    io.getIO().emit("range", {
      action: "create",
      range: range,
    });
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res
        .status(416)
        .send("Requested range not satisfiable\n" + start + " >= " + fileSize);
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/" + extension,
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/" + extension,
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}