import { prebidAdConfig, adsForBidding } from '../prebid';

const mockBidders = [
  {
    params: () => ({ bidder: 'bidder1' }),
    adIds: {
      ad1: {
        web: 'bidder1_id01',
      },
      ad2: {
        web: 'bidder1_id02',
      },
      mpu4: {
        web: 'bidder1_id03',
      },
    },
  },
  {
    params: () => ({ bidder: 'bidder2' }),
    adIds: {
      ad1: {
        web: 'bidder2_id01',
      },
      ad2: {
        web: 'bidder2_id02',
      },
      mpu3: {
        web: 'bidder2_id03',
      },
    },
  },
];

describe('prebid functions', () => {
  it('returns correct matching ads from adsForBidding()', () => {
    let availableAds = [
      {
        id: 'mpu3',
        sizes: [{ from: 0, supportedSizes: [[300, 250]] }],
      },
      {
        id: 'mpu4',
        sizes: [{ from: 0, supportedSizes: [[300, 250]] }],
      },
    ];

    const ads = adsForBidding({ ads: availableAds, bidders: mockBidders });
    expect(ads).toEqual(availableAds);
  });

  it('returns no matching ads from adsForBidding()', () => {
    let availableAds = [
      {
        id: 'mpu1',
      },
      {
        id: 'mpu2',
      },
    ];

    const ads = adsForBidding({ ads: availableAds, bidders: mockBidders });
    expect(ads).toEqual([]);
  });

  it('returns correctly formatted object from prebidAdConfig()', () => {
    global.JSGlobals = {};
    let availableAds = [
      {
        id: 'ad1',
        sizes: [{ from: 0, supportedSizes: [[300, 250]] }],
      },
      {
        id: 'mpu3',
        sizes: [{ from: 0, supportedSizes: [[300, 250]] }],
      },
      {
        id: 'mpu4',
        sizes: [{ from: 0, supportedSizes: [[300, 250]] }],
      },
    ];

    const config = prebidAdConfig(availableAds, mockBidders);
    expect(config).toMatchInlineSnapshot(`
      Array [
        Object {
          "bids": Array [
            Object {
              "bidder": "bidder1",
            },
            Object {
              "bidder": "bidder2",
            },
          ],
          "code": "ad1",
          "mediaTypes": Object {
            "banner": Object {
              "sizeConfig": Array [
                Object {
                  "minViewPort": Array [
                    0,
                    0,
                  ],
                  "sizes": Array [
                    Array [
                      300,
                      250,
                    ],
                  ],
                },
              ],
            },
          },
        },
        Object {
          "bids": Array [
            Object {
              "bidder": "bidder2",
            },
          ],
          "code": "mpu3",
          "mediaTypes": Object {
            "banner": Object {
              "sizeConfig": Array [
                Object {
                  "minViewPort": Array [
                    0,
                    0,
                  ],
                  "sizes": Array [
                    Array [
                      300,
                      250,
                    ],
                  ],
                },
              ],
            },
          },
        },
        Object {
          "bids": Array [
            Object {
              "bidder": "bidder1",
            },
          ],
          "code": "mpu4",
          "mediaTypes": Object {
            "banner": Object {
              "sizeConfig": Array [
                Object {
                  "minViewPort": Array [
                    0,
                    0,
                  ],
                  "sizes": Array [
                    Array [
                      300,
                      250,
                    ],
                  ],
                },
              ],
            },
          },
        },
      ]
    `);
  });
});
