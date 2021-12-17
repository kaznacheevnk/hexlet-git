//1///Реализуйте и экспортируйте по умолчанию функцию, которая принимает на вход дерево, и возвращает новое, элементами которого являются дети вложенных узлов.
const isFile = (node) => node.type === 'file';
const isDirectory = (node) => node.type === 'directory';
const getMeta = (node) => node.meta;
const getName = (node) => node.name;
const getChildren = (directory) => directory.children;


 

const mkfile = (name, meta = {}) => ({
  name,
  meta,
  type: 'file',
});
const mkdir = (name, children = [], meta = {}) => ({
  name,
  children,
  meta,
  type: 'directory',
});


const map = (callbackFn, tree) => {
const updatedNode = callbackFn(tree);

return isDirectory(tree)
  ? { ...updatedNode, children: tree.children.map((n) => map(callbackFn, n)) }
  : updatedNode;
};

const reduce = (callbackFn, tree, acc) => {
const newAcc = callbackFn(acc, tree);

if (isFile(tree)) {
  return newAcc;
}
return tree.children.reduce((iAcc, n) => reduce(callbackFn, n, iAcc), newAcc);
};

const filter = (callbackFn, tree) => {
if (!callbackFn(tree)) {
  return null;
} 

return isDirectory(tree)
  ? { ...tree, children: tree.children.map((n) => filter(callbackFn, n)).filter((v) => v) }
  : tree;
};





//2/////////////////////////////////////////////////////////////////////////////////////
const fileS=()=>
    mkdir('nodejs-package', [
        mkfile('Makefile'), mkfile('README.md'),mkdir('dist'),mkdir(
            '__tests__',[mkfile('half.test.js',{ type: 'text/javascript'})]
        ),mkfile('babel.config.js',{ type: 'text/javascript' }),
        mkdir('node_modules',[mkdir('@babel',[mkdir(
            'cli',[mkfile('LICENSE')]
        )])], { owner: 'root', hidden: false })],{hidden: true});
console.log(fileS());

export default () => {
    const tree = mkdir('nodejs-package', [
      mkfile('Makefile'),
      mkfile('README.md'),
      mkdir('dist'),
      mkdir('__tests__', [
        mkfile('half.test.js', { type: 'text/javascript' }),
      ]),
      mkfile('babel.config.js', { type: 'text/javascript' }),
      mkdir('node_modules', [
        mkdir('@babel', [
          mkdir('cli', [
            mkfile('LICENSE'),
          ]),
        ]),
      ], { owner: 'root', hidden: false }),
    ], { hidden: true });
    return tree;
};

//3Реализуйте и экспортируйте функцию compressImages(), которая принимает на вход директорию, находит внутри нее картинки и "сжимает" их. Под сжиманием понимается уменьшение свойства size в метаданных в два раза. Функция должна вернуть новую директорию со сжатыми картинками и всеми остальными данными, которые были внутри этой директории.

const tree = mkdir('my documents', [
  mkfile('avatar.jpg', { size: 100 }),
  mkfile('passport.jpg', { size: 200 }),
  mkfile('family.jpg', { size: 150 }),
  mkfile('addresses', { size: 125 }),
  mkdir('presentations')
]); 
//console.log(tree) 
function compressImages(tree){
  const mainMeta = _.cloneDeep(getMeta(tree)); 
  const children = _.cloneDeep(getChildren(tree));
  
  const nameTree=getName(tree);
   
  const newchildren = children.map(item=>{
      const meta = _.cloneDeep(getMeta(item));
      function meta2(m,s){
        if(_.has(m,s)){
         m[s]=m[s]/2;}return m;
      }
      const children2=_.cloneDeep(getChildren(item));
      const newName=_.cloneDeep(getName(item));
      const checkName=()=>newName.slice(-3); 
      
      if(isFile(item)){
          if(checkName(item.name)=='jpg'){
              return mkfile(newName,meta2(meta,'size') );
          }
          else{return mkfile(newName,meta);}
      }
      return mkdir(newName,children2,meta);
  });
  const tree2=mkdir(nameTree,newchildren,mainMeta);
  return tree2;
}console.log(compressImages(tree));    
 
export const compressImages = (node) => {
  const children = getChildren(node);
  const newChildren = children.map((child) => {
    const name = getName(child);
    if (!isFile(child) || !name.endsWith('.jpg')) {
      return child;
    }
    const meta = getMeta(child);
    const newMeta = _.cloneDeep(meta);
    newMeta.size /= 2;
    return mkfile(name, newMeta);
  });
  const newMeta = _.cloneDeep(getMeta(node));
  return mkdir(getName(node), newChildren, newMeta);
};

/////4/////////////////////////////////////////////

const tree = mkdir('/', [
  mkdir('etc', [
    mkfile('bashrc'),
    mkfile('consul.cfg'),
  ]),
  mkfile('hexletrc'),
  mkdir('bin', [
    mkfile('ls'),
    mkfile('cat'),
  ]),
]);

function piroga(tree,owner){
const name = getName(tree);
const meta2=_.cloneDeep(getMeta(tree));
meta2.owner=owner;

if(isFile(tree)){return mkfile(name,meta2);}
const children=_.cloneDeep(getChildren(tree));

const children2=children.map(item=>piroga(item,owner));
const tree2=mkdir(name,children2, meta2);
return tree2;

} 
console.log(piroga(tree,'spirtRoyal'));

//5/////////////////////Реализуйте и экспортируйте по умолчанию функцию, которая принимает на вход директорию (объект-дерево), приводит имена всех файлов в этой и во всех вложенных директориях к нижнему регистру. Результат в виде обработанной директории возвращается наружу.

const tree = mkdir('/', [
  mkdir('eTc', [
    mkdir('NgiNx'),
    mkdir('CONSUL', [
      mkfile('config.json'),
    ]),
  ]),
  mkfile('hOsts'),
]);

function check(tree){
  const name =_.cloneDeep(getName(tree));
  const meta = getMeta(tree);  

  if(isFile(tree)){return mkfile(name.toLowerCase(),meta);}
  const children= _.cloneDeep(getChildren(tree));

  const children2=children.map(item=>check(item));
  const tree2=mkdir(name,children2,meta);
  return tree2;
}
console.log(check(tree));

const downcaseFileNames = (node) => {
  const newMeta = _.cloneDeep(getMeta(node));
  const name = getName(node);
  if (isFile(node)) {
    return mkfile(name.toLowerCase(), newMeta);
  }
  const children = getChildren(node);
  const newChildren = children.map(downcaseFileNames);
  return mkdir(name, newChildren, newMeta);
};

export default downcaseFileNames;


//6/////////////////////////////////////////////////////Реализуйте и экспортируйте по умолчанию функцию, которая считает количество скрытых файлов в директории и всех поддиректориях. Скрытым файлом в Linux системах считается файл, название которого начинается с точки.
const tree = mkdir('/', [
  mkdir('etc', [
    mkdir('apache'),
    mkdir('nginx', [
      mkfile('.nginx.conf', { size: 800 }),
    ]),
    mkdir('.consul', [
      mkfile('.config.json', { size: 1200 }),
      mkfile('data', { size: 8200 }),
      mkfile('raft', { size: 80 }),
    ]),
  ]),
  mkfile('.hosts', { size: 3500 }),
  mkfile('resolve', { size: 1000 }),
]);
function counter(tree){
  const name=getName(tree);
  function check(i){ return i.slice(0,1);} 
  if( isFile(tree) ) {
    if(check(name)=='.'){ return 1;} else{return;}
  } 
  const children =getChildren(tree);
  const res=children.map(counter);
  return _.sum(res);
} console.log(counter(tree));

const getHiddenFilesCount = (node) => {
  const name = getName(node);
  if (isFile(node)) {
    return name.startsWith('.') ? 1 : 0;
  }
  const children = getChildren(node);
  const hiddenFilesCounts = children.map(getHiddenFilesCount);
  return _.sum(hiddenFilesCounts);
};export default getHiddenFilesCount;


//7//////////7///////////////////////////

 

const tree = mkdir('/', [
  mkdir('etc', [
    mkdir('apache'),
    mkdir('nginx', [
      mkfile('nginx.conf', { size: 800 }),
    ]),
    mkdir('consul', [
      mkfile('config.json', { size: 1200 }),
      mkfile('data', { size: 8200 }),
      mkfile('raft', { size: 80 }),
    ]),
  ]),
  mkfile('hosts', { size: 3500 }),
  mkfile('resolve', { size: 1000 }),
]);                 

function xxx (tree){
  if(isFile(tree)){const meta= getMeta(tree); return meta.size;}
  const children = getChildren(tree);
  const end = children.map(xxx);
  return _.sum(end);   
}

function x(tree){
  const children=getChildren(tree);
  const res=children.map(item=>[getName(item),xxx(item)])
  return res.sort(([, a],[, b])=>b-a);
}

console.log(x(tree));


function qwe(tree){
  const name=getName(tree);
  const children=getChildren(tree);
  if(children.length==0){return name;}
  return children.filter(item=>isDirectory(item)).flatMap(qwe);
}
console.log(qwe(tree))

//8///////////////////////////////////

const tree = mkdir('/', [
  mkdir('etc', [
    mkdir('apache'),
    mkdir('nginx', [
      mkfile('nginx.conf', { size: 800 }),
    ]),
    mkdir('consul', [
      mkfile('config.json', { size: 1200 }),
      mkfile('data', { size: 8200 }),
      mkfile('raft', { size: 80 }),
    ]),
  ]),
  mkfile('hosts', { size: 3500 }),
  mkfile('resolve', { size: 1000 }),
]);

const findFilesByName = (tree, substr) => {
  const iter = (node, ancestry) => {
    const name = getName(node);
    const newAncestry = path.join(ancestry, name);
    if (isFile(node)) {
      return name.includes(substr) ? newAncestry : [];
    }
    const children = getChildren(node);
    return children.flatMap((child) => iter(child, newAncestry));
  };

  return iter(tree, '');
};
console.log(findFilesByName(tree,'co'));  