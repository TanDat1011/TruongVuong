const { sanitizeEntity } = require('strapi-utils');

let dataTemp = [];
let newData = [];

module.exports = {
  async find(ctx) {
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services.category.search(ctx.query); // mảng được xử lý khi có câu truy vấn
    } else {
      entities = await strapi.services.category.find(ctx.query); // gọi tất cả phần tử trong mảng khi không có câu truy vấn
    }

    entities.map(entity => {
      const datacategory = sanitizeEntity(entity, {
        model: strapi.models.category,
      });

      // thêm thuộc tính Chill vào mảng
      dataTemp.push(datacategory);
      dataTemp.map(itemdata => {
          itemdata.Child = [];
          return { ...itemdata };
      });

      // xoá các phần tử không muốn hiển thị của mảng cha
      if (datacategory.published_at) {
        delete datacategory.published_at; 
        delete datacategory.created_at;
        delete datacategory.updated_at;

        // xoá các phần tử không muốn hiển thị của mảng con
        if(datacategory.Parent) {
          delete datacategory.Parent.published_at;
          delete datacategory.Parent.created_at;
          delete datacategory.Parent.updated_at;
        }
      }
    });
    const knex = strapi.connections.default;
    
    // console.log(JSON.stringify(result, null, 2));
    dataTemp.map(item => {
        if(!item.Parent) {
            newData.push(item);
        }
    })
    let id = 0;
    newData.map(async item => {
        id = item.id;
        const result = await knex('categories').where({ Parent: id });
        item.Child.push(result);
        console.log(JSON.stringify(item, null, 2));
        return item;
    })
    // XuLyData(dataTemp);
    

    return newData;
  },
};

// function XuLyData(data) {
//     let idParent = 0;
//     let resutl = [];
//     resutl = data.map(item => {
//         if(item.Parent) {
//             idParent = item.Parent.id;
//         }
//         return (
//             newData.map(i => {
//                 if(idParent === i.id) {
//                     delete item.Parent;
//                     i.Child.push(item);
//                     return { ...i };
//                 }
//             })
//         )
//   })
// }

