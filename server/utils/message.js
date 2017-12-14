var moment = require('moment');

const generateMessage = (from, text) => {
    return {
      from,
      text,
      createAt: moment().valueOf()
    };
};
const generateLocationMessage = (from, lat, long) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${long}`,
        createAt: moment().valueOf(),
    };
};

const generateImageMessage = (from, image) => {
    return {
        from,
        image,
        createAt: moment().valueOf(),
    };
};

module.exports = {generateMessage, generateLocationMessage, generateImageMessage};