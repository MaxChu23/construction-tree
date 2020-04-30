const tree = [
  {
    id: 1,
    type: "Project",
    name: "Wunderwaffe",
    expanded: false,
    properties: [
      { id: 1, type: "boolean", value: true, name: "Hard" },
      { id: 2, type: "text", value: "Coding project sfdds fsdf sdf sdf sdfs sfd sdf sdf sdf ", name: "Type" },
      { id: 3, type: 'list', name: 'Furniture', value: [
        { id: 1, key: 'Chairs', value: 3 },
        { id: 2, key: 'Tables', value: 1 },
      ] }
    ],
    items: [
      {
        id: 2,
        type: "Station",
        name: "2",
        expanded: false,
        properties: [
          { id: 1, type: "boolean", value: 'no', name: "Hard" },
          { id: 2, type: "text", value: "It took him many many years", name: "Type" },
        ],
        items: [
          {
            id: 3,
            type: "Level",
            name: "X",
            expanded: false,
            items: [
              {
                id: 4,
                type: "Room",
                name: "Boiler room",
                expanded: false,
                items: [

                ]
              },
              {
                id: 5,
                type: "Room",
                name: "Boiler room 2",
                expanded: false,
                items: [

                ]
              },
            ]
          },
          {
            id: 6,
            type: "Level",
            name: "Z",
            expanded: false,
            items: [

            ]
          }
        ]
      },
      {
        id: 7,
        type: "Station",
        name: "A",
        expanded: false,
        items: [
          {
            id: 8,
            type: "Level",
            name: "Deck",
            expanded: true,
            items: [
              {
                id: 9,
                type: "Area",
                name: "Back of house",
                expanded: false,
                items: [
                  {
                    id: 10,
                    type: "Room",
                    name: "Hello World",
                    expanded: false,
                    items: [

                    ]
                  },
                ]
              },
              {
                id: 11,
                type: "Room",
                name: "Boiler room 2",
                expanded: false,
                items: [

                ]
              },
            ]
          },
          {
            id: 12,
            type: "Room",
            name: "III Reicht",
            expanded: false,
            items: [

            ]
          }
        ]
      }
    ]
  },
]

export default tree
