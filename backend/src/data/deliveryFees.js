
export const DELIVERY_FEES = {
  "01": { bureau: 1000, domicile: 1600 }, // Adrar
  "02": { bureau: 400, domicile: 800 },   // Chlef
  "03": { bureau: 600, domicile: 1100 },  // Laghouat
  "04": { bureau: 400, domicile: 950 },   // Oum El Bouaghi
  "05": { bureau: 400, domicile: 950 },   // Batna
  "06": { bureau: 400, domicile: 850 },   // Béjaïa
  "07": { bureau: 600, domicile: 1100 },  // Biskra
  "08": { bureau: 750, domicile: 1400 },  // Béchar
  "09": { bureau: 400, domicile: 800 },   // Blida
  "10": { bureau: 400, domicile: 850 },   // Bouira
  "11": { bureau: 1000, domicile: 1800 }, // Tamanrasset
  "12": { bureau: 600, domicile: 1100 },  // Tébessa
  "13": { bureau: 400, domicile: 850 },   // Tlemcen
  "14": { bureau: 400, domicile: 850 },   // Tiaret
  "15": { bureau: 400, domicile: 850 },   // Tizi Ouzou
  "16": { bureau: 400, domicile: 750 },   // Alger
  "17": { bureau: 600, domicile: 1100 },  // Djelfa
  "18": { bureau: 400, domicile: 950 },   // Jijel
  "19": { bureau: 400, domicile: 900 },   // Sétif
  "20": { bureau: 400, domicile: 850 },   // Saïda
  "21": { bureau: 400, domicile: 950 },   // Skikda
  "22": { bureau: 400, domicile: 850 },   // Sidi Bel Abbès
  "23": { bureau: 400, domicile: 900 },   // Annaba
  "24": { bureau: 400, domicile: 950 },   // Guelma
  "25": { bureau: 400, domicile: 900 },   // Constantine
  "26": { bureau: 400, domicile: 850 },   // Médéa
  "27": { bureau: 400, domicile: 800 },   // Mostaganem
  "28": { bureau: 400, domicile: 900 },   // M'Sila
  "29": { bureau: 400, domicile: 850 },   // Mascara
  "30": { bureau: 700, domicile: 1200 },  // Ouargla
  "31": { bureau: 400, domicile: 700 },   // Oran
  "32": { bureau: 400, domicile: 900 },   // El Bayadh
  "33": { bureau: 1200, domicile: 1800 }, // Illizi
  "34": { bureau: 400, domicile: 900 },   // Bordj Bou Arréridj
  "35": { bureau: 400, domicile: 850 },   // Boumerdès
  "36": { bureau: 400, domicile: 1000 },  // El Tarf
  "37": { bureau: 1200, domicile: 1800 }, // Tindouf
  "38": { bureau: 400, domicile: 850 },   // Tissemsilt
  "39": { bureau: 750, domicile: 1200 },  // El Oued
  "40": { bureau: 500, domicile: 1000 },  // Khenchela
  "41": { bureau: 600, domicile: 1000 },  // Souk Ahras
  "42": { bureau: 400, domicile: 850 },   // Tipaza
  "43": { bureau: 400, domicile: 950 },   // Mila
  "44": { bureau: 400, domicile: 850 },   // Aïn Defla
  "45": { bureau: 700, domicile: 1200 },  // Naâma
  "46": { bureau: 400, domicile: 850 },   // Aïn Témouchent
  "47": { bureau: 750, domicile: 1200 },  // Ghardaïa
  "48": { bureau: 400, domicile: 800 },   // Relizane
  "49": { bureau: 900, domicile: 1500 },  // Timimoun
  "50": { bureau: 900, domicile: 1500 },  // Bordj Badji Mokhtar
  "51": { bureau: 700, domicile: 1200 },  // Ouled Djellal
  "52": { bureau: 900, domicile: 1500 },  // Béni Abbès
  "53": { bureau: 900, domicile: 1500 },  // In Salah
  "54": { bureau: 1000, domicile: 1700 }, // In Guezzam
  "55": { bureau: 750, domicile: 1200 },  // Touggourt
  "56": { bureau: 1200, domicile: 1800 }, // Djanet
  "57": { bureau: 750, domicile: 1200 },  // El M'Ghair
  "58": { bureau: 750, domicile: 1200 },  // El Meniaa
  "59": { bureau: 600, domicile: 1100 },  // Aflou (mère : Laghouat)
  "60": { bureau: 400, domicile: 950 },   // Barika (mère : Batna)
  "61": { bureau: 600, domicile: 1100 },  // El Kantara (mère : Biskra)
  "62": { bureau: 600, domicile: 1100 },  // Bir El Ater (mère : Tébessa)
  "63": { bureau: 400, domicile: 850 },   // El Aricha (mère : Tlemcen)
  "64": { bureau: 400, domicile: 850 },   // Ksar Chellala (mère : Tiaret)
  "65": { bureau: 600, domicile: 1100 },  // Aïn Oussara (mère : Djelfa)
  "66": { bureau: 600, domicile: 1100 },  // Messaad (mère : Djelfa)
  "67": { bureau: 400, domicile: 850 },   // Ksar El Boukhari (mère : Médéa)
  "68": { bureau: 400, domicile: 900 },   // Bou Saâda (mère : M'Sila)
  "69": { bureau: 400, domicile: 900 },   // El Abiodh Sidi Cheikh (mère : El Bayadh)
};

export const DEFAULT_DELIVERY_FEE = { bureau: 700, domicile: 1200 };

export function getDeliveryFee(wilayaCode, deliveryType) {
  const fees = DELIVERY_FEES[wilayaCode] || DEFAULT_DELIVERY_FEE;
  return deliveryType === "bureau" ? fees.bureau : fees.domicile;
}