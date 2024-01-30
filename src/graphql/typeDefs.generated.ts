import type { DocumentNode } from 'graphql';
  export const typeDefs = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query","loc":{"start":5,"end":10}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"ping","loc":{"start":15,"end":19}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":21,"end":27}},"loc":{"start":21,"end":27}},"loc":{"start":21,"end":28}},"directives":[],"loc":{"start":15,"end":28}}],"loc":{"start":0,"end":30}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation","loc":{"start":37,"end":45}},"interfaces":[],"directives":[],"fields":[],"loc":{"start":32,"end":45}},{"kind":"ObjectTypeExtension","name":{"kind":"Name","value":"Query","loc":{"start":58,"end":63}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"gameSettings","loc":{"start":68,"end":80}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"gameId","loc":{"start":81,"end":87}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":89,"end":91}},"loc":{"start":89,"end":91}},"loc":{"start":89,"end":92}},"directives":[],"loc":{"start":81,"end":92}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GameSettings","loc":{"start":95,"end":107}},"loc":{"start":95,"end":107}},"loc":{"start":95,"end":108}},"directives":[],"loc":{"start":68,"end":108}}],"loc":{"start":46,"end":110}},{"kind":"ObjectTypeExtension","name":{"kind":"Name","value":"Mutation","loc":{"start":124,"end":132}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createRoom","loc":{"start":137,"end":147}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoomCreatedResult","loc":{"start":149,"end":166}},"loc":{"start":149,"end":166}},"loc":{"start":149,"end":167}},"directives":[],"loc":{"start":137,"end":167}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"joinRoom","loc":{"start":170,"end":178}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"inviteCode","loc":{"start":179,"end":189}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":191,"end":197}},"loc":{"start":191,"end":197}},"loc":{"start":191,"end":198}},"directives":[],"loc":{"start":179,"end":198}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RoomJoinedResult","loc":{"start":201,"end":217}},"loc":{"start":201,"end":217}},"loc":{"start":201,"end":218}},"directives":[],"loc":{"start":170,"end":218}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"placeShips","loc":{"start":221,"end":231}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"roomID","loc":{"start":232,"end":238}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":240,"end":242}},"loc":{"start":240,"end":242}},"loc":{"start":240,"end":243}},"directives":[],"loc":{"start":232,"end":243}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"shipPlacements","loc":{"start":245,"end":259}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipPlacement","loc":{"start":262,"end":275}},"loc":{"start":262,"end":275}},"loc":{"start":262,"end":276}},"loc":{"start":261,"end":277}},"loc":{"start":261,"end":278}},"directives":[],"loc":{"start":245,"end":278}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GameRoomStatus","loc":{"start":281,"end":295}},"loc":{"start":281,"end":295}},"loc":{"start":281,"end":296}},"directives":[],"loc":{"start":221,"end":296}}],"loc":{"start":112,"end":298}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"RoomCreatedResult","loc":{"start":305,"end":322}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"roomID","loc":{"start":327,"end":333}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":335,"end":337}},"loc":{"start":335,"end":337}},"loc":{"start":335,"end":338}},"directives":[],"loc":{"start":327,"end":338}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"inviteCode","loc":{"start":341,"end":351}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":353,"end":359}},"loc":{"start":353,"end":359}},"loc":{"start":353,"end":360}},"directives":[],"loc":{"start":341,"end":360}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"wsAuthCode","loc":{"start":363,"end":373}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":375,"end":381}},"loc":{"start":375,"end":381}},"loc":{"start":375,"end":382}},"directives":[],"loc":{"start":363,"end":382}}],"loc":{"start":300,"end":384}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"RoomJoinedResult","loc":{"start":391,"end":407}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"roomID","loc":{"start":412,"end":418}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":420,"end":422}},"loc":{"start":420,"end":422}},"loc":{"start":420,"end":423}},"directives":[],"loc":{"start":412,"end":423}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"wsAuthCode","loc":{"start":426,"end":436}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":438,"end":444}},"loc":{"start":438,"end":444}},"loc":{"start":438,"end":445}},"directives":[],"loc":{"start":426,"end":445}}],"loc":{"start":386,"end":447}},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ShipClassName","loc":{"start":454,"end":467}},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"SUBMARINE","loc":{"start":472,"end":481}},"directives":[],"loc":{"start":472,"end":481}},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"DESTROYER","loc":{"start":484,"end":493}},"directives":[],"loc":{"start":484,"end":493}},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"CRUISER","loc":{"start":496,"end":503}},"directives":[],"loc":{"start":496,"end":503}},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"BATTLESHIP","loc":{"start":506,"end":516}},"directives":[],"loc":{"start":506,"end":516}},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"CARRIER","loc":{"start":519,"end":526}},"directives":[],"loc":{"start":519,"end":526}}],"loc":{"start":449,"end":528}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Ship","loc":{"start":535,"end":539}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"shipID","loc":{"start":544,"end":550}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID","loc":{"start":552,"end":554}},"loc":{"start":552,"end":554}},"loc":{"start":552,"end":555}},"directives":[],"loc":{"start":544,"end":555}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"type","loc":{"start":558,"end":562}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipClassName","loc":{"start":564,"end":577}},"loc":{"start":564,"end":577}},"loc":{"start":564,"end":578}},"directives":[],"loc":{"start":558,"end":578}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"size","loc":{"start":581,"end":585}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":587,"end":590}},"loc":{"start":587,"end":590}},"loc":{"start":587,"end":591}},"directives":[],"loc":{"start":581,"end":591}}],"loc":{"start":530,"end":593}},{"kind":"EnumTypeDefinition","name":{"kind":"Name","value":"ShipOrientation","loc":{"start":600,"end":615}},"directives":[],"values":[{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"VERTICAL","loc":{"start":620,"end":628}},"directives":[],"loc":{"start":620,"end":628}},{"kind":"EnumValueDefinition","name":{"kind":"Name","value":"HORIZONTAL","loc":{"start":631,"end":641}},"directives":[],"loc":{"start":631,"end":641}}],"loc":{"start":595,"end":643}},{"kind":"InputObjectTypeDefinition","name":{"kind":"Name","value":"ShipPlacement","loc":{"start":651,"end":664}},"directives":[],"fields":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"ship","loc":{"start":669,"end":673}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Ship","loc":{"start":675,"end":679}},"loc":{"start":675,"end":679}},"loc":{"start":675,"end":680}},"directives":[],"loc":{"start":669,"end":680}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"orientation","loc":{"start":683,"end":694}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ShipOrientation","loc":{"start":696,"end":711}},"loc":{"start":696,"end":711}},"loc":{"start":696,"end":712}},"directives":[],"loc":{"start":683,"end":712}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"x","loc":{"start":715,"end":716}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":718,"end":721}},"loc":{"start":718,"end":721}},"loc":{"start":718,"end":722}},"directives":[],"loc":{"start":715,"end":722}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"y","loc":{"start":725,"end":726}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":728,"end":731}},"loc":{"start":728,"end":731}},"loc":{"start":728,"end":732}},"directives":[],"loc":{"start":725,"end":732}}],"loc":{"start":645,"end":734}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"GameSettings","loc":{"start":741,"end":753}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"boardWidth","loc":{"start":758,"end":768}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":770,"end":773}},"loc":{"start":770,"end":773}},"loc":{"start":770,"end":774}},"directives":[],"loc":{"start":758,"end":774}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"boardHeight","loc":{"start":777,"end":788}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int","loc":{"start":790,"end":793}},"loc":{"start":790,"end":793}},"loc":{"start":790,"end":794}},"directives":[],"loc":{"start":777,"end":794}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"availableShips","loc":{"start":797,"end":811}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Ship","loc":{"start":814,"end":818}},"loc":{"start":814,"end":818}},"loc":{"start":814,"end":819}},"loc":{"start":813,"end":820}},"loc":{"start":813,"end":821}},"directives":[],"loc":{"start":797,"end":821}}],"loc":{"start":736,"end":823}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"GameRoomStatus","loc":{"start":830,"end":844}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"player1","loc":{"start":849,"end":856}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":858,"end":864}},"loc":{"start":858,"end":864}},"loc":{"start":858,"end":865}},"directives":[],"loc":{"start":849,"end":865}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"player2","loc":{"start":868,"end":875}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":877,"end":883}},"loc":{"start":877,"end":883}},"directives":[],"loc":{"start":868,"end":883}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"p1WSOpen","loc":{"start":886,"end":894}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean","loc":{"start":896,"end":903}},"loc":{"start":896,"end":903}},"loc":{"start":896,"end":904}},"directives":[],"loc":{"start":886,"end":904}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"p2WSOpen","loc":{"start":907,"end":915}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean","loc":{"start":917,"end":924}},"loc":{"start":917,"end":924}},"loc":{"start":917,"end":925}},"directives":[],"loc":{"start":907,"end":925}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"p1ShipsPlaced","loc":{"start":928,"end":941}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean","loc":{"start":943,"end":950}},"loc":{"start":943,"end":950}},"loc":{"start":943,"end":951}},"directives":[],"loc":{"start":928,"end":951}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"p2ShipsPlaced","loc":{"start":954,"end":967}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean","loc":{"start":969,"end":976}},"loc":{"start":969,"end":976}},"loc":{"start":969,"end":977}},"directives":[],"loc":{"start":954,"end":977}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"currentPlayer","loc":{"start":980,"end":993}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":995,"end":1001}},"loc":{"start":995,"end":1001}},"directives":[],"loc":{"start":980,"end":1001}}],"loc":{"start":825,"end":1003}},{"kind":"ObjectTypeExtension","name":{"kind":"Name","value":"Mutation","loc":{"start":1016,"end":1024}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"guestLogin","loc":{"start":1029,"end":1039}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username","loc":{"start":1040,"end":1048}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1050,"end":1056}},"loc":{"start":1050,"end":1056}},"directives":[],"loc":{"start":1040,"end":1056}}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginResult","loc":{"start":1059,"end":1070}},"loc":{"start":1059,"end":1070}},"directives":[],"loc":{"start":1029,"end":1070}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"registeredLogin","loc":{"start":1073,"end":1088}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username","loc":{"start":1089,"end":1097}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1099,"end":1105}},"loc":{"start":1099,"end":1105}},"loc":{"start":1099,"end":1106}},"directives":[],"loc":{"start":1089,"end":1106}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password","loc":{"start":1108,"end":1116}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1118,"end":1124}},"loc":{"start":1118,"end":1124}},"loc":{"start":1118,"end":1125}},"directives":[],"loc":{"start":1108,"end":1125}}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginResult","loc":{"start":1128,"end":1139}},"loc":{"start":1128,"end":1139}},"directives":[],"loc":{"start":1073,"end":1139}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"registerUser","loc":{"start":1142,"end":1154}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username","loc":{"start":1155,"end":1163}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1165,"end":1171}},"loc":{"start":1165,"end":1171}},"loc":{"start":1165,"end":1172}},"directives":[],"loc":{"start":1155,"end":1172}},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password","loc":{"start":1174,"end":1182}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1184,"end":1190}},"loc":{"start":1184,"end":1190}},"loc":{"start":1184,"end":1191}},"directives":[],"loc":{"start":1174,"end":1191}}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginResult","loc":{"start":1194,"end":1205}},"loc":{"start":1194,"end":1205}},"directives":[],"loc":{"start":1142,"end":1205}}],"loc":{"start":1004,"end":1207}},{"kind":"ObjectTypeExtension","name":{"kind":"Name","value":"Query","loc":{"start":1221,"end":1226}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"checkUsername","loc":{"start":1231,"end":1244}},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username","loc":{"start":1245,"end":1253}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1255,"end":1261}},"loc":{"start":1255,"end":1261}},"loc":{"start":1255,"end":1262}},"directives":[],"loc":{"start":1245,"end":1262}}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UsernameQueryResult","loc":{"start":1265,"end":1284}},"loc":{"start":1265,"end":1284}},"loc":{"start":1265,"end":1285}},"directives":[],"loc":{"start":1231,"end":1285}}],"loc":{"start":1209,"end":1287}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"LoginResult","loc":{"start":1294,"end":1305}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"username","loc":{"start":1310,"end":1318}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1320,"end":1326}},"loc":{"start":1320,"end":1326}},"loc":{"start":1320,"end":1327}},"directives":[],"loc":{"start":1310,"end":1327}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"accessToken","loc":{"start":1330,"end":1341}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1343,"end":1349}},"loc":{"start":1343,"end":1349}},"loc":{"start":1343,"end":1350}},"directives":[],"loc":{"start":1330,"end":1350}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"expiresAt","loc":{"start":1353,"end":1362}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1364,"end":1370}},"loc":{"start":1364,"end":1370}},"loc":{"start":1364,"end":1371}},"directives":[],"loc":{"start":1353,"end":1371}}],"loc":{"start":1289,"end":1373}},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"UsernameQueryResult","loc":{"start":1380,"end":1399}},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"username","loc":{"start":1404,"end":1412}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1414,"end":1420}},"loc":{"start":1414,"end":1420}},"loc":{"start":1414,"end":1421}},"directives":[],"loc":{"start":1404,"end":1421}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"taken","loc":{"start":1424,"end":1429}},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean","loc":{"start":1431,"end":1438}},"loc":{"start":1431,"end":1438}},"loc":{"start":1431,"end":1439}},"directives":[],"loc":{"start":1424,"end":1439}},{"kind":"FieldDefinition","name":{"kind":"Name","value":"validationError","loc":{"start":1442,"end":1457}},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String","loc":{"start":1459,"end":1465}},"loc":{"start":1459,"end":1465}},"directives":[],"loc":{"start":1442,"end":1465}}],"loc":{"start":1375,"end":1467}}],"loc":{"start":0,"end":1468}} as unknown as DocumentNode