/**
 * COMPANY MERGES — duplicate records folded into one.
 *
 * The source sheets cut company names at the column width, so the same
 * company arrives several times: "ADNOC Logistics and Service" beside
 * "ADNOC Logistics and Services", "ASTRO OFFSHORE PT" beside "Astro
 * Offshore". Each key here is a record that is the same company as its
 * value, and the value is the record the platform keeps.
 *
 * This is a hand-authored overlay, like data/company-details.ts: it sits
 * beside the bulk import rather than inside it, so re-importing the company
 * sheet cannot quietly undo the grouping.
 *
 * Nothing is deleted. A folded record's vessels, fixtures and URL all move
 * to the record it joined — opening an old link still lands on the company,
 * and its former names are listed on the profile.
 *
 * Only three kinds of evidence were acted on, because filing a vessel under
 * a company that does not own it is worse than leaving two records:
 *
 *   the longer name continues the shorter one's last word
 *     "Alam Maritim" -> "Alam Maritime"
 *   the longer name adds only complete legal form words
 *     "Geonavegacao" -> "Geonavegacao SAS"
 *   the longer name adds only a one or two letter tail, which is a legal
 *     form that lost its own ending, so the longer name is the cut one
 *     "Centus Marine L" -> "Centus Marine"
 *
 * A name that two different longer names could continue was left alone, and
 * a record carrying a written profile is never folded away.
 */
export const COMPANY_MERGES: Record<string, string> = {
  // Abed Marine Service -> ABED MARINE SERVICES  (midword)
  'abed-marine-service': 'abed-marine-services',
  // Abnegar Seid Khalij F -> Abnegar Seid Khalij Fars Co  (midword)
  'abnegar-seid-khalij-f': 'abnegar-seid-khalij-fars-co',
  // Abu Qurrah Shipping IE -> Abu Qurrah Shipping  (stub)
  'abu-qurrah-shipping-ie': 'abu-qurrah-shipping',
  // Adani Ports and Special Economic Zone Ld -> Adani Ports and Special Economic Zone  (stub)
  'adani-ports-and-special-economic-zone-ld': 'adani-ports-and-special-economic-zone',
  // ADNOC Logistics and Service -> ADNOC Logistics and Services  (midword)
  'adnoc-logistics-and-service': 'adnoc-logistics-and-services',
  // Aegean Shipping Ma -> Aegean Shipping  (stub)
  'aegean-shipping-ma': 'aegean-shipping',
  // AJANG SHIPPING SD -> Ajang Shipping  (stub)
  'ajang-shipping-sd': 'ajang-shipping',
  // Akron Trade and Tra -> Akron Trade and Transport  (midword)
  'akron-trade-and-tra': 'akron-trade-and-transport',
  // Alam Maritim -> Alam Maritime  (midword)
  'alam-maritim': 'alam-maritime',
  // Alliance Offshore Dril -> Alliance Offshore Drilling  (midword)
  'alliance-offshore-dril': 'alliance-offshore-drilling',
  // ALTHEA SHIPTRADE L -> Althea Shiptrade  (stub)
  'althea-shiptrade-l': 'althea-shiptrade',
  // Amaniaga Resources B -> Amaniaga Resources  (stub)
  'amaniaga-resources-b': 'amaniaga-resources',
  // Amba Shipping Log -> Amba Shipping Logistics  (midword)
  'amba-shipping-log': 'amba-shipping-logistics',
  // Amber Offshore Sp Z -> Amber Offshore Sp Zoo  (midword)
  'amber-offshore-sp-z': 'amber-offshore-sp-zoo',
  // Antwerp Water Service -> Antwerp Water Services  (midword)
  'antwerp-water-service': 'antwerp-water-services',
  // APREALA MARINE SE -> APREALA MARINE SERVICES  (midword)
  'apreala-marine-se': 'apreala-marine-services',
  // Aquashield Oil and Marine Serv -> Aquashield Oil and Marine Services  (midword)
  'aquashield-oil-and-marine-serv': 'aquashield-oil-and-marine-services',
  // Aquatic Blue Environ -> Aquatic Blue Environmental  (midword)
  'aquatic-blue-environ': 'aquatic-blue-environmental',
  // Arab Petroleum Pipel -> Arab Petroleum Pipelines  (midword)
  'arab-petroleum-pipel': 'arab-petroleum-pipelines',
  // Arena Denizcilik Ters -> Arena Denizcilik Tersanecilik  (midword)
  'arena-denizcilik-ters': 'arena-denizcilik-tersanecilik',
  // ARGENTINA GOVT N -> ARGENTINA GOVT  (stub)
  'argentina-govt-n': 'argentina-govt',
  // Arktikmor Neftegaz R -> Arktikmor Neftegaz Razvedka  (midword)
  'arktikmor-neftegaz-r': 'arktikmor-neftegaz-razvedka',
  // Armamex Naviera SA de CV -> Armamex Naviera SA  (stub)
  'armamex-naviera-sa-de-cv': 'armamex-naviera-sa',
  // ASIAN SALVAGE TO -> ASIAN SALVAGE  (stub)
  'asian-salvage-to': 'asian-salvage',
  // Asian Spirit Steams -> Asian Spirit Steamship Co  (midword)
  'asian-spirit-steams': 'asian-spirit-steamship-co',
  // Asset Management C -> Asset Management Corporation of Nigeria  (midword)
  'asset-management-c': 'asset-management-corporation-of-nigeria',
  // Associated Marine Se -> Associated Marine Services  (midword)
  'associated-marine-se': 'associated-marine-services',
  // ASTRO OFFSHORE PT -> Astro Offshore  (stub)
  'astro-offshore-pt': 'astro-offshore',
  // Astromaritima -> Astromaritima Navegação S.A.  (legal-form)
  'astromaritima': 'astromaritima-navegacao-s-a',
  // ASTROMARITIMA NA -> Astromaritima Navegação S.A.  (midword)
  'astromaritima-na': 'astromaritima-navegacao-s-a',
  // ATLANTIC OCEANIC L -> Atlantic Oceanic  (stub)
  'atlantic-oceanic-l': 'atlantic-oceanic',
  // Atlantik Gemi Isletme -> Atlantik Gemi Isletmeciligi  (midword)
  'atlantik-gemi-isletme': 'atlantik-gemi-isletmeciligi',
  // Automac Multiresour -> Automac Multiresources Sdn Bhd  (midword)
  'automac-multiresour': 'automac-multiresources-sdn-bhd',
  // Awak Samudera Tran -> Awak Samudera Transportasi  (midword)
  'awak-samudera-tran': 'awak-samudera-transportasi',
  // Azerbaijan Caspian -> Azerbaijan CaspianS  (midword)
  'azerbaijan-caspian': 'azerbaijan-caspians',
  // Azerbaijan Governm -> Azerbaijan Government  (midword)
  'azerbaijan-governm': 'azerbaijan-government',
  // Bahari Semesta Intili -> Bahari Semesta Intiline PT  (midword)
  'bahari-semesta-intili': 'bahari-semesta-intiline-pt',
  // Bahregan Marine Service -> Bahregan Marine Services  (midword)
  'bahregan-marine-service': 'bahregan-marine-services',
  // Bahtera Alam Sejahte -> Bahtera Alam Sejahtera  (midword)
  'bahtera-alam-sejahte': 'bahtera-alam-sejahtera',
  // Bangladesh Governm -> Bangladesh Government  (midword)
  'bangladesh-governm': 'bangladesh-government',
  // Bangladesh Inland W -> Bangladesh Inland Water Transport Corporation  (midword)
  'bangladesh-inland-w': 'bangladesh-inland-water-transport-corporation',
  // Bayu Maritim Berkah PT -> Bayu Maritim Berkah  (stub)
  'bayu-maritim-berkah-pt': 'bayu-maritim-berkah',
  // Belait Shipping Co B -> Belait Shipping Co  (stub)
  'belait-shipping-co-b': 'belait-shipping-co',
  // Berk Dagdan Individu -> Berk Dagdan Individual Enterprise  (midword)
  'berk-dagdan-individu': 'berk-dagdan-individual-enterprise',
  // BHAGWAN MARINE P -> BHAGWAN MARINE  (stub)
  'bhagwan-marine-p': 'bhagwan-marine',
  // BINA BUANA RAYA PT -> Bina Buana Raya  (stub)
  'bina-buana-raya-pt': 'bina-buana-raya',
  // BISMARK MARITIME L -> Bismark Maritime  (stub)
  'bismark-maritime-l': 'bismark-maritime',
  // Blue Ocean Ship MG -> Blue Ocean Ship MGMT & ENG  (midword)
  'blue-ocean-ship-mg': 'blue-ocean-ship-mgmt-eng',
  // Blue Sea Maritime an -> Blue Sea Maritime and Trading  (midword)
  'blue-sea-maritime-an': 'blue-sea-maritime-and-trading',
  // Bourbon Offshore N -> Bourbon Offshore Norway  (midword)
  'bourbon-offshore-n': 'bourbon-offshore-norway',
  // Bricks Mursten Matto -> Bricks Mursten Mattoni  (midword)
  'bricks-mursten-matto': 'bricks-mursten-mattoni',
  // Bufete de Mantenimi -> Bufete de Mantenimiento Predictivo Industrial  (midword)
  'bufete-de-mantenimi': 'bufete-de-mantenimiento-predictivo-industrial',
  // Bumi Jaya Salvage an -> Bumi Jaya Salvage and Engineering  (midword)
  'bumi-jaya-salvage-an': 'bumi-jaya-salvage-and-engineering',
  // BYWATER LUDLOW L -> Bywater Ludlow  (stub)
  'bywater-ludlow-l': 'bywater-ludlow',
  // Cable Maintenance O -> Cable Maintenance Offshore  (midword)
  'cable-maintenance-o': 'cable-maintenance-offshore',
  // Canadian Natural Re -> Canadian Natural Resources  (midword)
  'canadian-natural-re': 'canadian-natural-resources',
  // Canadian Subsea Shi -> Canadian Subsea Shipping  (midword)
  'canadian-subsea-shi': 'canadian-subsea-shipping',
  // Capitol Nusantara In -> Capitol Nusantara Indonesia  (midword)
  'capitol-nusantara-in': 'capitol-nusantara-indonesia',
  // Carimin Petroleum B -> Carimin Petroleum Berhad  (midword)
  'carimin-petroleum-b': 'carimin-petroleum-berhad',
  // CARINA OFFSHORE L -> Carina Offshore  (stub)
  'carina-offshore-l': 'carina-offshore',
  // CCC (Underwater Engineering) S.A.L -> CCC Underwater Engineering  (stub)
  'ccc-underwater-engineering-s-a-l': 'ccc-underwater-engineering',
  // Central De Desarrollo -> Central De Desarrollos Marinos  (midword)
  'central-de-desarrollo': 'central-de-desarrollos-marinos',
  // CENTRAL SHIPPING PT -> Central Shipping  (stub)
  'central-shipping-pt': 'central-shipping',
  // Centus Marine L -> Centus Marine  (stub)
  'centus-marine-l': 'centus-marine',
  // Chandra Ship Manag -> Chandra Ship Management  (midword)
  'chandra-ship-manag': 'chandra-ship-management',
  // CHINA OFFSHORE EN -> CHINA OFFSHORE ENGINEERING  (midword)
  'china-offshore-en': 'china-offshore-engineering',
  // CHORNOMORNAFTO -> Chornomornaftogaz  (midword)
  'chornomornafto': 'chornomornaftogaz',
  // CNOOC ENERGY TEC -> CNOOC Energy Technology & Services  (midword)
  'cnooc-energy-tec': 'cnooc-energy-technology-services',
  // Coastland Energy Log -> Coastland Energy Logistics  (midword)
  'coastland-energy-log': 'coastland-energy-logistics',
  // Colonial Marine Cons -> Colonial Marine Consultants  (midword)
  'colonial-marine-cons': 'colonial-marine-consultants',
  // Comercializadora Pet -> Comercializadora Petro  (midword)
  'comercializadora-pet': 'comercializadora-petro',
  // Commercial Rib Char -> Commercial Rib Charter  (midword)
  'commercial-rib-char': 'commercial-rib-charter',
  // Conciencia Ambienta -> Conciencia Ambiental SRL  (midword)
  'conciencia-ambienta': 'conciencia-ambiental-srl',
  // Consultoria y Servicio -> Consultoria y Servicios Petroleros  (midword)
  'consultoria-y-servicio': 'consultoria-y-servicios-petroleros',
  // Coral Sea Shipping Li -> Coral Sea Shipping Lines  (midword)
  'coral-sea-shipping-li': 'coral-sea-shipping-lines',
  // COSL Drilling Pan-Pac -> COSL Drilling Pan-Pacific  (midword)
  'cosl-drilling-pan-pac': 'cosl-drilling-pan-pacific',
  // CRAFT OFFSHORE IN -> Craft Offshore  (stub)
  'craft-offshore-in': 'craft-offshore',
  // CROSBY MARINE TRA -> CROSBY MARINE TRANSPORTATION  (midword)
  'crosby-marine-tra': 'crosby-marine-transportation',
  // DANG DEVELOPMEN -> DANG DEVELOPMENT  (midword)
  'dang-developmen': 'dang-development',
  // Dar Alkhayam Gener -> Dar Alkhayam General Trading  (midword)
  'dar-alkhayam-gener': 'dar-alkhayam-general-trading',
  // Delmar Marine Trans -> Delmar Marine Transport  (midword)
  'delmar-marine-trans': 'delmar-marine-transport',
  // DEMAR INSTALADOR -> Demar instaladora Y Constructora  (midword)
  'demar-instalador': 'demar-instaladora-y-constructora',
  // DEME OFFSHORE DK -> DEME Offshore  (stub)
  'deme-offshore-dk': 'deme-offshore',
  // Department of Port A -> Department of Port Administration American Samoa  (midword)
  'department-of-port-a': 'department-of-port-administration-american-samoa',
  // Det Norske Oljeselsk -> Det Norske Oljeselskap ASA  (midword)
  'det-norske-oljeselsk': 'det-norske-oljeselskap-asa',
  // Diaplous Maritime Se -> Diaplous Maritime Services  (midword)
  'diaplous-maritime-se': 'diaplous-maritime-services',
  // Dineshchandra R Agr -> Dineshchandra R Agrawal infracon  (midword)
  'dineshchandra-r-agr': 'dineshchandra-r-agrawal-infracon',
  // Dipmar Gemi Kurtar -> Dipmar Gemi Kurtarma  (midword)
  'dipmar-gemi-kurtar': 'dipmar-gemi-kurtarma',
  // Edeis Ports Saint Mal -> Edeis Ports Saint Malo Cancale  (midword)
  'edeis-ports-saint-mal': 'edeis-ports-saint-malo-cancale',
  // Eka Nusantara Line PT -> Eka Nusantara Line  (stub)
  'eka-nusantara-line-pt': 'eka-nusantara-line',
  // ELECTRA MARITIME L -> Electra Maritime  (stub)
  'electra-maritime-l': 'electra-maritime',
  // ELPI TRANS CARGO PT -> ELPI Trans Cargo  (stub)
  'elpi-trans-cargo-pt': 'elpi-trans-cargo',
  // ELSHCON NIGERIA LTD BB -> ELSHCON NIGERIA LTD  (stub)
  'elshcon-nigeria-ltd-bb': 'elshcon-nigeria-ltd',
  // Empresa de Navegaci -> Empresa de Navegacion Caribe  (midword)
  'empresa-de-navegaci': 'empresa-de-navegacion-caribe',
  // ENSCO DEEPWATER L -> ENSCO DEEPWATER  (stub)
  'ensco-deepwater-l': 'ensco-deepwater',
  // Enterprise Shipping SA de CV -> Enterprise Shipping  (stub)
  'enterprise-shipping-sa-de-cv': 'enterprise-shipping',
  // ENTRONS SINGAPOR -> ENTRONS SINGAPORE  (midword)
  'entrons-singapor': 'entrons-singapore',
  // Equinox Offshore Acc -> Equinox Offshore Accommodation  (midword)
  'equinox-offshore-acc': 'equinox-offshore-accommodation',
  // Erzoff-Shore SL -> Erzoff-Shore  (stub)
  'erzoff-shore-sl': 'erzoff-shore',
  // Estaleiro TCE -> ESTALEIRO TCE LTDA  (legal-form)
  'estaleiro-tce': 'estaleiro-tce-ltda',
  // Etopo Control Service -> Etopo Control Services  (midword)
  'etopo-control-service': 'etopo-control-services',
  // Exportadora De Sal S -> Exportadora De Sal Sa De Cv  (midword)
  'exportadora-de-sal-s': 'exportadora-de-sal-sa-de-cv',
  // FALCON GLOBAL OFF -> FALCON GLOBAL OFFSHORE  (midword)
  'falcon-global-off': 'falcon-global-offshore',
  // Farsund Fortoyningss -> Farsund Fortoyningsselskap A  (midword)
  'farsund-fortoyningss': 'farsund-fortoyningsselskap-a',
  // FATIH ROMORKORCU -> Fatih Romorkorculuk  (midword)
  'fatih-romorkorcu': 'fatih-romorkorculuk',
  // Finnish Sea Service -> Finnish Sea Services  (midword)
  'finnish-sea-service': 'finnish-sea-services',
  // Flexam Invest -> Flexam Investment  (midword)
  'flexam-invest': 'flexam-investment',
  // FOLTOKS ENERGY RE -> FOLTOKS ENERGY RESOURCES LTD  (midword)
  'foltoks-energy-re': 'foltoks-energy-resources-ltd',
  // Fortescue Future Ind -> Fortescue Future Industries  (midword)
  'fortescue-future-ind': 'fortescue-future-industries',
  // FPSO Ventures Sdn B -> FPSO Ventures Sdn  (stub)
  'fpso-ventures-sdn-b': 'fpso-ventures-sdn',
  // Fred Olsen Windcarrie -> Fred Olsen Windcarrier  (midword)
  'fred-olsen-windcarrie': 'fred-olsen-windcarrier',
  // Galaxie Marine Service -> Galaxie Marine Services  (midword)
  'galaxie-marine-service': 'galaxie-marine-services',
  // Galliano Marine Service -> Galliano Marine Services  (midword)
  'galliano-marine-service': 'galliano-marine-services',
  // GANZ Danubius Float -> GANZ Danubius Floatingcrane  (midword)
  'ganz-danubius-float': 'ganz-danubius-floatingcrane',
  // Geonavegacao -> Geonavegacao SAS  (legal-form)
  'geonavegacao': 'geonavegacao-sas',
  // GeoView Co Ltd oo -> GeoView Co Ltd  (stub)
  'geoview-co-ltd-oo': 'geoview-co-ltd',
  // Ghana Ports and Har -> Ghana Ports and Harbours Authority  (midword)
  'ghana-ports-and-har': 'ghana-ports-and-harbours-authority',
  // Global Link Ocean Str -> Global Link Ocean Streams  (midword)
  'global-link-ocean-str': 'global-link-ocean-streams',
  // Global Sea Mineral R -> Global Sea Mineral Resources  (midword)
  'global-sea-mineral-r': 'global-sea-mineral-resources',
  // Glomar Shipmanagement B.V. -> Glomar Shipmanagement  (stub)
  'glomar-shipmanagement-b-v': 'glomar-shipmanagement',
  // Gloria Shipping S de RL de CV -> Gloria Shipping  (stub)
  'gloria-shipping-s-de-rl-de-cv': 'gloria-shipping',
  // Goldwind Offshore E -> Goldwind Offshore Engineering  (midword)
  'goldwind-offshore-e': 'goldwind-offshore-engineering',
  // GOMES DA SILVA JC -> Gomes da Silva  (stub)
  'gomes-da-silva-jc': 'gomes-da-silva',
  // Grandi Lavori Fincosi -> Grandi Lavori Fincosit SpA  (midword)
  'grandi-lavori-fincosi': 'grandi-lavori-fincosit-spa',
  // Granenergia Navegac -> Granenergia Navegaceo  (midword)
  'granenergia-navegac': 'granenergia-navegaceo',
  // Grupo Suardia -> Grupo Suardiaz  (midword)
  'grupo-suardia': 'grupo-suardiaz',
  // GUANABARA NAVEG -> Guanabara Navegacao  (midword)
  'guanabara-naveg': 'guanabara-navegacao',
  // Gulf Fleet Manageme -> Gulf Fleet Management  (midword)
  'gulf-fleet-manageme': 'gulf-fleet-management',
  // Gulf Marine Service -> Gulf Marine Services  (midword)
  'gulf-marine-service': 'gulf-marine-services',
  // Hafar Capitol Nusant -> Hafar Capitol Nusantara  (midword)
  'hafar-capitol-nusant': 'hafar-capitol-nusantara',
  // HAIRUN MARINE HK -> Hairun Marine  (stub)
  'hairun-marine-hk': 'hairun-marine',
  // HALUL OFFSHORE SE -> Halul Offshore  (stub)
  'halul-offshore-se': 'halul-offshore',
  // HANWHA OCEAN CO K -> HANWHA OCEAN CO  (stub)
  'hanwha-ocean-co-k': 'hanwha-ocean-co',
  // HARPS HOLDINGS PT -> Harps Holdings  (stub)
  'harps-holdings-pt': 'harps-holdings',
  // Hebo Maritiem Service -> Hebo Maritiem Services  (midword)
  'hebo-maritiem-service': 'hebo-maritiem-services',
  // Hengtong Ocean Eng -> Hengtong Ocean Engineering  (midword)
  'hengtong-ocean-eng': 'hengtong-ocean-engineering',
  // HIGH TIDE MARINE L -> High Tide Marine  (stub)
  'high-tide-marine-l': 'high-tide-marine',
  // Honghua Offshore Oi -> Honghua Offshore Oil & Gas Equipment Co  (midword)
  'honghua-offshore-oi': 'honghua-offshore-oil-gas-equipment-co',
  // Horizon Shipmanage -> Horizon Shipmanagement  (midword)
  'horizon-shipmanage': 'horizon-shipmanagement',
  // HYDRA MARINE SA D -> HYDRA MARINE SA DE CV  (midword)
  'hydra-marine-sa-d': 'hydra-marine-sa-de-cv',
  // Hydra Offshore Cons -> Hydra Offshore Construction  (midword)
  'hydra-offshore-cons': 'hydra-offshore-construction',
  // Hyundai Engineering and Stee! -> Hyundai Engineering and Steel  (midword)
  'hyundai-engineering-and-stee': 'hyundai-engineering-and-steel',
  // Hyundai Heavy Ind -> Hyundai Heavy Industries  (midword)
  'hyundai-heavy-ind': 'hyundai-heavy-industries',
  // IGOPL OFFSHORE PV -> IGOPL Offshore  (stub)
  'igopl-offshore-pv': 'igopl-offshore',
  // Impulsora De Produc -> Impulsora De Production  (midword)
  'impulsora-de-produc': 'impulsora-de-production',
  // Iskes Towage and Sal -> Iskes Towage and Salvage  (midword)
  'iskes-towage-and-sal': 'iskes-towage-and-salvage',
  // Jala Nusantara Mardi -> Jala Nusantara Mardika  (midword)
  'jala-nusantara-mardi': 'jala-nusantara-mardika',
  // Jasa Mulia Maritim -> Jasa Mulia Maritime  (midword)
  'jasa-mulia-maritim': 'jasa-mulia-maritime',
  // JETWAVE MARINE SE -> Jetwave Marine  (stub)
  'jetwave-marine-se': 'jetwave-marine',
  // Jiangsu Longyuan Zhenhua Me Co -> Jiangsu Longyuan Zhenhua  (stub)
  'jiangsu-longyuan-zhenhua-me-co': 'jiangsu-longyuan-zhenhua',
  // Jumbo Offshore Enterprise -> Jumbo Offshore Enterprises  (midword)
  'jumbo-offshore-enterprise': 'jumbo-offshore-enterprises',
  // Karya Sarana Samud -> Karya Sarana Samudera  (midword)
  'karya-sarana-samud': 'karya-sarana-samudera',
  // KEI-RSOS MARITIME L -> KEI RSOS Maritime  (stub)
  'kei-rsos-maritime-l': 'kei-rsos-maritime',
  // KENYA MARINE CON -> Kenya Marine Contractors  (midword)
  'kenya-marine-con': 'kenya-marine-contractors',
  // Khatanga Maritime T -> Khatanga Maritime Trade Port  (midword)
  'khatanga-maritime-t': 'khatanga-maritime-trade-port',
  // KK Marine Consultan -> KK Marine Consultants Ltd  (midword)
  'kk-marine-consultan': 'kk-marine-consultants-ltd',
  // Kunlun Financial Leasing ¢ -> Kunlun Financial Leasing Co  (legal-form)
  'kunlun-financial-leasing': 'kunlun-financial-leasing-co',
  // LABMAR LOGISTICS L -> LABMAR LOGISTICS  (stub)
  'labmar-logistics-l': 'labmar-logistics',
  // LABORDE MARINE SE -> Laborde Marine  (stub)
  'laborde-marine-se': 'laborde-marine',
  // Lam Hong Diving Service -> Lam Hong Diving Services  (midword)
  'lam-hong-diving-service': 'lam-hong-diving-services',
  // LEGACY OFFSHORE L -> Legacy Offshore  (stub)
  'legacy-offshore-l': 'legacy-offshore',
  // Lenimar Ocean Trawl -> Lenimar Ocean Trawlers  (midword)
  'lenimar-ocean-trawl': 'lenimar-ocean-trawlers',
  // Leviathan Offshore L -> Leviathan Offshore LLC  (midword)
  'leviathan-offshore-l': 'leviathan-offshore-llc',
  // Limin Marine and Off -> Limin Marine and Offshore  (midword)
  'limin-marine-and-off': 'limin-marine-and-offshore',
  // Liwa Petroleum Mark -> Liwa Petroleum Marketing Establishment  (midword)
  'liwa-petroleum-mark': 'liwa-petroleum-marketing-establishment',
  // Logindo Samudrama -> Logindo Samudramakmur  (midword)
  'logindo-samudrama': 'logindo-samudramakmur',
  // LOURA SHIPMANAGE -> Loura Shipmanagem  (midword)
  'loura-shipmanage': 'loura-shipmanagem',
  // Major Project -> Major Projects Found  (midword)
  'major-project': 'major-projects-found',
  // MANA LAGI PELAYAR -> MANA LAGI PELAYARAN  (midword)
  'mana-lagi-pelayar': 'mana-lagi-pelayaran',
  // Mantenimiento Mari -> Mantenimiento Marino de México  (midword)
  'mantenimiento-mari': 'mantenimiento-marino-de-mexico',
  // Marina Rindang Perk -> Marina Rindang Perkasa  (midword)
  'marina-rindang-perk': 'marina-rindang-perkasa',
  // Marine Arctic Geologi -> Marine Arctic Geological  (midword)
  'marine-arctic-geologi': 'marine-arctic-geological',
  // Marine Logistics Solution -> Marine Logistics Solutions  (midword)
  'marine-logistics-solution': 'marine-logistics-solutions',
  // Marine Offshore Con -> Marine Offshore Construction  (midword)
  'marine-offshore-con': 'marine-offshore-construction',
  // Marine Projects Rott -> Marine Projects Rotterdam  (midword)
  'marine-projects-rott': 'marine-projects-rotterdam',
  // Marine Solution -> MARINE Solutions  (midword)
  'marine-solution': 'marine-solutions',
  // Marine Transport an -> Marine Transport and Diving Services  (midword)
  'marine-transport-an': 'marine-transport-and-diving-services',
  // Marquette Transport -> Marquette Transportation Co  (midword)
  'marquette-transport': 'marquette-transportation-co',
  // Matahari Terbit Kali -> Matahari Terbit Kalimantan  (midword)
  'matahari-terbit-kali': 'matahari-terbit-kalimantan',
  // Maverick Offshore Se -> Maverick Offshore Services  (midword)
  'maverick-offshore-se': 'maverick-offshore-services',
  // Melaju Sinergi Nusan -> Melaju Sinergi Nusantara  (midword)
  'melaju-sinergi-nusan': 'melaju-sinergi-nusantara',
  // Mentari Terang Kalim -> Mentari Terang Kalimantan  (midword)
  'mentari-terang-kalim': 'mentari-terang-kalimantan',
  // Merciful Maritime Li -> Merciful Maritime Limited  (midword)
  'merciful-maritime-li': 'merciful-maritime-limited',
  // METSON MARINE SE -> Metson Marine  (stub)
  'metson-marine-se': 'metson-marine',
  // Mexicana De Servicio -> Mexicana De Servicios Maritimo  (midword)
  'mexicana-de-servicio': 'mexicana-de-servicios-maritimo',
  // Middle East Fuji Khim -> Middle East Fuji Khimji Shipping  (midword)
  'middle-east-fuji-khim': 'middle-east-fuji-khimji-shipping',
  // Milano Gulf Petroche -> Milano Gulf Petrochem FZE  (midword)
  'milano-gulf-petroche': 'milano-gulf-petrochem-fze',
  // Military Sealift Comm -> Military Sealift Command  (midword)
  'military-sealift-comm': 'military-sealift-command',
  // Minsheng Financial L -> Minsheng Financial Leasing  (midword)
  'minsheng-financial-l': 'minsheng-financial-leasing',
  // Mitra Anugrah Samu -> Mitra Anugrah Samudra  (midword)
  'mitra-anugrah-samu': 'mitra-anugrah-samudra',
  // Modern American Re -> Modern American Recycling Service  (midword)
  'modern-american-re': 'modern-american-recycling-service',
  // Momentum Marine S -> Momentum Marine Services  (midword)
  'momentum-marine-s': 'momentum-marine-services',
  // Montajes de Occiden -> Montajes de Occidenties  (midword)
  'montajes-de-occiden': 'montajes-de-occidenties',
  // MOPU HOLDINGS is -> MOPU HOLDINGS  (stub)
  'mopu-holdings-is': 'mopu-holdings',
  // Morska Sluzba Poszu -> Morska Sluzba Poszukiwania  (midword)
  'morska-sluzba-poszu': 'morska-sluzba-poszukiwania',
  // Multraship Towage a -> Multraship Towage and Salvage  (midword)
  'multraship-towage-a': 'multraship-towage-and-salvage',
  // Naeroysund Aq -> Naeroysund Aquaser  (midword)
  'naeroysund-aq': 'naeroysund-aquaser',
  // Nahange Sefide Tang -> Nahange Sefide Tangestan Co  (midword)
  'nahange-sefide-tang': 'nahange-sefide-tangestan-co',
  // Nakilat Svitzer Wijsm -> Nakilat Svitzer Wijsmuller  (midword)
  'nakilat-svitzer-wijsm': 'nakilat-svitzer-wijsmuller',
  // NATIONAL AUSTRALI -> NATIONAL AUSTRALIA BANK  (midword)
  'national-australi': 'national-australia-bank',
  // Naviera Bourbon TA -> Naviera Bourbon Tamaulipas  (midword)
  'naviera-bourbon-ta': 'naviera-bourbon-tamaulipas',
  // Naviera Mexicana Ne -> Naviera Mexicana Neptur  (midword)
  'naviera-mexicana-ne': 'naviera-mexicana-neptur',
  // Navigare Capita -> Navigare Capital  (midword)
  'navigare-capita': 'navigare-capital',
  // Navtec Marine Se -> Navtec Marine Services  (midword)
  'navtec-marine-se': 'navtec-marine-services',
  // NEPTUNE EQUIPMEN -> Neptune Equipment  (midword)
  'neptune-equipmen': 'neptune-equipment',
  // Neptune Maritime Le -> Neptune Maritime Leasing  (midword)
  'neptune-maritime-le': 'neptune-maritime-leasing',
  // Ness Risan and Partn -> Ness Risan and Partners  (midword)
  'ness-risan-and-partn': 'ness-risan-and-partners',
  // Netherlands Govern -> Netherlands Government  (midword)
  'netherlands-govern': 'netherlands-government',
  // NEXT GEOSOLUTION -> Next Geosolutions  (midword)
  'next-geosolution': 'next-geosolutions',
  // Nextee Oil and Gas T -> Nextee Oil and Gas Trading  (midword)
  'nextee-oil-and-gas-t': 'nextee-oil-and-gas-trading',
  // Nigerian Maritime Ad -> Nigerian Maritime Administration and Safety Agency  (midword)
  'nigerian-maritime-ad': 'nigerian-maritime-administration-and-safety-agency',
  // NORTHEASTER MARI -> Northeaster Marine  (midword)
  'northeaster-mari': 'northeaster-marine',
  // Oceanica Empresa d -> Oceanica Empresa de Apoio  (midword)
  'oceanica-empresa-d': 'oceanica-empresa-de-apoio',
  // Oceanindo Prima Sar -> Oceanindo Prima Sarana PT  (midword)
  'oceanindo-prima-sar': 'oceanindo-prima-sarana-pt',
  // OFCO Offshore Supp -> OFCO Offshore Supply  (midword)
  'ofco-offshore-supp': 'ofco-offshore-supply',
  // OFFSHORE 360 SA DE -> Offshore 360  (stub)
  'offshore-360-sa-de': 'offshore-360',
  // Offshore Marine Con -> Offshore Marine Construction  (midword)
  'offshore-marine-con': 'offshore-marine-construction',
  // OLYMPIC TRITON II AS -> OLYMPIC TRITON  (stub)
  'olympic-triton-ii-as': 'olympic-triton',
  // OPI International Co -> OPI International Construction  (midword)
  'opi-international-co': 'opi-international-construction',
  // Orient Oil Co -> ORIENT OIL COLLC  (midword)
  'orient-oil-co': 'orient-oil-collc',
  // ORSTED WIND POWE -> ORSTED WIND POWER  (midword)
  'orsted-wind-powe': 'orsted-wind-power',
  // Overseas Marine Log -> Overseas Marine Logistics  (midword)
  'overseas-marine-log': 'overseas-marine-logistics',
  // Pacific Tugboat Service -> Pacific Tugboat Services  (midword)
  'pacific-tugboat-service': 'pacific-tugboat-services',
  // Paradise Offshore E -> Paradise Offshore  (stub)
  'paradise-offshore-e': 'paradise-offshore',
  // Pareto Maritime Service -> Pareto Maritime Services  (midword)
  'pareto-maritime-service': 'pareto-maritime-services',
  // Pasargad Energy Dev -> Pasargad Energy Development  (midword)
  'pasargad-energy-dev': 'pasargad-energy-development',
  // Pasifik Berjaya Bersa -> Pasifik Berjaya Bersaudara  (midword)
  'pasifik-berjaya-bersa': 'pasifik-berjaya-bersaudara',
  // Pasifik Lestari Bersau -> Pasifik Lestari Bersaudara  (midword)
  'pasifik-lestari-bersau': 'pasifik-lestari-bersaudara',
  // Pelican Offshore Service -> Pelican Offshore Services  (midword)
  'pelican-offshore-service': 'pelican-offshore-services',
  // Penguin Shipyard Internationa! -> Penguin Shipyard International Pte. Ltd.  (midword)
  'penguin-shipyard-internationa': 'penguin-shipyard-international-pte-ltd',
  // Perisai Petroleum Te -> Perisai Petroleum Teknologi  (midword)
  'perisai-petroleum-te': 'perisai-petroleum-teknologi',
  // Petroleo Constellatio -> Petroleo Constellation SA  (midword)
  'petroleo-constellatio': 'petroleo-constellation-sa',
  // Pier 1 Marine -> PIER 1 MARINES LTD  (midword)
  'pier-1-marine': 'pier-1-marines-ltd',
  // Pilin Fleet Manageme -> Pilin Fleet Management  (midword)
  'pilin-fleet-manageme': 'pilin-fleet-management',
  // Pirate's Well Investment -> Pirate's Well Investments  (midword)
  'pirate-s-well-investment': 'pirate-s-well-investments',
  // Pishgaman Omid Dar -> Pishgaman Omid Darya  (midword)
  'pishgaman-omid-dar': 'pishgaman-omid-darya',
  // PJE SHIPPING SA DE CV -> PJE Shipping  (stub)
  'pje-shipping-sa-de-cv': 'pje-shipping',
  // Polskie Ratownic -> Polskie Ratownictwo  (midword)
  'polskie-ratownic': 'polskie-ratownictwo',
  // POSEIDON SHIP REC -> Poseidon Ship Recycling  (midword)
  'poseidon-ship-rec': 'poseidon-ship-recycling',
  // POWERCHINA LEASI -> POWERCHINA Leasing  (midword)
  'powerchina-leasi': 'powerchina-leasing',
  // Premier Marine Services W.L.L. -> Premier Marine Services  (stub)
  'premier-marine-services-w-l-l': 'premier-marine-services',
  // Prince Marine Transp -> Prince Marine Transport Services  (midword)
  'prince-marine-transp': 'prince-marine-transport-services',
  // Progressive Marine T -> Progressive Marine Technology  (midword)
  'progressive-marine-t': 'progressive-marine-technology',
  // Project Masters Niger -> Project Masters Nigeria  (midword)
  'project-masters-niger': 'project-masters-nigeria',
  // Promarine Shipmana -> Promarine Shipmanagement Co SA  (midword)
  'promarine-shipmana': 'promarine-shipmanagement-co-sa',
  // PSR Marine Service -> PSR Marine Services  (midword)
  'psr-marine-service': 'psr-marine-services',
  // PT Aserra Logistik Ind -> PT Aserra Logistik Indonesia  (midword)
  'pt-aserra-logistik-ind': 'pt-aserra-logistik-indonesia',
  // PT Cakrawala Nusa B -> PT Cakrawala Nusa Bahari  (midword)
  'pt-cakrawala-nusa-b': 'pt-cakrawala-nusa-bahari',
  // PT Ekalya Purnamasa -> PT Ekalya Purnamasari Offshore  (midword)
  'pt-ekalya-purnamasa': 'pt-ekalya-purnamasari-offshore',
  // PT Orela Bahari Man -> PT Orela Bahari Mandiri  (midword)
  'pt-orela-bahari-man': 'pt-orela-bahari-mandiri',
  // PT Pelayaran Daya Sa -> PT Pelayaran Daya Samudera Mandiri  (midword)
  'pt-pelayaran-daya-sa': 'pt-pelayaran-daya-samudera-mandiri',
  // PT Pelayaran Menara -> PT Pelayaran Menaratama Samudra Indah  (midword)
  'pt-pelayaran-menara': 'pt-pelayaran-menaratama-samudra-indah',
  // PT Pelayaran Mitra P -> PT Pelayaran Mitra Pacific  (midword)
  'pt-pelayaran-mitra-p': 'pt-pelayaran-mitra-pacific',
  // Pualam Emas Sejahte -> Pualam Emas Sejahtera  (midword)
  'pualam-emas-sejahte': 'pualam-emas-sejahtera',
  // Purus Marine Holdings UK -> Purus Marine Holdings  (stub)
  'purus-marine-holdings-uk': 'purus-marine-holdings',
  // Qiming Ocean Electri -> Qiming Ocean Electric Power  (midword)
  'qiming-ocean-electri': 'qiming-ocean-electric-power',
  // Quality Sukses Sejaht -> Quality Sukses Sejahtera  (midword)
  'quality-sukses-sejaht': 'quality-sukses-sejahtera',
  // Ram Servicios De Buc -> Ram Servicios De Buceo  (midword)
  'ram-servicios-de-buc': 'ram-servicios-de-buceo',
  // Rifer Costruzioni Gen -> Rifer Costruzioni Generali Srl  (midword)
  'rifer-costruzioni-gen': 'rifer-costruzioni-generali-srl',
  // Roya Gostar Khavar -> Roya Gostar Khavarmianeh  (midword)
  'roya-gostar-khavar': 'roya-gostar-khavarmianeh',
  // Safe Supply Offshore -> Safe Supply Offshore Ltda  (legal-form)
  'safe-supply-offshore': 'safe-supply-offshore-ltda',
  // SAIPEM OFFSHORE N -> Saipem Offshore Norway AS  (midword)
  'saipem-offshore-n': 'saipem-offshore-norway-as',
  // Sam Pan Marine Hol -> Sam Pan Marine Holdings  (midword)
  'sam-pan-marine-hol': 'sam-pan-marine-holdings',
  // Samarinda Bakti Kali -> Samarinda Bakti Kalimantan  (midword)
  'samarinda-bakti-kali': 'samarinda-bakti-kalimantan',
  // Saraf Corporation In -> Saraf Corporation India Pvt  (midword)
  'saraf-corporation-in': 'saraf-corporation-india-pvt',
  // Sarku Engineering Se -> Sarku Engineering Services  (midword)
  'sarku-engineering-se': 'sarku-engineering-services',
  // SAS Middle East Gen -> SAS Middle East General  (midword)
  'sas-middle-east-gen': 'sas-middle-east-general',
  // Saudi Arabia Govern -> Saudi Arabia Government  (midword)
  'saudi-arabia-govern': 'saudi-arabia-government',
  // Sea Arrows Ship Man -> Sea Arrows Ship Management and Operation Co  (midword)
  'sea-arrows-ship-man': 'sea-arrows-ship-management-and-operation-co',
  // Sea Energy and Rene -> Sea Energy and Renewables  (midword)
  'sea-energy-and-rene': 'sea-energy-and-renewables',
  // Sea Shepherd Conser -> Sea Shepherd Conservation  (midword)
  'sea-shepherd-conser': 'sea-shepherd-conservation',
  // Sea Support Venture -> Sea Support Ventures LLC  (midword)
  'sea-support-venture': 'sea-support-ventures-llc',
  // SEA1 OFFSHORE DO -> Sea1 Offshore  (stub)
  'sea1-offshore-do': 'sea1-offshore',
  // Seabulk Offshore Op -> Seabulk Offshore Operators  (midword)
  'seabulk-offshore-op': 'seabulk-offshore-operators',
  // SEACOR OFFSHORE L -> SEACOR OFFSHORE  (stub)
  'seacor-offshore-l': 'seacor-offshore',
  // SEACOR Offshore Del -> SEACOR Offshore Delta  (midword)
  'seacor-offshore-del': 'seacor-offshore-delta',
  // SEAFAST MARITIME L -> Seafast Maritime  (stub)
  'seafast-maritime-l': 'seafast-maritime',
  // Seagreen Enterprise -> Seagreen Enterprises  (midword)
  'seagreen-enterprise': 'seagreen-enterprises',
  // Seahorse Marine E -> Seahorse Marine  (stub)
  'seahorse-marine-e': 'seahorse-marine',
  // Sealandair Energy Se -> Sealandair Energy Services  (midword)
  'sealandair-energy-se': 'sealandair-energy-services',
  // SEALINK SHIPPING C -> Sealink Shipping Corp  (midword)
  'sealink-shipping-c': 'sealink-shipping-corp',
  // Seloy Undervannsser -> Seloy Undervannsservice  (midword)
  'seloy-undervannsser': 'seloy-undervannsservice',
  // Servitec Steam Ship -> Servitec Steam Shipping  (midword)
  'servitec-steam-ship': 'servitec-steam-shipping',
  // Shandong Yuanda Sh -> Shandong Yuanda Shipping  (midword)
  'shandong-yuanda-sh': 'shandong-yuanda-shipping',
  // Shanghai Tongchuan -> Shanghai Tongchuang Haiyuan Offshore  (midword)
  'shanghai-tongchuan': 'shanghai-tongchuang-haiyuan-offshore',
  // Sharaf Shipping Agen -> Sharaf Shipping Agency  (midword)
  'sharaf-shipping-agen': 'sharaf-shipping-agency',
  // Shenzhen Tonghai O -> Shenzhen Tonghai Offshore  (midword)
  'shenzhen-tonghai-o': 'shenzhen-tonghai-offshore',
  // Singapore Telecomm -> Singapore Telecommunications  (midword)
  'singapore-telecomm': 'singapore-telecommunications',
  // SINOPEC SHENGLI Ol -> SINOPEC SHENGLI  (stub)
  'sinopec-shengli-ol': 'sinopec-shengli',
  // Sinoship Maritime Se -> Sinoship Maritime Services  (midword)
  'sinoship-maritime-se': 'sinoship-maritime-services',
  // SONGA OFFSHORE SE -> Songa Offshore  (stub)
  'songa-offshore-se': 'songa-offshore',
  // SOUTHERN COAST Ol -> SOUTHERN COAST  (stub)
  'southern-coast-ol': 'southern-coast',
  // Spartan Offshore Dril -> Spartan Offshore Drilling  (midword)
  'spartan-offshore-dril': 'spartan-offshore-drilling',
  // STAR EXCELLENCE H -> Star Excellence  (stub)
  'star-excellence-h': 'star-excellence',
  // Starfleet Marine Tran -> Starfleet Marine Transportation  (midword)
  'starfleet-marine-tran': 'starfleet-marine-transportation',
  // Strik Stoomketelverh -> Strik Stoomketelverhuur  (midword)
  'strik-stoomketelverh': 'strik-stoomketelverhuur',
  // Suasa Benua Sukse -> Suasa Benua Sukses  (midword)
  'suasa-benua-sukse': 'suasa-benua-sukses',
  // Subsea Worldwide So -> Subsea Worldwide Solutions  (midword)
  'subsea-worldwide-so': 'subsea-worldwide-solutions',
  // Sumatra Wahana Per -> Sumatra Wahana Perkasa  (midword)
  'sumatra-wahana-per': 'sumatra-wahana-perkasa',
  // Superpesa Companhi -> Superpesa Companhia de Transportes Especiais e Intermodais  (midword)
  'superpesa-companhi': 'superpesa-companhia-de-transportes-especiais-e-intermodais',
  // Surfside Seafood Pro -> Surfside Seafood Products  (midword)
  'surfside-seafood-pro': 'surfside-seafood-products',
  // Svetah Energy Infrast -> Svetah Energy Infrastructure  (midword)
  'svetah-energy-infrast': 'svetah-energy-infrastructure',
  // Swadaya Sarana Berli -> Swadaya Sarana Berlian PT  (midword)
  'swadaya-sarana-berli': 'swadaya-sarana-berlian-pt',
  // Swedish Managemen -> Swedish Management Co  (midword)
  'swedish-managemen': 'swedish-management-co',
  // Taihe Engineering Co -> Taihe Engineering Construction  (midword)
  'taihe-engineering-co': 'taihe-engineering-construction',
  // Tamarin Samudra Pel -> Tamarin Samudra Pelayaran  (midword)
  'tamarin-samudra-pel': 'tamarin-samudra-pelayaran',
  // Technical Ship Mana -> Technical Ship Management  (midword)
  'technical-ship-mana': 'technical-ship-management',
  // Tecnicas Maritimas A -> Tecnicas Maritimas Avanzadas  (midword)
  'tecnicas-maritimas-a': 'tecnicas-maritimas-avanzadas',
  // Teluk Bajau Cipta Sej -> Teluk Bajau Cipta Sejahtera  (midword)
  'teluk-bajau-cipta-sej': 'teluk-bajau-cipta-sejahtera',
  // Thamescraft Dry Doc -> Thamescraft Dry Docking Services  (midword)
  'thamescraft-dry-doc': 'thamescraft-dry-docking-services',
  // Thomas Services Mar -> Thomas Services Maritimes  (midword)
  'thomas-services-mar': 'thomas-services-maritimes',
  // Thome Offshore Man -> Thome Offshore Management  (midword)
  'thome-offshore-man': 'thome-offshore-management',
  // Tianjin Harbour Cons -> Tianjin Harbour Construction  (midword)
  'tianjin-harbour-cons': 'tianjin-harbour-construction',
  // Tianjin Port and Chan -> Tianjin Port and Channel Engineering  (midword)
  'tianjin-port-and-chan': 'tianjin-port-and-channel-engineering',
  // Tidewater Angola Ma -> Tidewater Angola Marine  (midword)
  'tidewater-angola-ma': 'tidewater-angola-marine',
  // Timas Samudera Ind -> Timas Samudera Indonesia  (midword)
  'timas-samudera-ind': 'timas-samudera-indonesia',
  // Topaz Tankers Shipm -> Topaz Tankers Shipmanagement  (midword)
  'topaz-tankers-shipm': 'topaz-tankers-shipmanagement',
  // Transgulf Shipping Se -> Transgulf Shipping Services Co  (midword)
  'transgulf-shipping-se': 'transgulf-shipping-services-co',
  // Transocean Inc El -> Transocean Inc  (stub)
  'transocean-inc-el': 'transocean-inc',
  // Transport Freight Ag -> Transport Freight Agency  (midword)
  'transport-freight-ag': 'transport-freight-agency',
  // Transportes del Mar -> Transportes del Mar SAS  (legal-form)
  'transportes-del-mar': 'transportes-del-mar-sas',
  // TRITON ASSET LEASI -> TRITON ASSET LEASING  (midword)
  'triton-asset-leasi': 'triton-asset-leasing',
  // Tropical Shipping T -> Tropical Shipping  (stub)
  'tropical-shipping-t': 'tropical-shipping',
  // True Blue Ship Mana -> True Blue Ship Management  (midword)
  'true-blue-ship-mana': 'true-blue-ship-management',
  // Truth Maritime Com -> Truth Maritime Company  (midword)
  'truth-maritime-com': 'truth-maritime-company',
  // TSH INVESTMENT 1L -> TSH Investment  (stub)
  'tsh-investment-1l': 'tsh-investment',
  // Tulshyan Group xz -> Tulshyan Group  (stub)
  'tulshyan-group-xz': 'tulshyan-group',
  // U Ming Marine Trans -> U Ming Marine Transport  (midword)
  'u-ming-marine-trans': 'u-ming-marine-transport',
  // United Geophysical N -> United Geophysical Nigeria  (midword)
  'united-geophysical-n': 'united-geophysical-nigeria',
  // United Kingdom Gov -> United Kingdom Government  (midword)
  'united-kingdom-gov': 'united-kingdom-government',
  // United Salvage and T -> United Salvage and Towage  (midword)
  'united-salvage-and-t': 'united-salvage-and-towage',
  // Unknown Middle Eas -> Unknown Middle Eastern  (midword)
  'unknown-middle-eas': 'unknown-middle-eastern',
  // Van Wijngaarden Ma -> Van Wijngaarden Marine Services  (midword)
  'van-wijngaarden-ma': 'van-wijngaarden-marine-services',
  // Vega Maritime - FZC l -> Vega Maritime FZC  (stub)
  'vega-maritime-fzc-l': 'vega-maritime-fzc',
  // Vema International e -> Vema International  (stub)
  'vema-international-e': 'vema-international',
  // Verbeek Maritime Se -> Verbeek Maritime Services  (midword)
  'verbeek-maritime-se': 'verbeek-maritime-services',
  // Vessel Offshore Man -> Vessel Offshore Management  (midword)
  'vessel-offshore-man': 'vessel-offshore-management',
  // Volgo-Don Service -> Volgo-Don Services  (midword)
  'volgo-don-service': 'volgo-don-services',
  // Vortex Offshore DMC -> Vortex Offshore DMCEST  (midword)
  'vortex-offshore-dmc': 'vortex-offshore-dmcest',
  // WARUNA NUSA SENT -> Waruna Nusa Sentana  (midword)
  'waruna-nusa-sent': 'waruna-nusa-sentana',
  // Waterfall Business C -> Waterfall Business Corp  (midword)
  'waterfall-business-c': 'waterfall-business-corp',
  // Western Coast Dredging Co. W.L.L. -> Western Coast Dredging  (stub)
  'western-coast-dredging-co-w-l-l': 'western-coast-dredging',
  // Western Coast Port S -> Western Coast Port Services  (midword)
  'western-coast-port-s': 'western-coast-port-services',
  // WHS Global Mandiri PT -> WHS Global Mandiri  (stub)
  'whs-global-mandiri-pt': 'whs-global-mandiri',
  // WIND ALLY LTD He -> WIND ALLY LTD  (stub)
  'wind-ally-ltd-he': 'wind-ally-ltd',
  // Wind Marine Service -> Wind Marine Services  (midword)
  'wind-marine-service': 'wind-marine-services',
  // Wood Marine Workb -> Wood Marine Workboats  (midword)
  'wood-marine-workb': 'wood-marine-workboats',
  // Woodside Energy Gr -> Woodside Energy Group  (midword)
  'woodside-energy-gr': 'woodside-energy-group',
  // Yangpu Huihong Sup -> Yangpu Huihong Supply Chain  (midword)
  'yangpu-huihong-sup': 'yangpu-huihong-supply-chain',
  // Yareeb Hameed Orai -> Yareeb Hameed Oraibi Al-Sahlanee and Saqib Younis  (midword)
  'yareeb-hameed-orai': 'yareeb-hameed-oraibi-al-sahlanee-and-saqib-younis',
  // Yi Hai Offshore Tech -> Yi Hai Offshore Technology Co Ltd  (midword)
  'yi-hai-offshore-tech': 'yi-hai-offshore-technology-co-ltd',
  // YOFC Baosheng Mari -> YOFC Baosheng Marine  (midword)
  'yofc-baosheng-mari': 'yofc-baosheng-marine',
  // Zhejiang Fengxin Oce -> Zhejiang Fengxin Ocean Engineering Co  (midword)
  'zhejiang-fengxin-oce': 'zhejiang-fengxin-ocean-engineering-co',
  // Zhejiang Huadong Co -> Zhejiang Huadong Construction  (midword)
  'zhejiang-huadong-co': 'zhejiang-huadong-construction',
  // Zhejiang Tianchen Oc -> Zhejiang Tianchen Oceanographic gi  (midword)
  'zhejiang-tianchen-oc': 'zhejiang-tianchen-oceanographic-gi',
  // Zhonggu Shipping Gr -> Zhonggu Shipping Group  (midword)
  'zhonggu-shipping-gr': 'zhonggu-shipping-group',
  // ZOMAY MARINE LO -> Zomay Marine  (stub)
  'zomay-marine-lo': 'zomay-marine',
  // Zomay Marine and L -> Zomay Marine and Logistics  (midword)
  'zomay-marine-and-l': 'zomay-marine-and-logistics',
  // ZUKUS INDUSTRIES L -> Zukus Industries  (stub)
  'zukus-industries-l': 'zukus-industries',
  // Zulia Towing and Bar -> Zulia Towing and Barge  (midword)
  'zulia-towing-and-bar': 'zulia-towing-and-barge',
};

/** The names a kept record absorbed, so its profile can say so. */
export const MERGED_NAMES: Record<string, string[]> = {
  'abed-marine-services': ['Abed Marine Service'],
  'abnegar-seid-khalij-fars-co': ['Abnegar Seid Khalij F'],
  'abu-qurrah-shipping': ['Abu Qurrah Shipping IE'],
  'adani-ports-and-special-economic-zone': ['Adani Ports and Special Economic Zone Ld'],
  'adnoc-logistics-and-services': ['ADNOC Logistics and Service'],
  'aegean-shipping': ['Aegean Shipping Ma'],
  'ajang-shipping': ['AJANG SHIPPING SD'],
  'akron-trade-and-transport': ['Akron Trade and Tra'],
  'alam-maritime': ['Alam Maritim'],
  'alliance-offshore-drilling': ['Alliance Offshore Dril'],
  'althea-shiptrade': ['ALTHEA SHIPTRADE L'],
  'amaniaga-resources': ['Amaniaga Resources B'],
  'amba-shipping-logistics': ['Amba Shipping Log'],
  'amber-offshore-sp-zoo': ['Amber Offshore Sp Z'],
  'antwerp-water-services': ['Antwerp Water Service'],
  'apreala-marine-services': ['APREALA MARINE SE'],
  'aquashield-oil-and-marine-services': ['Aquashield Oil and Marine Serv'],
  'aquatic-blue-environmental': ['Aquatic Blue Environ'],
  'arab-petroleum-pipelines': ['Arab Petroleum Pipel'],
  'arena-denizcilik-tersanecilik': ['Arena Denizcilik Ters'],
  'argentina-govt': ['ARGENTINA GOVT N'],
  'arktikmor-neftegaz-razvedka': ['Arktikmor Neftegaz R'],
  'armamex-naviera-sa': ['Armamex Naviera SA de CV'],
  'asian-salvage': ['ASIAN SALVAGE TO'],
  'asian-spirit-steamship-co': ['Asian Spirit Steams'],
  'asset-management-corporation-of-nigeria': ['Asset Management C'],
  'associated-marine-services': ['Associated Marine Se'],
  'astro-offshore': ['ASTRO OFFSHORE PT'],
  'astromaritima-navegacao-s-a': ['ASTROMARITIMA NA', 'Astromaritima'],
  'atlantic-oceanic': ['ATLANTIC OCEANIC L'],
  'atlantik-gemi-isletmeciligi': ['Atlantik Gemi Isletme'],
  'automac-multiresources-sdn-bhd': ['Automac Multiresour'],
  'awak-samudera-transportasi': ['Awak Samudera Tran'],
  'azerbaijan-caspians': ['Azerbaijan Caspian'],
  'azerbaijan-government': ['Azerbaijan Governm'],
  'bahari-semesta-intiline-pt': ['Bahari Semesta Intili'],
  'bahregan-marine-services': ['Bahregan Marine Service'],
  'bahtera-alam-sejahtera': ['Bahtera Alam Sejahte'],
  'bangladesh-government': ['Bangladesh Governm'],
  'bangladesh-inland-water-transport-corporation': ['Bangladesh Inland W'],
  'bayu-maritim-berkah': ['Bayu Maritim Berkah PT'],
  'belait-shipping-co': ['Belait Shipping Co B'],
  'berk-dagdan-individual-enterprise': ['Berk Dagdan Individu'],
  'bhagwan-marine': ['BHAGWAN MARINE P'],
  'bina-buana-raya': ['BINA BUANA RAYA PT'],
  'bismark-maritime': ['BISMARK MARITIME L'],
  'blue-ocean-ship-mgmt-eng': ['Blue Ocean Ship MG'],
  'blue-sea-maritime-and-trading': ['Blue Sea Maritime an'],
  'bourbon-offshore-norway': ['Bourbon Offshore N'],
  'bricks-mursten-mattoni': ['Bricks Mursten Matto'],
  'bufete-de-mantenimiento-predictivo-industrial': ['Bufete de Mantenimi'],
  'bumi-jaya-salvage-and-engineering': ['Bumi Jaya Salvage an'],
  'bywater-ludlow': ['BYWATER LUDLOW L'],
  'cable-maintenance-offshore': ['Cable Maintenance O'],
  'canadian-natural-resources': ['Canadian Natural Re'],
  'canadian-subsea-shipping': ['Canadian Subsea Shi'],
  'capitol-nusantara-indonesia': ['Capitol Nusantara In'],
  'carimin-petroleum-berhad': ['Carimin Petroleum B'],
  'carina-offshore': ['CARINA OFFSHORE L'],
  'ccc-underwater-engineering': ['CCC (Underwater Engineering) S.A.L'],
  'central-de-desarrollos-marinos': ['Central De Desarrollo'],
  'central-shipping': ['CENTRAL SHIPPING PT'],
  'centus-marine': ['Centus Marine L'],
  'chandra-ship-management': ['Chandra Ship Manag'],
  'china-offshore-engineering': ['CHINA OFFSHORE EN'],
  'chornomornaftogaz': ['CHORNOMORNAFTO'],
  'cnooc-energy-technology-services': ['CNOOC ENERGY TEC'],
  'coastland-energy-logistics': ['Coastland Energy Log'],
  'colonial-marine-consultants': ['Colonial Marine Cons'],
  'comercializadora-petro': ['Comercializadora Pet'],
  'commercial-rib-charter': ['Commercial Rib Char'],
  'conciencia-ambiental-srl': ['Conciencia Ambienta'],
  'consultoria-y-servicios-petroleros': ['Consultoria y Servicio'],
  'coral-sea-shipping-lines': ['Coral Sea Shipping Li'],
  'cosl-drilling-pan-pacific': ['COSL Drilling Pan-Pac'],
  'craft-offshore': ['CRAFT OFFSHORE IN'],
  'crosby-marine-transportation': ['CROSBY MARINE TRA'],
  'dang-development': ['DANG DEVELOPMEN'],
  'dar-alkhayam-general-trading': ['Dar Alkhayam Gener'],
  'delmar-marine-transport': ['Delmar Marine Trans'],
  'demar-instaladora-y-constructora': ['DEMAR INSTALADOR'],
  'deme-offshore': ['DEME OFFSHORE DK'],
  'department-of-port-administration-american-samoa': ['Department of Port A'],
  'det-norske-oljeselskap-asa': ['Det Norske Oljeselsk'],
  'diaplous-maritime-services': ['Diaplous Maritime Se'],
  'dineshchandra-r-agrawal-infracon': ['Dineshchandra R Agr'],
  'dipmar-gemi-kurtarma': ['Dipmar Gemi Kurtar'],
  'edeis-ports-saint-malo-cancale': ['Edeis Ports Saint Mal'],
  'eka-nusantara-line': ['Eka Nusantara Line PT'],
  'electra-maritime': ['ELECTRA MARITIME L'],
  'elpi-trans-cargo': ['ELPI TRANS CARGO PT'],
  'elshcon-nigeria-ltd': ['ELSHCON NIGERIA LTD BB'],
  'empresa-de-navegacion-caribe': ['Empresa de Navegaci'],
  'ensco-deepwater': ['ENSCO DEEPWATER L'],
  'enterprise-shipping': ['Enterprise Shipping SA de CV'],
  'entrons-singapore': ['ENTRONS SINGAPOR'],
  'equinox-offshore-accommodation': ['Equinox Offshore Acc'],
  'erzoff-shore': ['Erzoff-Shore SL'],
  'estaleiro-tce-ltda': ['Estaleiro TCE'],
  'etopo-control-services': ['Etopo Control Service'],
  'exportadora-de-sal-sa-de-cv': ['Exportadora De Sal S'],
  'falcon-global-offshore': ['FALCON GLOBAL OFF'],
  'farsund-fortoyningsselskap-a': ['Farsund Fortoyningss'],
  'fatih-romorkorculuk': ['FATIH ROMORKORCU'],
  'finnish-sea-services': ['Finnish Sea Service'],
  'flexam-investment': ['Flexam Invest'],
  'foltoks-energy-resources-ltd': ['FOLTOKS ENERGY RE'],
  'fortescue-future-industries': ['Fortescue Future Ind'],
  'fpso-ventures-sdn': ['FPSO Ventures Sdn B'],
  'fred-olsen-windcarrier': ['Fred Olsen Windcarrie'],
  'galaxie-marine-services': ['Galaxie Marine Service'],
  'galliano-marine-services': ['Galliano Marine Service'],
  'ganz-danubius-floatingcrane': ['GANZ Danubius Float'],
  'geonavegacao-sas': ['Geonavegacao'],
  'geoview-co-ltd': ['GeoView Co Ltd oo'],
  'ghana-ports-and-harbours-authority': ['Ghana Ports and Har'],
  'global-link-ocean-streams': ['Global Link Ocean Str'],
  'global-sea-mineral-resources': ['Global Sea Mineral R'],
  'glomar-shipmanagement': ['Glomar Shipmanagement B.V.'],
  'gloria-shipping': ['Gloria Shipping S de RL de CV'],
  'goldwind-offshore-engineering': ['Goldwind Offshore E'],
  'gomes-da-silva': ['GOMES DA SILVA JC'],
  'grandi-lavori-fincosit-spa': ['Grandi Lavori Fincosi'],
  'granenergia-navegaceo': ['Granenergia Navegac'],
  'grupo-suardiaz': ['Grupo Suardia'],
  'guanabara-navegacao': ['GUANABARA NAVEG'],
  'gulf-fleet-management': ['Gulf Fleet Manageme'],
  'gulf-marine-services': ['Gulf Marine Service'],
  'hafar-capitol-nusantara': ['Hafar Capitol Nusant'],
  'hairun-marine': ['HAIRUN MARINE HK'],
  'halul-offshore': ['HALUL OFFSHORE SE'],
  'hanwha-ocean-co': ['HANWHA OCEAN CO K'],
  'harps-holdings': ['HARPS HOLDINGS PT'],
  'hebo-maritiem-services': ['Hebo Maritiem Service'],
  'hengtong-ocean-engineering': ['Hengtong Ocean Eng'],
  'high-tide-marine': ['HIGH TIDE MARINE L'],
  'honghua-offshore-oil-gas-equipment-co': ['Honghua Offshore Oi'],
  'horizon-shipmanagement': ['Horizon Shipmanage'],
  'hydra-marine-sa-de-cv': ['HYDRA MARINE SA D'],
  'hydra-offshore-construction': ['Hydra Offshore Cons'],
  'hyundai-engineering-and-steel': ['Hyundai Engineering and Stee!'],
  'hyundai-heavy-industries': ['Hyundai Heavy Ind'],
  'igopl-offshore': ['IGOPL OFFSHORE PV'],
  'impulsora-de-production': ['Impulsora De Produc'],
  'iskes-towage-and-salvage': ['Iskes Towage and Sal'],
  'jala-nusantara-mardika': ['Jala Nusantara Mardi'],
  'jasa-mulia-maritime': ['Jasa Mulia Maritim'],
  'jetwave-marine': ['JETWAVE MARINE SE'],
  'jiangsu-longyuan-zhenhua': ['Jiangsu Longyuan Zhenhua Me Co'],
  'jumbo-offshore-enterprises': ['Jumbo Offshore Enterprise'],
  'karya-sarana-samudera': ['Karya Sarana Samud'],
  'kei-rsos-maritime': ['KEI-RSOS MARITIME L'],
  'kenya-marine-contractors': ['KENYA MARINE CON'],
  'khatanga-maritime-trade-port': ['Khatanga Maritime T'],
  'kk-marine-consultants-ltd': ['KK Marine Consultan'],
  'kunlun-financial-leasing-co': ['Kunlun Financial Leasing ¢'],
  'labmar-logistics': ['LABMAR LOGISTICS L'],
  'laborde-marine': ['LABORDE MARINE SE'],
  'lam-hong-diving-services': ['Lam Hong Diving Service'],
  'legacy-offshore': ['LEGACY OFFSHORE L'],
  'lenimar-ocean-trawlers': ['Lenimar Ocean Trawl'],
  'leviathan-offshore-llc': ['Leviathan Offshore L'],
  'limin-marine-and-offshore': ['Limin Marine and Off'],
  'liwa-petroleum-marketing-establishment': ['Liwa Petroleum Mark'],
  'logindo-samudramakmur': ['Logindo Samudrama'],
  'loura-shipmanagem': ['LOURA SHIPMANAGE'],
  'major-projects-found': ['Major Project'],
  'mana-lagi-pelayaran': ['MANA LAGI PELAYAR'],
  'mantenimiento-marino-de-mexico': ['Mantenimiento Mari'],
  'marina-rindang-perkasa': ['Marina Rindang Perk'],
  'marine-arctic-geological': ['Marine Arctic Geologi'],
  'marine-logistics-solutions': ['Marine Logistics Solution'],
  'marine-offshore-construction': ['Marine Offshore Con'],
  'marine-projects-rotterdam': ['Marine Projects Rott'],
  'marine-solutions': ['Marine Solution'],
  'marine-transport-and-diving-services': ['Marine Transport an'],
  'marquette-transportation-co': ['Marquette Transport'],
  'matahari-terbit-kalimantan': ['Matahari Terbit Kali'],
  'maverick-offshore-services': ['Maverick Offshore Se'],
  'melaju-sinergi-nusantara': ['Melaju Sinergi Nusan'],
  'mentari-terang-kalimantan': ['Mentari Terang Kalim'],
  'merciful-maritime-limited': ['Merciful Maritime Li'],
  'metson-marine': ['METSON MARINE SE'],
  'mexicana-de-servicios-maritimo': ['Mexicana De Servicio'],
  'middle-east-fuji-khimji-shipping': ['Middle East Fuji Khim'],
  'milano-gulf-petrochem-fze': ['Milano Gulf Petroche'],
  'military-sealift-command': ['Military Sealift Comm'],
  'minsheng-financial-leasing': ['Minsheng Financial L'],
  'mitra-anugrah-samudra': ['Mitra Anugrah Samu'],
  'modern-american-recycling-service': ['Modern American Re'],
  'momentum-marine-services': ['Momentum Marine S'],
  'montajes-de-occidenties': ['Montajes de Occiden'],
  'mopu-holdings': ['MOPU HOLDINGS is'],
  'morska-sluzba-poszukiwania': ['Morska Sluzba Poszu'],
  'multraship-towage-and-salvage': ['Multraship Towage a'],
  'naeroysund-aquaser': ['Naeroysund Aq'],
  'nahange-sefide-tangestan-co': ['Nahange Sefide Tang'],
  'nakilat-svitzer-wijsmuller': ['Nakilat Svitzer Wijsm'],
  'national-australia-bank': ['NATIONAL AUSTRALI'],
  'naviera-bourbon-tamaulipas': ['Naviera Bourbon TA'],
  'naviera-mexicana-neptur': ['Naviera Mexicana Ne'],
  'navigare-capital': ['Navigare Capita'],
  'navtec-marine-services': ['Navtec Marine Se'],
  'neptune-equipment': ['NEPTUNE EQUIPMEN'],
  'neptune-maritime-leasing': ['Neptune Maritime Le'],
  'ness-risan-and-partners': ['Ness Risan and Partn'],
  'netherlands-government': ['Netherlands Govern'],
  'next-geosolutions': ['NEXT GEOSOLUTION'],
  'nextee-oil-and-gas-trading': ['Nextee Oil and Gas T'],
  'nigerian-maritime-administration-and-safety-agency': ['Nigerian Maritime Ad'],
  'northeaster-marine': ['NORTHEASTER MARI'],
  'oceanica-empresa-de-apoio': ['Oceanica Empresa d'],
  'oceanindo-prima-sarana-pt': ['Oceanindo Prima Sar'],
  'ofco-offshore-supply': ['OFCO Offshore Supp'],
  'offshore-360': ['OFFSHORE 360 SA DE'],
  'offshore-marine-construction': ['Offshore Marine Con'],
  'olympic-triton': ['OLYMPIC TRITON II AS'],
  'opi-international-construction': ['OPI International Co'],
  'orient-oil-collc': ['Orient Oil Co'],
  'orsted-wind-power': ['ORSTED WIND POWE'],
  'overseas-marine-logistics': ['Overseas Marine Log'],
  'pacific-tugboat-services': ['Pacific Tugboat Service'],
  'paradise-offshore': ['Paradise Offshore E'],
  'pareto-maritime-services': ['Pareto Maritime Service'],
  'pasargad-energy-development': ['Pasargad Energy Dev'],
  'pasifik-berjaya-bersaudara': ['Pasifik Berjaya Bersa'],
  'pasifik-lestari-bersaudara': ['Pasifik Lestari Bersau'],
  'pelican-offshore-services': ['Pelican Offshore Service'],
  'penguin-shipyard-international-pte-ltd': ['Penguin Shipyard Internationa!'],
  'perisai-petroleum-teknologi': ['Perisai Petroleum Te'],
  'petroleo-constellation-sa': ['Petroleo Constellatio'],
  'pier-1-marines-ltd': ['Pier 1 Marine'],
  'pilin-fleet-management': ['Pilin Fleet Manageme'],
  'pirate-s-well-investments': ['Pirate\'s Well Investment'],
  'pishgaman-omid-darya': ['Pishgaman Omid Dar'],
  'pje-shipping': ['PJE SHIPPING SA DE CV'],
  'polskie-ratownictwo': ['Polskie Ratownic'],
  'poseidon-ship-recycling': ['POSEIDON SHIP REC'],
  'powerchina-leasing': ['POWERCHINA LEASI'],
  'premier-marine-services': ['Premier Marine Services W.L.L.'],
  'prince-marine-transport-services': ['Prince Marine Transp'],
  'progressive-marine-technology': ['Progressive Marine T'],
  'project-masters-nigeria': ['Project Masters Niger'],
  'promarine-shipmanagement-co-sa': ['Promarine Shipmana'],
  'psr-marine-services': ['PSR Marine Service'],
  'pt-aserra-logistik-indonesia': ['PT Aserra Logistik Ind'],
  'pt-cakrawala-nusa-bahari': ['PT Cakrawala Nusa B'],
  'pt-ekalya-purnamasari-offshore': ['PT Ekalya Purnamasa'],
  'pt-orela-bahari-mandiri': ['PT Orela Bahari Man'],
  'pt-pelayaran-daya-samudera-mandiri': ['PT Pelayaran Daya Sa'],
  'pt-pelayaran-menaratama-samudra-indah': ['PT Pelayaran Menara'],
  'pt-pelayaran-mitra-pacific': ['PT Pelayaran Mitra P'],
  'pualam-emas-sejahtera': ['Pualam Emas Sejahte'],
  'purus-marine-holdings': ['Purus Marine Holdings UK'],
  'qiming-ocean-electric-power': ['Qiming Ocean Electri'],
  'quality-sukses-sejahtera': ['Quality Sukses Sejaht'],
  'ram-servicios-de-buceo': ['Ram Servicios De Buc'],
  'rifer-costruzioni-generali-srl': ['Rifer Costruzioni Gen'],
  'roya-gostar-khavarmianeh': ['Roya Gostar Khavar'],
  'safe-supply-offshore-ltda': ['Safe Supply Offshore'],
  'saipem-offshore-norway-as': ['SAIPEM OFFSHORE N'],
  'sam-pan-marine-holdings': ['Sam Pan Marine Hol'],
  'samarinda-bakti-kalimantan': ['Samarinda Bakti Kali'],
  'saraf-corporation-india-pvt': ['Saraf Corporation In'],
  'sarku-engineering-services': ['Sarku Engineering Se'],
  'sas-middle-east-general': ['SAS Middle East Gen'],
  'saudi-arabia-government': ['Saudi Arabia Govern'],
  'sea-arrows-ship-management-and-operation-co': ['Sea Arrows Ship Man'],
  'sea-energy-and-renewables': ['Sea Energy and Rene'],
  'sea-shepherd-conservation': ['Sea Shepherd Conser'],
  'sea-support-ventures-llc': ['Sea Support Venture'],
  'sea1-offshore': ['SEA1 OFFSHORE DO'],
  'seabulk-offshore-operators': ['Seabulk Offshore Op'],
  'seacor-offshore': ['SEACOR OFFSHORE L'],
  'seacor-offshore-delta': ['SEACOR Offshore Del'],
  'seafast-maritime': ['SEAFAST MARITIME L'],
  'seagreen-enterprises': ['Seagreen Enterprise'],
  'seahorse-marine': ['Seahorse Marine E'],
  'sealandair-energy-services': ['Sealandair Energy Se'],
  'sealink-shipping-corp': ['SEALINK SHIPPING C'],
  'seloy-undervannsservice': ['Seloy Undervannsser'],
  'servitec-steam-shipping': ['Servitec Steam Ship'],
  'shandong-yuanda-shipping': ['Shandong Yuanda Sh'],
  'shanghai-tongchuang-haiyuan-offshore': ['Shanghai Tongchuan'],
  'sharaf-shipping-agency': ['Sharaf Shipping Agen'],
  'shenzhen-tonghai-offshore': ['Shenzhen Tonghai O'],
  'singapore-telecommunications': ['Singapore Telecomm'],
  'sinopec-shengli': ['SINOPEC SHENGLI Ol'],
  'sinoship-maritime-services': ['Sinoship Maritime Se'],
  'songa-offshore': ['SONGA OFFSHORE SE'],
  'southern-coast': ['SOUTHERN COAST Ol'],
  'spartan-offshore-drilling': ['Spartan Offshore Dril'],
  'star-excellence': ['STAR EXCELLENCE H'],
  'starfleet-marine-transportation': ['Starfleet Marine Tran'],
  'strik-stoomketelverhuur': ['Strik Stoomketelverh'],
  'suasa-benua-sukses': ['Suasa Benua Sukse'],
  'subsea-worldwide-solutions': ['Subsea Worldwide So'],
  'sumatra-wahana-perkasa': ['Sumatra Wahana Per'],
  'superpesa-companhia-de-transportes-especiais-e-intermodais': ['Superpesa Companhi'],
  'surfside-seafood-products': ['Surfside Seafood Pro'],
  'svetah-energy-infrastructure': ['Svetah Energy Infrast'],
  'swadaya-sarana-berlian-pt': ['Swadaya Sarana Berli'],
  'swedish-management-co': ['Swedish Managemen'],
  'taihe-engineering-construction': ['Taihe Engineering Co'],
  'tamarin-samudra-pelayaran': ['Tamarin Samudra Pel'],
  'technical-ship-management': ['Technical Ship Mana'],
  'tecnicas-maritimas-avanzadas': ['Tecnicas Maritimas A'],
  'teluk-bajau-cipta-sejahtera': ['Teluk Bajau Cipta Sej'],
  'thamescraft-dry-docking-services': ['Thamescraft Dry Doc'],
  'thomas-services-maritimes': ['Thomas Services Mar'],
  'thome-offshore-management': ['Thome Offshore Man'],
  'tianjin-harbour-construction': ['Tianjin Harbour Cons'],
  'tianjin-port-and-channel-engineering': ['Tianjin Port and Chan'],
  'tidewater-angola-marine': ['Tidewater Angola Ma'],
  'timas-samudera-indonesia': ['Timas Samudera Ind'],
  'topaz-tankers-shipmanagement': ['Topaz Tankers Shipm'],
  'transgulf-shipping-services-co': ['Transgulf Shipping Se'],
  'transocean-inc': ['Transocean Inc El'],
  'transport-freight-agency': ['Transport Freight Ag'],
  'transportes-del-mar-sas': ['Transportes del Mar'],
  'triton-asset-leasing': ['TRITON ASSET LEASI'],
  'tropical-shipping': ['Tropical Shipping T'],
  'true-blue-ship-management': ['True Blue Ship Mana'],
  'truth-maritime-company': ['Truth Maritime Com'],
  'tsh-investment': ['TSH INVESTMENT 1L'],
  'tulshyan-group': ['Tulshyan Group xz'],
  'u-ming-marine-transport': ['U Ming Marine Trans'],
  'united-geophysical-nigeria': ['United Geophysical N'],
  'united-kingdom-government': ['United Kingdom Gov'],
  'united-salvage-and-towage': ['United Salvage and T'],
  'unknown-middle-eastern': ['Unknown Middle Eas'],
  'van-wijngaarden-marine-services': ['Van Wijngaarden Ma'],
  'vega-maritime-fzc': ['Vega Maritime - FZC l'],
  'vema-international': ['Vema International e'],
  'verbeek-maritime-services': ['Verbeek Maritime Se'],
  'vessel-offshore-management': ['Vessel Offshore Man'],
  'volgo-don-services': ['Volgo-Don Service'],
  'vortex-offshore-dmcest': ['Vortex Offshore DMC'],
  'waruna-nusa-sentana': ['WARUNA NUSA SENT'],
  'waterfall-business-corp': ['Waterfall Business C'],
  'western-coast-dredging': ['Western Coast Dredging Co. W.L.L.'],
  'western-coast-port-services': ['Western Coast Port S'],
  'whs-global-mandiri': ['WHS Global Mandiri PT'],
  'wind-ally-ltd': ['WIND ALLY LTD He'],
  'wind-marine-services': ['Wind Marine Service'],
  'wood-marine-workboats': ['Wood Marine Workb'],
  'woodside-energy-group': ['Woodside Energy Gr'],
  'yangpu-huihong-supply-chain': ['Yangpu Huihong Sup'],
  'yareeb-hameed-oraibi-al-sahlanee-and-saqib-younis': ['Yareeb Hameed Orai'],
  'yi-hai-offshore-technology-co-ltd': ['Yi Hai Offshore Tech'],
  'yofc-baosheng-marine': ['YOFC Baosheng Mari'],
  'zhejiang-fengxin-ocean-engineering-co': ['Zhejiang Fengxin Oce'],
  'zhejiang-huadong-construction': ['Zhejiang Huadong Co'],
  'zhejiang-tianchen-oceanographic-gi': ['Zhejiang Tianchen Oc'],
  'zhonggu-shipping-group': ['Zhonggu Shipping Gr'],
  'zomay-marine': ['ZOMAY MARINE LO'],
  'zomay-marine-and-logistics': ['Zomay Marine and L'],
  'zukus-industries': ['ZUKUS INDUSTRIES L'],
  'zulia-towing-and-barge': ['Zulia Towing and Bar'],
};

/** Follows a merged id to the record that kept it. */
export function canonicalCompanyId(id: string): string {
  return COMPANY_MERGES[id] ?? id;
}
