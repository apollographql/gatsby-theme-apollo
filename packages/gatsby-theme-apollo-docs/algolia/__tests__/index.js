const {transformer} = require('../');
const data = require('./mock-data');

test('parse MDX', async () => {
  const records = await transformer(data);

  console.log(records);

  // from original tests
  //   const firstRecord = mdxRecs[0];
  //   expect(mdxRecs.length).toBe(6);
  //   expect(firstRecord.url.includes(baseUrl)).toBe(true);
  //   expect(firstRecord).toEqual(
  //     expect.objectContaining({
  //       objectID: expect.any(String),
  //       index: expect.any(Number),
  //       docset: expect.any(String),
  //       type: expect.any(String),
  //       categories: expect.any(Array),
  //       url: expect.any(String),
  //       excerpt: expect.any(String),
  //       pageviews: expect.any(Number),
  //       slug: expect.any(String),
  //       sidebarTitle: expect.any(String),
  //       apiReference: expect.any(Boolean),
  //       text: expect.any(String),
  //       headings: expect.any(Object)
  //     })
  //   );
});
