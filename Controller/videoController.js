const errorHandler = require("./errors");
const dirTree = require("directory-tree");
const path = require("path");

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