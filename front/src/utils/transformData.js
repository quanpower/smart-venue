// 普通格式转树形结构数据
export default function toTreeData(sourceData) {
  const data = Object.assign([], sourceData);
  var pos = [];
  var tree = [];
  var i = 0;
  while (data.length != 0) {
    if (data[i].parent_id == 0) {
      // 根据sort_index给子节点排序
      // let count = 0;
      // for (var index in tree) {
      //   if (tree[index].sort_index < data[i].sort_index) {
      //     count ++;
      //   }
      // }
      tree.push({
        id: data[i].id,
        name: data[i].name,
        icon_name: data[i].icon_name,
        sort_index: data[i].sort_index,
        children: []
      });
      pos[data[i].id] = [tree.length - 1];
      data.splice(i, 1);
      i--;
    } else {
      var posArr = pos[data[i].parent_id];
      if (posArr != undefined) {

        var obj = tree[posArr[0]];
        for (var j = 1; j < posArr.length; j++) {
          obj = obj.children[posArr[j]];
        }

        // 根据sort_index给子节点排序
        // let count = 0;
        // for (var index in obj.children) {
        //   if (obj.children[index].sort_index < data[i].sort_index) {
        //     count ++;
        //   }
        // }
        obj.children.push({
          id: data[i].id,
          name: data[i].name,
          icon_name: data[i].icon_name,
          sort_index: data[i].sort_index,
          children: []
        });
        pos[data[i].id] = posArr.concat([obj.children.length - 1]);
        data.splice(i, 1);
        i--;
      }
    }
    i++;
    if (i > data.length - 1) {
      i = 0;
    }
  }
  return tree;
}