var mongoose                = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose");

var FoodLogSchema = new mongoose.Schema({
   user: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   date: String,
   week: Number,
   day: Number,
   weight: Number,
   ketosis: String,
   water: Number,
   
   B_protein: String, B_protein_servings: Number, B_protein_carbs: Number, B_protein_proteins: Number,
   B_fruit: String, B_fruit_servings: Number, B_fruit_carbs: Number, B_fruit_proteins: Number,
   B_beverage: String, B_beverage_servings: Number, B_beverage_carbs: Number, B_beverage_proteins: Number,
   
   S1: String, S1_servings: Number, S1_carbs: Number, S1_proteins: Number,
   
   L_protein: String, L_protein_servings: Number, L_protein_carbs: Number, L_protein_proteins: Number,
   L_vegitable: String, L_vegitable_servings: Number, L_vegitable_carbs: Number, L_vegitable_proteins: Number,
   L_lettuce: String, L_lettuce_servings: Number, L_lettuce_carbs: Number, L_lettuce_proteins: Number,
   L_fruit: String, L_fruit_servings: Number, L_fruit_carbs: Number, L_fruit_proteins: Number,
   L_beverage: String, L_beverage_servings: Number, L_beverage_carbs: Number, L_beverage__proteins: Number,
   
   S2: String, S2_servings: Number, S2_carbs: Number, S2_proteins: Number,
   
   D_protein: String, D_protein_servings: Number, D_protein_carbs: Number, D_protein_proteins: Number,
   D_vegitable: String, D_vegitable_servings: Number, D_vegitable_carbs: Number, D_vegitable_proteins: Number,
   D_lettuce: String, D_lettuce_servings: Number, D_lettuce_carbs: Number, D_lettuce_proteins: Number,
   D_fruit: String, D_fruit_servings: Number, D_fruit_carbs: Number, D_fruit_proteins: Number,
   D_beverage: String, D_beverage_servings: Number, D_beverage_carbs: Number, D_beverage__proteins: Number,
   
   S3: String, S3_servings: Number, S3carbs: Number, S3_proteins: Number
});

FoodLogSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("FoodLog", FoodLogSchema);
