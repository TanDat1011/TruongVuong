const { sanitizeEntity } = require("strapi-utils");


/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async listToTree(list) {
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentid !== null) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parentid.id]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  },

  async findAll(ctx) {
    let entities = [];
    const temp = [];
    if (ctx.query._q) {
      entities = await strapi.services.tree.search(ctx.query); // mảng được xử lý khi có câu truy vấn
    } else {
      entities = await strapi.services.tree.find(ctx.query); // gọi tất cả phần tử trong mảng khi không có câu truy vấn
    }
    entities.map((entity) => {
      const tree = sanitizeEntity(entity, {
        model: strapi.models.tree,
      });


      // thêm thuộc tính Chill vào mảng
      temp.push(tree);
      temp.map((item) => {
        item.children = [];
        return { ...item };
      });
      // xoá các phần tử không muốn hiển thị của mảng cha
      if (tree.published_at) {
        delete tree.published_at;
        delete tree.created_at;
        delete tree.updated_at;

        // xoá các phần tử không muốn hiển thị của mảng con
        if (tree.parentid) {
          delete tree.parentid.published_at;
          delete tree.parentid.created_at;
          delete tree.parentid.updated_at;
        }
      }
    });
    // console.log(temp)
    return this.listToTree(temp);
  },
};
