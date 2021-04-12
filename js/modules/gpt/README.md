# ESI media Google Publisher Tags library

## Introduction

The aim of this library is to help load our google ads in a less abitary fashion.
It supports the use of config to drive our ads being loaded rather than having bespoke code
scattered through our code base and bespoke hard to maintain code for each ad.

It also allows simple ads to be loaded by just adding a few attributes to the div element
in which you wish to contain an ad.

## Usage

To use this library you just need to call the following when your page has finished rendering.

### Basic JS imlementation:

```js
import gpt from './gpt';

const adConfig = ...;

gpt({ adConfig });
```

### How ad config works:

Basic HTML markup to display one ad:

```html
<div
  data-mpu="true"
  data-tile-name="top_banner"
  data-ad-unit-path="/[network-code]/[parent-ad-unit-code]/[SECTION_L1]/[SECTION_L2]/[PAGE]/[ad-unit-code]"
  data-size-key="TOP_BANNER"
  data-force-bulk="true"
></div>
```

**Explanation of other attributes**

| Attibute name     | Description                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data-mpu          | For an element to be picked up by this library it must have the data-mpu attrubute.                                                                          |
| data-tile-name    | This is the tile name of the particular ad                                                                                                                   |
| data-ad-unit-path | The ad unit path\*                                                                                                                                           |
| data-size-key     | The size as specified in the config passed to this lib                                                                                                       |
| data-force-bulk   | By default all ads in view when a page loads are bulk loaded, this attribute can be used to bulk loads ads regardless of where they are rendered on the page |

\* Ad unit path follows the format /network-code/\[parent-ad-unit-code/.../]ad-unit-code, where:

- network-code is a unique identifier for the Ad Manager network the ad unit belongs to
- parent-ad-unit-code are the codes of all parent ad units (only applies to non-top level ad units)
- ad-unit-code is the code for the ad unit to be displayed

### How ad config works:

**Example of ad config**

```json
{
  "BANNER": [
    { "from": 0, "supportedSizes": [] },
    { "from": 768, "supportedSizes": [[728, 90]] },
    {
      "from": 1000,
      "supportedSizes": [
        [970, 250],
        [728, 90]
      ]
    }
  ],
  "MPU": [{ "from": 0, "supportedSizes": [[300, 250]] }],
  "MPU_NOT_DESKTOP": [
    { "from": 0, "supportedSizes": [[300, 250]] },
    { "from": 1000, "supportedSizes": [] }
  ],
  "DMPU_OR_2X_MPU": [
    {
      "from": 0,
      "supportedSizes": [
        [300, 250],
        [300, 600]
      ]
    },
    {
      "from": 768,
      "supportedSizes": [
        [300, 250],
        [300, 600]
      ],
      "conditionalAd": {
        "if": [300, 250],
        "then": [300, 250],
        "tileNameExtra": "_bottom"
      }
    }
  ]
}
```

Each property of the config corresponds to a `data-size-key` that can be applied to
one or more div element on the page and the array thet relates to each of these
properties drives the ad sizes that display within at a particular screen size.

**Example of size config for a particular key:**

```json
[
  { "from": 0, "supportedSizes": [] },
  { "from": 768, "supportedSizes": [[728, 90]] },
  {
    "from": 1000,
    "supportedSizes": [
      [970, 250],
      [728, 90]
    ]
  }
]
```

Each of these arrays contain one or more item corresponding to a break point. They must
be in size order from smallest to largest break point and the first item should start from 0.

**Example of config for particular break point**

```json
{
  "from": 768,
  "supportedSizes": [
    [300, 250],
    [300, 600]
  ],
  "conditionalAd": {
    "if": [300, 250],
    "then": [300, 250],
    "tileNameExtra": "_bottom"
  }
}
```

| Property name  | Description                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| from           | This is the page width from which this break point becomes active                        |
| supportedSizes | These are the ad sizes that are supported at this breakpoint                             |
| conditionalAd  | This property defines an additional ad that can be loaded if a certain ad size is loaded |

**Conditional ads**

This is a special case, if an ad slot supports more than one size and a small ad is rendered
there may be room in the layout to host another ad - for example is a single mpu rendered in a space
large enough for a dmpu. The example above will do exactly that.

**Example of config for conditional ad**

```json
{
  "if": [300, 250],
  "then": [300, 250],
  "tileNameExtra": "_bottom"
}
```

| Property name | Description                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| if            | Specifies the ad size that is loaded that will trigger extra ad to load                                                                     |
| then          | The size of the ad that will load if the 'if' condition is met                                                                              |
| tileNameExtra | This property defines a string that will be added to the tilename to differentiate it from the ad that triggered the conditional ad to load |
