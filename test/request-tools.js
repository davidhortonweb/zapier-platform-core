'use strict';

require('should');
const requestMerge = require('../src/tools/request-merge');

describe('request tools', () => {
  it('should merge requests', () => {
    const request = requestMerge(
      {params: {'api-key': 'dcba'}, headers: {'ApI-kEy': 'abcd'}},
      {url: 'http://example.com?cat=mouse', params: {hello: 'world'}}
    );
    const expected = {
      method: 'GET',
      url: 'http://example.com',
      params: {
        'api-key': 'dcba',
        'hello': 'world',
        'cat': 'mouse'
      },
      headers: {
        'user-agent': 'Zapier',
        'ApI-kEy': 'abcd'
      }
    };
    request.should.eql(expected);
  });

  it('should drop headers', () => {
    const request = requestMerge(
      {url: 'http://example.com', headers: {'api-key': 'abcd'}},
      {headers: {'api-key': ''}}
    );
    const expected = {
      method: 'GET',
      url: 'http://example.com',
      params: {},
      headers: {
        'user-agent': 'Zapier'
      }
    };
    request.should.eql(expected);
  });

  it('should overwrite headers, case insensitively, and by order', () => {
    let request = requestMerge(
      {url: 'http://example.com', headers: {'api-key': 'abcd'}},
      {headers: {'api-Key': 'efgh'}}
    );
    let expected = {
      method: 'GET',
      url: 'http://example.com',
      params: {},
      headers: {
        'user-agent': 'Zapier',
        'api-Key': 'efgh'
      }
    };
    request.should.eql(expected);

    request = requestMerge(
      {url: 'http://example.com', headers: {'api-key': 'abcd', 'Token': '123', 'token': '545'}},
      {headers: {'api-key': 'efgh', 'tOken': '754'}}
    );
    expected = {
      method: 'GET',
      url: 'http://example.com',
      params: {},
      headers: {
        'user-agent': 'Zapier',
        'api-key': 'efgh',
        'tOken': '754'
      }
    };
    request.should.eql(expected);
  });

});
