/***

editing 2:37 pm 14 jan 2020
 *
***/
/**

 * connect with elastic search 
 
 // es stands for elastic-search 
 */
'use strict';
const express = require('express');
const rp = require('request-promise');

const getUserKey = ({user:{provider, id}}) => `${provider}-${id}`;

module.exports = es => {
  const url = `http://${es.host}:${es.port}/${es.bundles_index}/bundle`;
  const bundleUrl = `${url}/${es.id}`;
 
  const bookUrl =  `http://${es.host}:${es.port}` + `/${es.books_index}/book/${es.pgid}`;
 
 const router = express.Router();
    
    
    
    
  /**
   * //
   // 1- user must login and be authenticated first 
   */
  router.use((req, res, next) => {
    if (!req.isAuthenticated()) {
      res.status(403).json({
        error: 'You must sign in to use this service.',
      });
      return;
    }
    next();
  });
    
     /**
   * //
   // 2- show lists the user created previously 
   */
 router.get('/list-bundles', async (req, res) => {
    try {
      const esReqBody = {
        size: 1000,
        query: {
          match: {
            userKey: getUserKey(req),
          }
        },
      };

      const options = {
        url: `${url}/_search`,
        json: true,
        body: esReqBody,
      };

      const esResBody = await rp(options);
      const bundles = esResBody.hits.hits.map(hit => ({
        id: hit._id,
        name: hit._source.name,
      }));
      res.status(200).json(bundles);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });

     /**
   * //
   // 3- let the user create a new list 
   */
    router.post('/bundle', async (req, res) => {
    try {
      const bundle = {
        name: req.query.name || '',
        userKey: getUserKey(req),
        books: [idx],
      };

      const esResBody = await rp.post({url, body: bundle, json: true});
      res.status(201).json(esResBody);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });
    
    
       /**
   * //
   // 4- let the user receive the list they created 
   */
      router.get('/bundle/:id', async (req, res) => {
    try {
      const options = {
        url: `${url}/${req.params.id}`,
        json: true,
      };

      const {_source: bundle} = await rp(options);

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to view this bundle.',
        };
      }

      res.status(200).json({id: req.params.id, bundle});
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });
    
      /**
   * //
   // 4- let the user set a name of their choice to that list 
   */
    
    
     router.put('/bundle/:id/name/:name', async (req, res) => {
    try {
      const bundleUrl = `${url}/${req.params.id}`;
      
      const {_source: bundle} = await rp({url: bundleUrl, json: true});
      

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to modify this bundle.',
        };
      }

      bundle.name = req.params.name;

      

      const esResBody =
        await rp.put({url: bundleUrl, body: bundle, json: true});
      res.status(200).json(esResBody);
      
      bundleUrl = bundleurl.replace(" ", "%20");
    } catch (err) {
      console.log(`statusCode: ${res.statusCode}`);
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });
    
    
     /**
   * //
   // 5- start searching for the book the user typed 
   */
   
    // 5.1 place a request  for the book 
    
    router.post('/bundle/:id/book/:pgid', async (req, res) => {
    try {
        const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
        if (idx === -1) {
          bundle.books.push({
            id: req.params.pgid,
            title: book.title,
          });
        }
        const esResBody = await rp.put({
          url: bundleUrl,
          qs: { version },
          body: bundle,
          json: true,
        });
        res.status(200).json(esResBody);

        
    } catch (err) {
        console.log(`statusCode: ${err.statusCode}`);
        res.status(err.statusCode || 502).json(err.error || err);
      }
    });

// 5.2 get the book by id 

router.get('/bundle/:id/', async (req, res) => {
 
    try {
        const bundleUrl = `${url}/${req.params.id}`;

        const bookUrl =
            `http://${es.host}:${es.port}` +
            `/${es.books_index}/book/${req.params.pgid}`;

      const options = {
        url: `${url}/${req.params.id}`,
      
        json: true,
      };

      const {_source: bundle} = await rp(options);

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to view this bundle.',
        };
      }

      res.status(200).json({id: req.params.id, bundle});
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });

  // 5.3 enable placing the book in the list 
  router.put('/bundle/:id/book/:pgid', async (req, res) => {
    try {
      const bundleUrl = `${url}/${req.params.id}`;

      const bookUrl =
          `http://${es.host}:${es.port}` +
          `/${es.books_index}/book/${req.params.pgid}`;

        

      // Request the bundle and book in parallel.
      const [bundleRes, bookRes] = await Promise.all([
        rp({url: bundleUrl, json: true}),
        rp({url: bookUrl, json: true}),
      ]);

      //  book info 
      const {_source: bundle, _version: version} = bundleRes;
      const {_source: book, } = bookRes;

      //user authentication 

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to modify this bundle.',
        };
      }

      // index of pushing books

      const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
      if (idx === -1) {
        bundle.books.push({
          id: req.params.pgid,
          title: book.title,
        });
      }

    

      // place the updated bundle back in the index.
      const esResBody = await rp.put({
        url: bundleUrl,
        body: bundle,
        json: true,
      });
      res.status(200).json(esResBody);
  
      //  catch errors 
    } catch (err) {
      console.log(`statusCode: ${err.statusCode}`);
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });



  /**
   * 6 - let the user remove a book from the list 
   * DELETE 1
   */
  router.delete('/bundle/:id/book/:pgid', async (req, res) => {
    try {
      const bundleUrl = `${url}/${req.params.id}`;

      const {_source: bundle, _version: version} =
        await rp({url: bundleUrl, json: true});

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to modify this bundle.',
        };
      }

      const idx = bundle.books.findIndex(book => book.id === req.params.pgid);
      if (idx === -1) {
        throw {
          statusCode: 409,
          error: 'Conflict - Bundle does not contain that book.',
        };
      }

      bundle.books.splice(idx, 1);

      const esResBody = await rp.put({
        url: bundleUrl,
        body: bundle,
        json: true,
      });
      res.status(200).json(esResBody);
    
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });


  /**
   * 7 let the user delete a list they've created 
   * DELETE 2 
   */
  router.delete('/bundle/:id', async (req, res) => {
    try {
      const bundleUrl = `${url}/${req.params.id}`;

      const {_source: bundle, _version: version} =
        await rp({url: bundleUrl, json: true});

      if (bundle.userKey !== getUserKey(req)) {
        throw {
          statusCode: 403,
          error: 'You are not authorized to delete this bundle.',
        };
      }

      const esResBody = await rp.delete({
        url: bundleUrl,
        json: true,
      });
      res.status(200).json(esResBody);
    } catch (err) {
      res.status(err.statusCode || 502).json(err.error || err);
    }
  });

  return router;
};

