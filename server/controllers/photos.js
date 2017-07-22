const models = require('../../db/models');
const utils = require('./lib/utils.js');

module.exports.savePhoto = (options) => {

  return models.Photo.forge(options).save();
};

module.exports.getNearbyPohotos = (currentlocation) => {


  return models.Photo.fetchAll()
    .then((data) => {
      return utils.filterByDistance(data.models, currentlocation);
    })
    .then((photosObj) => {
      //check if user liked any of photos

      if (photosObj.length > 0) {
        return models.Photo.PhotoQueries.getPhotoLikesForUser(photosObj[0].profile_id)
          .then((likesObj) => {
            return utils.addLikedProperty(photosObj, likesObj.rows);
          });
      } else {
        return [];
      }
    });
};

module.exports.addLike = (photoId, profileId) => {
  
  // check if the photo id an the user id already exist 
  return models.Like.forge({photo_id: photoId, profile_id: profileId})
    .save()
    .then(() => {
      return models.Photo.query().where({'id': photoId})
        .select()
        .then((data2) => {
          return data2[0].like_count;
        })
        .then((likeCount) => {
          if (likeCount === null ) {
            return models.Photo.forge({id: photoId}).save({'like_count': 1});
          } else {
            return models.Photo.forge({id: photoId}).save({'like_count': likeCount + 1});
          }
        });
    });
};
//how to insert data:
// dont add the id it self increments 
// // Save with no arguments
// Model.forge({id: 5, firstName: "John", lastName: "Smith"}).save().then(function() { //...

// // Or add attributes during save
// Model.forge({id: 5}).save({firstName: "John", lastName: "Smith"}).then(function() { //...

// // Or, if you prefer, for a single attribute
// Model.forge({id: 5}).save('name', 'John Smith').then(function() { //...