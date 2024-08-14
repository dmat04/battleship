import type { DocumentNode } from "graphql";
export const typeDefs = {
  kind: "Document",
  definitions: [
    {
      name: { kind: "Name", value: "Query" },
      kind: "ObjectTypeDefinition",
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "ping" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "gameSettings" },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "gameId" },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "ID" },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GameSettings" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "checkUsername" },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "username" },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "String" },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "UsernameQueryResult" },
            },
          },
          directives: [],
        },
      ],
      directives: [],
      interfaces: [],
    },
    {
      name: { kind: "Name", value: "Mutation" },
      kind: "ObjectTypeDefinition",
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "createRoom" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "RoomCreatedResult" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "joinRoom" },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "inviteCode" },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "String" },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "RoomJoinedResult" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "placeShips" },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "roomID" },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "ID" },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "shipPlacements" },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "ListType",
                  type: {
                    kind: "NonNullType",
                    type: {
                      kind: "NamedType",
                      name: { kind: "Name", value: "ShipPlacementInput" },
                    },
                  },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "ShipsPlacedResult" },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "guestLogin" },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "username" },
              type: {
                kind: "NamedType",
                name: { kind: "Name", value: "String" },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "LoginResult" },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "registeredLogin" },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "username" },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "String" },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "password" },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "String" },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "LoginResult" },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "registerUser" },
          arguments: [
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "username" },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "String" },
                },
              },
              directives: [],
            },
            {
              kind: "InputValueDefinition",
              name: { kind: "Name", value: "password" },
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "String" },
                },
              },
              directives: [],
            },
          ],
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "LoginResult" },
          },
          directives: [],
        },
      ],
      directives: [],
      interfaces: [],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "RoomCreatedResult" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "roomID" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "inviteCode" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "wsAuthCode" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "RoomJoinedResult" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "roomID" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "wsAuthCode" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "ShipsPlacedResult" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "placedShips" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "PlacedShip" },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "gameRoomStatus" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "GameRoomStatus" },
            },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "EnumTypeDefinition",
      name: { kind: "Name", value: "ShipClassName" },
      directives: [],
      values: [
        {
          kind: "EnumValueDefinition",
          name: { kind: "Name", value: "SUBMARINE" },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: { kind: "Name", value: "DESTROYER" },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: { kind: "Name", value: "CRUISER" },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: { kind: "Name", value: "BATTLESHIP" },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: { kind: "Name", value: "CARRIER" },
          directives: [],
        },
      ],
    },
    {
      kind: "EnumTypeDefinition",
      name: { kind: "Name", value: "ShipOrientation" },
      directives: [],
      values: [
        {
          kind: "EnumValueDefinition",
          name: { kind: "Name", value: "VERTICAL" },
          directives: [],
        },
        {
          kind: "EnumValueDefinition",
          name: { kind: "Name", value: "HORIZONTAL" },
          directives: [],
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Coordinate" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "x" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "y" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: { kind: "Name", value: "CoordinateInput" },
      directives: [],
      fields: [
        {
          kind: "InputValueDefinition",
          name: { kind: "Name", value: "x" },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: { kind: "Name", value: "y" },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "Ship" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "shipID" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "type" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ShipClassName" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "size" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "InputObjectTypeDefinition",
      name: { kind: "Name", value: "ShipPlacementInput" },
      directives: [],
      fields: [
        {
          kind: "InputValueDefinition",
          name: { kind: "Name", value: "shipID" },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: { kind: "Name", value: "orientation" },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ShipOrientation" },
            },
          },
          directives: [],
        },
        {
          kind: "InputValueDefinition",
          name: { kind: "Name", value: "position" },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CoordinateInput" },
            },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "PlacedShip" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "ship" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Ship" } },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "orientation" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ShipOrientation" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "position" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Coordinate" },
            },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "GameSettings" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "boardWidth" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "boardHeight" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "availableShips" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "ListType",
              type: {
                kind: "NonNullType",
                type: {
                  kind: "NamedType",
                  name: { kind: "Name", value: "Ship" },
                },
              },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "turnDuration" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "GameRoomStatus" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "player" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "playerShipsPlaced" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "playerSocketConnected" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "opponent" },
          arguments: [],
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "opponentShipsPlaced" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "opponentSocketConnected" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "currentPlayer" },
          arguments: [],
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          directives: [],
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "LoginResult" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "username" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "accessToken" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "expiresAt" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
          directives: [],
        },
      ],
    },
    {
      kind: "ObjectTypeDefinition",
      name: { kind: "Name", value: "UsernameQueryResult" },
      interfaces: [],
      directives: [],
      fields: [
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "username" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "taken" },
          arguments: [],
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
          directives: [],
        },
        {
          kind: "FieldDefinition",
          name: { kind: "Name", value: "validationError" },
          arguments: [],
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          directives: [],
        },
      ],
    },
    {
      kind: "SchemaDefinition",
      operationTypes: [
        {
          kind: "OperationTypeDefinition",
          type: { kind: "NamedType", name: { kind: "Name", value: "Query" } },
          operation: "query",
        },
        {
          kind: "OperationTypeDefinition",
          type: {
            kind: "NamedType",
            name: { kind: "Name", value: "Mutation" },
          },
          operation: "mutation",
        },
      ],
    },
  ],
} as unknown as DocumentNode;
