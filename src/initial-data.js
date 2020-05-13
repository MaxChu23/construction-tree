const tree = [
  {
    id: '1',
    type: 'Project',
    name: 'Burj Khalifa',
    expanded: true,
    properties: [
      { id: '1', type: 'boolean', value: true, name: 'Tall' },
      { id: '2', type: 'boolean', value: false, name: 'Easy' },
      { id: '3', type: 'boolean', value: true, name: 'Expensive' },
      { id: '4', type: 'text', value: 'UAE', name: 'Country' },
      { id: '5', type: 'text', value: 'Dubai', name: 'City' },
      { id: '6', type: 'text', value: 'Very tall building in Dubai.', name: 'Type' },
    ],
    items: [
      {
        id: '2',
        type: 'Station',
        name: '2',
        expanded: false,
        properties: [
          { id: '7', type: 'boolean', value: true, name: 'Big' },
          { id: '8', type: 'text', value: 'Platform B', name: 'Type' },
        ],
        items: [
          {
            id: '3',
            type: 'Level',
            name: 'X',
            expanded: false,
            items: [
              {
                id: '4',
                type: 'Room',
                name: 'Boiler room',
                expanded: false,
                items: [],
              },
              {
                id: '5',
                type: 'Room',
                name: 'Boiler room 2',
                expanded: false,
                items: [],
              },
            ],
          },
          {
            id: '6',
            type: 'Level',
            name: 'Z',
            expanded: false,
            items: [],
          },
        ],
      },
      {
        id: '7',
        type: 'Station',
        name: 'A',
        expanded: false,
        items: [
          {
            id: '8',
            type: 'Level',
            name: 'Deck',
            expanded: true,
            items: [
              {
                id: '9',
                type: 'Area',
                name: 'Back of house',
                expanded: false,
                items: [
                  {
                    id: '10',
                    type: 'Room',
                    name: 'Hello World',
                    expanded: false,
                    items: [],
                  },
                ],
              },
              {
                id: '11',
                type: 'Room',
                name: 'Boiler room 2',
                expanded: false,
                items: [],
              },
            ],
          },
          {
            id: '12',
            type: 'Room',
            name: '203',
            expanded: false,
            items: [],
          },
        ],
      },
    ],
  },
]

export default tree
