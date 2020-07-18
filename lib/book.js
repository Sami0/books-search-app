'use strict';
const express = require('express');
const rp = require('request-promise');

module.exports = es => {

  const url = `http://${es.host}:${es.port}/${es.books_index}/book/_search`;

  const router = express.Router();

  /**
   * Search for books by query
   */
  router.get('/search/books/:field/:query', async (req, res) => {
    const esReqBody = {
      size: 10,
      query: {
        match: {
          [req.params.field]: req.params.query
        }
      },
    };

    try {
      const esResBody = await rp({url, json: true, body: esReqBody});
      const results = esResBody.hits.hits.map(hit => hit._source);
      res.status(200).json(results);
    } catch (esResErr) {
      res.status(esResErr.statusCode || 502).json(esResErr.error);
    }
  });

    
    
    
    
    
  
  router.get('/book/:id', async (req, res) => {
    const bookUrl =
      `http://${es.host}:${es.port}/${es.books_index}` +
      `/book/${req.params.id}`;
    try {
      const {_source: book} = await rp({url: bookUrl, json: true});
      res.status(200).json(book);
    } catch (esResErr) {
      res.status(esResErr.statusCode || 502).json(esResErr.error);
    }
  });


    
    
    
    
    
    
  router.get('/suggest/:field/:query', async (req, res) => {
    const esReqBody = {
      size: 0,
      suggest: {
        suggestions: {
          text: req.params.query,
          term: {
            field: req.params.field,
            suggest_mode: 'always',
          },
        }
      }
    };

    try {
      const {suggest} = await rp({url, json: true, body: esReqBody});
      res.status(200).json(suggest.suggestions);
    } catch (esResErr) {
      res.status(esResErr.statusCode || 502).json(esResErr.error);
    }
  });

  return router;
};
