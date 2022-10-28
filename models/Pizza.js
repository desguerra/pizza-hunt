/* could import the entire mongoose library, but only need 
to worry about the Schema constructor and model function */
const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      // can also put "required: 'You need to provide a pizza name!'"
      required: true,
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      // if you want to provide a custom message for enumerable values,
      // you need to look into implementing the validate option Mongoose
      // lets you use, where you can create a custom function to test the values
      required: true,
      // enumerable - refers to a set of data that can be iterated 
      // over—much like using the for...in loop to iterate through an object
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;
