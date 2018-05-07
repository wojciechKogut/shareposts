const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    googleID: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },

});

/** create collection and add schema  */

mongoose.model("users", usersSchema);