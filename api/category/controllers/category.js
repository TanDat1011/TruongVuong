const { sanitizeEntity } = require("strapi-utils");
const _ = require("lodash");

module.exports = {
  async find(ctx) {
    let entities;
    const dataTemp = [];
    const data = [];

    if (ctx.query._q) {
      entities = await strapi.services.category.search(ctx.query); // mảng được xử lý khi có câu truy vấn
    } else {
      entities = await strapi.services.category.find(ctx.query); // gọi tất cả phần tử trong mảng khi không có câu truy vấn
    }

    entities.map((entity) => {
      const datacategory = sanitizeEntity(entity, {
        model: strapi.models.category,
      });

      // thêm thuộc tính Chill vào mảng
      dataTemp.push(datacategory);
      dataTemp.map((itemdata) => {
        itemdata.Child = [];
        return { ...itemdata };
      });

      // xoá các phần tử không muốn hiển thị của mảng cha
      if (datacategory.published_at) {
        delete datacategory.published_at;
        delete datacategory.created_at;
        delete datacategory.updated_at;

        // xoá các phần tử không muốn hiển thị của mảng con
        if (datacategory.Parent) {
          delete datacategory.Parent.published_at;
          delete datacategory.Parent.created_at;
          delete datacategory.Parent.updated_at;
        }
      }
    });
    const knex = strapi.connections.default;

    // console.log(JSON.stringify(result, null, 2));
    dataTemp.map((item) => {
      if (!item.Parent) {
        data.push(item);
      }
    });
    // let id = 0;
    // newData.map(async item => {
    //     id = item.id;
    //     const result = await knex('categories').where({ Parent: id });
    //     item.Child.push(result);
    //     console.log(JSON.stringify(item, null, 2));
    //     return item;
    // })
    // // XuLyData(dataTemp);
    let id = 0;
    data.map(async (item) => {
      id = item.id;
      const result = await knex("categories").where({ Parent: id });
      item.Child.push(...result);
      console.log(JSON.stringify(item));
      return item;
    });
    // console.log(JSON.stringify(data))
    return data;
  },

  async findAll(ctx) {
    let entities = [];
    const temp = [];
    if (ctx.query._q) {
      entities = await strapi.services.category.search(ctx.query); // mảng được xử lý khi có câu truy vấn
    } else {
      entities = await strapi.services.category.find(ctx.query); // gọi tất cả phần tử trong mảng khi không có câu truy vấn
    }
    entities.map((entity) => {
      const categories = sanitizeEntity(entity, {
        model: strapi.models.category,
      });

      // thêm thuộc tính Chill vào mảng
      temp.push(categories);
      temp.map((item) => {
        item.Child = [];
        return { ...item };
      });

      // xoá các phần tử không muốn hiển thị của mảng cha
      if (categories.published_at) {
        delete categories.published_at;
        delete categories.created_at;
        delete categories.updated_at;

        // xoá các phần tử không muốn hiển thị của mảng con
        if (categories.Parent) {
          delete categories.Parent.published_at;
          delete categories.Parent.created_at;
          delete categories.Parent.updated_at;
        }
      }
    });
    const knex = strapi.connections.default;
    const unflatten = function (array, parent, tree) {
      tree = typeof tree !== "undefined" ? tree : [];
      parent = typeof parent !== "undefined" ? parent : { id: 0 };

      var children = _.filter(array, function (child) {
        return child.Parent == parent.id;
      });

      if (!_.isEmpty(children)) {
        if (parent.id == 0) {
          tree = children;
        } else {
          parent["children"] = children;
        }
        _.each(children, function (child) {
          unflatten(array, child);
        });
      }

      return tree;
    };
    tree = unflatten(entities);
    console.log(tree)

  },
};
