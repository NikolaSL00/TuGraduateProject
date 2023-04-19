import axios from 'axios';
const { SERVER_CREDENTIALS, TOKEN_NAME } = require('../config/constants');

const sendResult = (data: any) => {
  const options = {
    data,
  };
  options[TOKEN_NAME] = SERVER_CREDENTIALS.TOKEN_VALUE;

  axios.post('https://localhost:3001/', options);
};

exports.sendResult = sendResult;
