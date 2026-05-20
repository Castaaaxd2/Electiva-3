export interface SpeciesInfo {
  commonName: string;
  scientificName: string;
  description: string;
  habitat: string;
  diet: string;
  conservationStatus: string;
}

// Dataset de las 32 especies estudiadas
export const SPECIES_DATA: Record<string, SpeciesInfo> = {
  "Canario costeño": {
    commonName: "Canario costeño",
    scientificName: "Sicalis flaveola",
    description:
      "El canario costeño es un pequeño pájaro de plumaje amarillo intenso en el macho y más opaco en la hembra. Es muy apreciado por su canto melodioso y suele verse en parejas o pequeños grupos. En cautiverio es popular como ave de jaula, aunque en estado silvestre habita espacios abiertos.",
    habitat: "Sabanas, pastizales, jardines y zonas agrícolas costeras",
    diet: "Semillas de gramíneas, frutas pequeñas e insectos ocasionales",
    conservationStatus: "Preocupación menor",
  },
  "Caracara plancus": {
    commonName: "Carancho",
    scientificName: "Caracara plancus",
    description:
      "El caracara plancus, también llamado carancho, es un ave rapaz de porte imponente con cabeza desnuda roja-anaranjada y cuerpo negro y blanco. Es omnívoro y oportunista, se alimenta tanto de carroña como de presas vivas. Se le ve frecuentemente caminando por el suelo en busca de alimento.",
    habitat: "Sabanas, llanuras abiertas, bordes de carretera y zonas rurales",
    diet: "Carroña, roedores, reptiles, insectos y residuos orgánicos",
    conservationStatus: "Preocupación menor",
  },
  "Carpinterito oliváceo": {
    commonName: "Carpinterito Oliváceo",
    scientificName: "Picumnus olivaceus",
    description:
      "El carpinterito oliváceo es uno de los carpinteros más pequeños de Latinoamérica, con un plumaje oliváceo en el dorso y un pecho barreado. A pesar de su tamaño diminuto, perfora la corteza de ramas delgadas con notable eficiencia. El macho presenta una pequeña mancha roja en la corona.",
    habitat: "Bosques tropicales húmedos, bordes de bosque y áreas arboladas",
    diet: "Larvas de insectos, hormigas, termitas y pequeñas arañas",
    conservationStatus: "Preocupación menor",
  },
  "Carpintero coronirrojo": {
    commonName: "Carpintero Coronirrojo",
    scientificName: "Melanerpes rubricapillus",
    description:
      "El carpintero coronirrojo es una especie llamativa con la corona de color rojo brillante, vientre amarillo y dorso barreado en negro y blanco. Es muy vocal y activo durante el día, golpeando troncos en busca de insectos. Es común en zonas urbanas con árboles y se adapta bien a la presencia humana.",
    habitat: "Bosques secos, jardines, parques urbanos y bordes de bosque",
    diet: "Insectos xilófagos, frutos, néctar y pequeños lagartijos",
    conservationStatus: "Preocupación menor",
  },
  "Centzontle tropical": {
    commonName: "Centzontle Tropical",
    scientificName: "Mimus gilvus",
    description:
      "El centzontle tropical, o sinsonte tropical, es famoso por su extraordinaria capacidad de imitar los cantos de otras aves. Su plumaje es gris parduzco con el vientre más claro y presenta franjas blancas en las alas. Es territorial y muy activo, cantando incluso de noche durante la época reproductiva.",
    habitat: "Sabanas, matorrales, jardines, bordes de bosque y zonas urbanas",
    diet: "Insectos, frutos, bayas y néctar",
    conservationStatus: "Preocupación menor",
  },
  Chulo: {
    commonName: "Chulo",
    scientificName: "Coragyps atratus",
    description:
      "El chulo, también conocido como gallinazo negro o zopilote, es un ave carroñera con plumaje completamente negro y cabeza desnuda grisácea. Cumple un papel ecológico fundamental al limpiar el ambiente de animales muertos, previniendo la propagación de enfermedades. Vuela en círculos amplios aprovechando las corrientes térmicas.",
    habitat:
      "Zonas abiertas, vertederos, bordes de carretera, zonas rurales y urbanas",
    diet: "Carroña, animales muertos y desechos orgánicos",
    conservationStatus: "Preocupación menor",
  },
  "Colibrí cola canela": {
    commonName: "Colibrí Cola Canela",
    scientificName: "Amazilia tzacatl",
    description:
      "El colibrí cola canela es uno de los colibríes más comunes de Colombia y América Central. Se distingue por su cola de color canela-rojizo y su garganta verde brillante iridiscente. Defiende agresivamente sus fuentes de néctar favoritas y es un polinizador esencial de muchas plantas tropicales.",
    habitat:
      "Jardines, bordes de bosque, plantaciones de café y áreas abiertas con flores",
    diet: "Néctar de flores y pequeños insectos para proteínas",
    conservationStatus: "Preocupación menor",
  },
  "Colibrí cola de raqueta": {
    commonName: "Colibrí Cola de Raqueta",
    scientificName: "Ocreatus underwoodii",
    description:
      "El colibrí cola de raqueta es uno de los más espectaculares por la larga cola bifurcada del macho que termina en dos discos negros con brillo violeta, similares a raquetas. El macho es de color verde esmeralda con garganta verde brillante. Es endémico de los Andes y símbolo de la biodiversidad colombiana.",
    habitat:
      "Bosques andinos húmedos, bordes de bosque y jardines entre 1000 y 2500 m de altitud",
    diet: "Néctar de flores andinas e insectos pequeños",
    conservationStatus: "Preocupación menor",
  },
  Copetón: {
    commonName: "Copetón",
    scientificName: "Zonotrichia capensis",
    description:
      "El copetón es quizás el pájaro más familiar de las ciudades andinas latinoamericanas. Se reconoce por su pequeño copete rayado en negro y castaño y su pecho con una banda oscura en garganta. Es extremadamente adaptable y vive cómodamente en parques, jardines y zonas con vegetación urbana.",
    habitat:
      "Parques, jardines, potreros, cultivos y zonas urbanas con vegetación",
    diet: "Semillas, insectos, restos de comida y frutas pequeñas",
    conservationStatus: "Preocupación menor",
  },
  "Cucarachero común": {
    commonName: "Cucarachero Común",
    scientificName: "Troglodytes aedon",
    description:
      "El cucarachero común es un ave diminuta de color pardo con la cola levantada característicamente. A pesar de su pequeño tamaño, posee un canto potente y variado que llena el ambiente. Es muy activo, se introduce entre matorrales y grietas buscando insectos con su pico fino y curvado.",
    habitat:
      "Matorrales, jardines, áreas con vegetación densa y bordes de bosque",
    diet: "Insectos, arañas, larvas y pequeños invertebrados",
    conservationStatus: "Preocupación menor",
  },
  "Eufonia piquigruesa": {
    commonName: "Eufonia Piquigruesa",
    scientificName: "Euphonia laniirostris",
    description:
      "La eufonia piquigruesa es un pequeño pájaro con el macho de color azul-violáceo intenso en el dorso y amarillo brillante en el vientre, mientras la hembra es más apagada en verde oliva. Su pico grueso y corto está adaptado para consumir frutos blandos. Su canto es suave y musical, compuesto de notas cortas.",
    habitat:
      "Bordes de bosque, jardines, zonas arboladas y cultivos con árboles frutales",
    diet: "Frutos blandos, bayas, muérdago y ocasionalmente insectos",
    conservationStatus: "Preocupación menor",
  },
  "Garza ganadera": {
    commonName: "Garza Ganadera",
    scientificName: "Bubulcus ibis",
    description:
      "La garza ganadera es una garza blanca de tamaño mediano que desarrolla plumaje nupcial anaranjado en cabeza, pecho y espalda. Es famosa por su estrecha relación con el ganado y otros animales grandes, aprovechando los insectos y otros pequeños animales que estos espantan al caminar. Ha expandido su distribución mundial en el último siglo.",
    habitat:
      "Potreros, pastizales con ganado, orillas de ríos y zonas agrícolas",
    diet: "Insectos, saltamontes, ranas, lagartijas y lombrices",
    conservationStatus: "Preocupación menor",
  },
  "Garza ganadera occidental": {
    commonName: "Garza Ganadera Occidental",
    scientificName: "Bubulcus ibis",
    description:
      "La garza ganadera occidental comparte muchas características con la garza ganadera, siendo una garza blanca compacta con pico amarillo y naranja. Es muy gregaria y forma grandes dormideros comunales. Durante la reproducción presenta coloraciones en tonos dorados en su plumaje nupcial que la hacen muy llamativa.",
    habitat: "Sabanas, potreros, humedales y zonas agrícolas abiertas",
    diet: "Insectos, anfibios, reptiles pequeños e invertebrados del suelo",
    conservationStatus: "Preocupación menor",
  },
  "Gavilan caminero": {
    commonName: "Gavilán Caminero",
    scientificName: "Rupornis magnirostris",
    description:
      "El gavilán caminero es uno de los rapaces más comunes y adaptables de América tropical. Su plumaje es pardo en el dorso con el pecho barreado en naranja y blanco. Es conocido por su canto agudo y repetitivo, y con frecuencia se le ve posado en alambres y postes a lo largo de carreteras.",
    habitat:
      "Bordes de bosque, sabanas, jardines, zonas rurales y orillas de carretera",
    diet: "Lagartijas, ranas, insectos grandes, ratones y aves pequeñas",
    conservationStatus: "Preocupación menor",
  },
  "Golondrina azul y blanco": {
    commonName: "Golondrina Azul y Blanco",
    scientificName: "Pygochelidon cyanoleuca",
    description:
      "La golondrina azul y blanco es una de las golondrinas más comunes de Sudamérica, con un llamativo dorso azul iridiscente y vientre completamente blanco. Vuela con gracia y velocidad capturando insectos en el aire. Anida en grietas de paredes, bajo techos y en acantilados, adaptándose bien a los ambientes urbanos.",
    habitat:
      "Ciudades, zonas rurales, orillas de ríos, lagunas y áreas abiertas",
    diet: "Insectos voladores capturados al vuelo",
    conservationStatus: "Preocupación menor",
  },
  "Golondrina yucateca": {
    commonName: "Golondrina Yucateca",
    scientificName: "Hirundo rustica",
    description:
      "La golondrina yucateca, conocida también como golondrina tijereta, presenta un plumaje azul acerado en el dorso y frente castaña con vientre blanquecino. Su cola profundamente bifurcada es su característica más distintiva. Es migratoria y recorre miles de kilómetros entre sus áreas de cría en el norte y sus cuarteles de invernada en el trópico.",
    habitat:
      "Zonas abiertas, campos agrícolas, ríos, lagunas y áreas urbanas durante la migración",
    diet: "Insectos voladores capturados en vuelo rasante",
    conservationStatus: "Preocupación menor",
  },
  "Loro cabeciazul": {
    commonName: "Loro Cabeciazul",
    scientificName: "Pionus menstruus",
    description:
      "El loro cabeciazul es un loro de tamaño mediano muy fácilmente identificable por su cabeza y cuello azul brillante y el resto del cuerpo verde. Es ruidoso y gregario, moviéndose en bandadas sobre el dosel del bosque. En áreas urbanas con árboles frutales puede observarse con relativa facilidad.",
    habitat: "Bosques tropicales, bordes de bosque, palmas y zonas arboladas",
    diet: "Frutos, semillas, flores, bayas y palmas",
    conservationStatus: "Preocupación menor",
  },
  "Luis bienteveo": {
    commonName: "Luis Bienteveo",
    scientificName: "Pitangus sulphuratus",
    description:
      "El bienteveo es uno de los pájaros más ruidosos y conocidos de América Latina, con su inconfundible grito que suena como '¡bien-te-veo!'. Presenta corona amarilla brillante oculta bajo un parche negro y blanco, y pecho amarillo vivo. Es muy territorial y agresivo, incluso atacando aves mucho más grandes.",
    habitat:
      "Bordes de bosque, jardines, parques, riberas y zonas urbanas arboladas",
    diet: "Insectos, lagartijas, ranas, frutos y peces pequeños",
    conservationStatus: "Preocupación menor",
  },
  "Mango gorjinegro": {
    commonName: "Mango Gorjinegro",
    scientificName: "Anthracothorax nigricollis",
    description:
      "El mango gorjinegro es un colibrí de tamaño mediano con el macho presentando garganta negra bordeada de verde-azul brillante y vientre verde oscuro. La hembra tiene el vientre blanco con una franja central negra. Visita una amplia variedad de flores y es uno de los colibríes más vistosos de las tierras bajas tropicales.",
    habitat:
      "Bordes de bosque, jardines, sabanas arboladas y zonas con heliconias",
    diet: "Néctar de flores tropicales e insectos pequeños",
    conservationStatus: "Preocupación menor",
  },
  "Mirla patinaranja": {
    commonName: "Mirla Patinaranja",
    scientificName: "Turdus fuscater",
    description:
      "La mirla patinaranja es un zorzal robusto con plumaje marrón oscuro uniforme, pico y anillo ocular amarillo-anaranjado y patas de color naranja que le dan su nombre. Es una de las aves más comunes en ciudades andinas y su melodioso canto matutino es familiar en parques y jardines. Se reproduce con frecuencia en jardines urbanos.",
    habitat: "Bosques andinos, parques, jardines y zonas urbanas arboladas",
    diet: "Lombrices, insectos, frutos y bayas",
    conservationStatus: "Preocupación menor",
  },
  "Paloma domestica": {
    commonName: "Paloma Doméstica",
    scientificName: "Columba livia",
    description:
      "La paloma doméstica es la especie de paloma más extendida del mundo, introducida en casi todos los continentes por el ser humano. Presenta una gran variabilidad de plumajes, desde el típico gris con irisaciones verdes y moradas en el cuello hasta formas completamente blancas o negras. Anida en estructuras urbanas y es muy dependiente del ser humano.",
    habitat: "Ciudades, plazas, puentes, edificios y zonas agrícolas",
    diet: "Semillas, cereales, restos de comida y residuos urbanos",
    conservationStatus: "Preocupación menor",
  },
  "Papamoscas rayado chico": {
    commonName: "Papamoscas Rayado Chico",
    scientificName: "Myioborus miniatus",
    description:
      "El papamoscas rayado chico, también llamado candelita gorrirroja, es un ave vistosa de los bosques montanos con el dorso gris pizarra y el vientre anaranjado-rojizo brillante. Es muy activo y despliega sus alas y cola mostrando manchas blancas mientras persigue insectos entre el follaje. Su comportamiento inquieto lo hace fácil de detectar.",
    habitat:
      "Bosques andinos húmedos, bordes de bosque montano entre 1000 y 3000 m",
    diet: "Insectos voladores e invertebrados pequeños capturados en el follaje",
    conservationStatus: "Preocupación menor",
  },
  "Perico carisucio": {
    commonName: "Perico Carisucio",
    scientificName: "Eupsittula pertinax",
    description:
      "El perico carisucio es un loro pequeño de color verde intenso con cara café-anaranjada que le da su nombre característico. Es muy sociable y bullicioso, volando en ruidosas bandadas sobre el dosel. Se adapta bien a ambientes perturbados y zonas urbanas con árboles frutales donde puede convertirse en plaga agrícola.",
    habitat:
      "Sabanas, bosques secos, zonas agrícolas, jardines y áreas urbanas",
    diet: "Frutos, semillas, flores y brotes de plantas cultivadas",
    conservationStatus: "Preocupación menor",
  },
  "Rascón chiricote": {
    commonName: "Rascón Chiricote",
    scientificName: "Aramides cajaneus",
    description:
      "El rascón chiricote es un ave de humedales de cuerpo robusto, cuello y cabeza grises, pecho canela y pico amarillo con base roja. Es más fácil de escuchar que de ver, ya que prefiere caminar entre la vegetación densa emitiendo llamados fuertes y repetitivos. Camina con movimientos característicos de cabeza mientras busca alimento.",
    habitat:
      "Manglares, bosques de galería, pantanos, arrozales y orillas de ríos con vegetación densa",
    diet: "Insectos acuáticos, cangrejos, ranas, semillas y materia vegetal",
    conservationStatus: "Preocupación menor",
  },
  "Semillero común": {
    commonName: "Semillero Común",
    scientificName: "Sporophila intermedia",
    description:
      "El semillero común es un pequeño pájaro granívoro con el macho de color gris en el dorso y blanco en el vientre, y la hembra de tonos pardos apagados. Su pico corto y robusto está perfectamente adaptado para descascarar semillas. Forma bandadas mixtas en pastizales y es muy apreciado como ave de canto en algunas regiones.",
    habitat:
      "Pastizales, matorrales, bordes de cultivos, potreros y zonas abiertas",
    diet: "Semillas de gramíneas y hierbas, ocasionalmente insectos",
    conservationStatus: "Preocupación menor",
  },
  "Tangara azulegris": {
    commonName: "Tangara Azulegris",
    scientificName: "Thraupis episcopus",
    description:
      "La tangara azulegris es una de las tangaras más comunes y extendidas de América tropical. Su plumaje es azul-grisáceo con las cobertoras alares de un azul más brillante que resaltan en vuelo. Es muy adaptable, frecuenta jardines y parques urbanos y suele verse en parejas. Tolera bien la perturbación del hábitat.",
    habitat:
      "Bordes de bosque, jardines, parques, zonas arboladas urbanas y plantaciones",
    diet: "Frutos, bayas, néctar e insectos ocasionales",
    conservationStatus: "Preocupación menor",
  },
  "Tangara dorada": {
    commonName: "Tangara Dorada",
    scientificName: "Tangara arthus",
    description:
      "La tangara dorada es una de las aves más bellas de los Andes, con un plumaje dorado brillante contrastado con negro en el dorso, alas y cola. Frecuenta el dosel de bosques montanos y bordes de bosque donde se alimenta de frutos y muérdago. Suele observarse en parejas o grupos pequeños en la copa de los árboles.",
    habitat:
      "Bosques andinos húmedos y bordes de bosque entre 900 y 2200 m de altitud",
    diet: "Frutos, bayas, muérdago e insectos",
    conservationStatus: "Preocupación menor",
  },
  "Tirano pirirí": {
    commonName: "Tirano Pirirí",
    scientificName: "Tyrannus melancholicus",
    description:
      "El tirano pirirí es el tirano tropical más común y reconocible, con gorro gris, dorso oliváceo, alas pardas y vientre amarillo brillante. Su canto ruidoso y repetitivo, que suena como 'pi-ri-rí', es omnipresente en zonas abiertas tropicales. Es un cazador de insectos en vuelo muy eficiente y territorial durante la cría.",
    habitat:
      "Zonas abiertas, bordes de bosque, orillas de ríos, parques y jardines",
    diet: "Insectos capturados en vuelo, frutos y bayas",
    conservationStatus: "Preocupación menor",
  },
  "Tordo negro": {
    commonName: "Tordo Negro",
    scientificName: "Dives dives",
    description:
      "El tordo negro es un ave completamente negra con reflejos metálicos, pico fuerte y ojos oscuros. Es omnívoro y gregario, formando grandes bandadas en zonas agrícolas donde puede causar daños a cultivos. Su canto es sorprendentemente variado y melodioso para ser un tordo. Los machos cantan frecuentemente desde posaderos elevados.",
    habitat:
      "Zonas agrícolas, potreros, bordes de bosque, jardines y áreas urbanas",
    diet: "Insectos, semillas, frutos, granos y restos de comida",
    conservationStatus: "Preocupación menor",
  },
  "Tortolita común": {
    commonName: "Tortolita Común",
    scientificName: "Columbina talpacoti",
    description:
      "La tortolita común es una de las palomas más pequeñas y abundantes de América tropical. El macho tiene plumaje rojizo-anaranjado con alas punteadas de negro, mientras la hembra es más apagada en tonos pardos. Camina por el suelo buscando semillas y suele verse en parejas. Su arrullo suave y repetitivo es un sonido característico del campo.",
    habitat:
      "Pastizales, potreros, jardines, cultivos y zonas abiertas con vegetación baja",
    diet: "Semillas de gramíneas, hierbas pequeñas y granos caídos",
    conservationStatus: "Preocupación menor",
  },
  "Vireón cejas canela": {
    commonName: "Vireón Cejas Canela",
    scientificName: "Cyclarhis gujanensis",
    description:
      "El vireón cejas canela, o vireón pechirrufo, es inconfundible por sus cejas de color canela-anaranjado, corona gris, dorso verde y pecho rojizo-canela. Tiene un pico robusto y ganchudo similar al de los alcaudones. Su canto es una de las melodías más constantes y características de los bordes de bosque latinoamericanos.",
    habitat:
      "Bordes de bosque, jardines, zonas arboladas y bosques secundarios",
    diet: "Insectos grandes, larvas, arañas y ocasionalmente frutos",
    conservationStatus: "Preocupación menor",
  },
  "Zorzal sabiá": {
    commonName: "Zorzal Sabiá",
    scientificName: "Turdus leucomelas",
    description:
      "El zorzal sabiá es un zorzal robusto con dorso pardo oliva, garganta con estrías pardas sobre fondo blanco y pecho lavado de ocre. Es muy apreciado en algunas regiones por su melodioso canto, que incluye improvisaciones y frases musicales complejas. Busca alimento en el suelo revolviendo la hojarasca con el pico.",
    habitat:
      "Bosques secundarios, bordes de bosque, jardines y zonas arboladas",
    diet: "Lombrices, insectos, frutos y bayas",
    conservationStatus: "Preocupación menor",
  },
};

// Normaliza el nombre de la especie para buscarlo en el dataset
export function lookupSpecies(name: string): SpeciesInfo | undefined {
  if (!name) return undefined;
  const key = name.toLowerCase().trim();
  // Búsqueda exacta primero
  if (SPECIES_DATA[key]) return SPECIES_DATA[key];
  // Búsqueda parcial
  const found = Object.keys(SPECIES_DATA).find(
    (k) => k.includes(key) || key.includes(k),
  );
  return found ? SPECIES_DATA[found] : undefined;
}

export const SPECIES_NAMES = Object.values(SPECIES_DATA).map(
  (s) => s.commonName,
);
