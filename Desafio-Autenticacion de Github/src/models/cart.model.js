// import mongoose from 'mongoose';

// const collectionName  = 'carts';

// const numberTypeSchemaNOnUniqueRequired = {
//     type: Number,
//     required: true
// };
// const cartSchema = new mongoose.Schema({
//     products: {
//         type: [
//             {
//                 product: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: "products"
//                 },
//                 quantity:numberTypeSchemaNOnUniqueRequired
//             }
//         ],
//         default:[]
//     }
// });

// cartSchema.pre('findOne', function() {
//     this.populate("products.product");
// });

// export const cartModel = mongoose.model(collectionName, cartSchema, 'carts');


import mongoose from 'mongoose';

const collectionName = 'carts';

const numberTypeSchemaNonUniqueRequired = {
  type: Number,
  required: true,
};

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
        },
        quantity: numberTypeSchemaNonUniqueRequired,
      },
    ],
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});

cartSchema.pre('findOne', function () {
  this.populate('products.product');
});

export const cartModel = mongoose.model(collectionName, cartSchema, 'carts');