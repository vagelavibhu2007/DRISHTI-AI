/**
 * Canonical Geographic Locations & Precision Coordinates for DRISHTI-AI
 * 
 * Provides verified coordinates for Indian districts, major metropolitan hubs,
 * key industrial corridors, major ports, mining clusters, and state fallback centroids.
 * 
 * Priority Hierarchy for Location Precision:
 * 1. Explicit project lat/lng (Exact Project Coordinates)
 * 2. Canonical District / City / Hub match (District / Site Precision)
 * 3. Canonical State Regional Centroid (Regional Jurisdiction Baseline)
 */

export const CANONICAL_LOCATIONS = {
  "ahmedabad": {
    "lat": 23.0225,
    "lng": 72.5714,
    "state": "Gujarat",
    "type": "district"
  },
  "surat": {
    "lat": 21.1702,
    "lng": 72.8311,
    "state": "Gujarat",
    "type": "district"
  },
  "vadodara": {
    "lat": 22.3072,
    "lng": 73.1812,
    "state": "Gujarat",
    "type": "district"
  },
  "baroda": {
    "lat": 22.3072,
    "lng": 73.1812,
    "state": "Gujarat",
    "type": "district"
  },
  "rajkot": {
    "lat": 22.3039,
    "lng": 70.8022,
    "state": "Gujarat",
    "type": "district"
  },
  "bhavnagar": {
    "lat": 21.7645,
    "lng": 72.1519,
    "state": "Gujarat",
    "type": "district"
  },
  "jamnagar": {
    "lat": 22.4707,
    "lng": 70.0577,
    "state": "Gujarat",
    "type": "district"
  },
  "junagadh": {
    "lat": 21.5222,
    "lng": 70.4579,
    "state": "Gujarat",
    "type": "district"
  },
  "gandhinagar": {
    "lat": 23.2156,
    "lng": 72.6369,
    "state": "Gujarat",
    "type": "district"
  },
  "kandla": {
    "lat": 23.0125,
    "lng": 70.2194,
    "state": "Gujarat",
    "type": "port"
  },
  "mundra": {
    "lat": 22.8394,
    "lng": 69.7258,
    "state": "Gujarat",
    "type": "port"
  },
  "kutch": {
    "lat": 23.7337,
    "lng": 69.8597,
    "state": "Gujarat",
    "type": "district"
  },
  "kachchh": {
    "lat": 23.7337,
    "lng": 69.8597,
    "state": "Gujarat",
    "type": "district"
  },
  "bhuj": {
    "lat": 23.242,
    "lng": 69.6669,
    "state": "Gujarat",
    "type": "district"
  },
  "gandhidham": {
    "lat": 23.0753,
    "lng": 70.1337,
    "state": "Gujarat",
    "type": "city"
  },
  "anand": {
    "lat": 22.5645,
    "lng": 72.9289,
    "state": "Gujarat",
    "type": "district"
  },
  "bharuch": {
    "lat": 21.7051,
    "lng": 72.9959,
    "state": "Gujarat",
    "type": "district"
  },
  "ankleshwar": {
    "lat": 21.6264,
    "lng": 73.0035,
    "state": "Gujarat",
    "type": "industrial_hub"
  },
  "dahej": {
    "lat": 21.7042,
    "lng": 72.5855,
    "state": "Gujarat",
    "type": "port"
  },
  "navsari": {
    "lat": 20.9467,
    "lng": 72.952,
    "state": "Gujarat",
    "type": "district"
  },
  "valsad": {
    "lat": 20.5992,
    "lng": 72.9342,
    "state": "Gujarat",
    "type": "district"
  },
  "vapi": {
    "lat": 20.3893,
    "lng": 72.9106,
    "state": "Gujarat",
    "type": "industrial_hub"
  },
  "morbi": {
    "lat": 22.812,
    "lng": 70.8378,
    "state": "Gujarat",
    "type": "district"
  },
  "mehsana": {
    "lat": 23.588,
    "lng": 72.3693,
    "state": "Gujarat",
    "type": "district"
  },
  "patan": {
    "lat": 23.8493,
    "lng": 72.1266,
    "state": "Gujarat",
    "type": "district"
  },
  "palanpur": {
    "lat": 24.1724,
    "lng": 72.4346,
    "state": "Gujarat",
    "type": "district"
  },
  "banaskantha": {
    "lat": 24.3368,
    "lng": 71.7621,
    "state": "Gujarat",
    "type": "district"
  },
  "sabarkantha": {
    "lat": 23.6896,
    "lng": 73.0374,
    "state": "Gujarat",
    "type": "district"
  },
  "himatnagar": {
    "lat": 23.5977,
    "lng": 72.9667,
    "state": "Gujarat",
    "type": "district"
  },
  "dahod": {
    "lat": 22.8373,
    "lng": 74.2546,
    "state": "Gujarat",
    "type": "district"
  },
  "godhra": {
    "lat": 22.7758,
    "lng": 73.6149,
    "state": "Gujarat",
    "type": "district"
  },
  "panchmahal": {
    "lat": 22.7533,
    "lng": 73.5594,
    "state": "Gujarat",
    "type": "district"
  },
  "porbandar": {
    "lat": 21.6417,
    "lng": 69.6293,
    "state": "Gujarat",
    "type": "district"
  },
  "dwarka": {
    "lat": 22.2442,
    "lng": 68.9685,
    "state": "Gujarat",
    "type": "district"
  },
  "somnath": {
    "lat": 20.906,
    "lng": 70.4012,
    "state": "Gujarat",
    "type": "district"
  },
  "veraval": {
    "lat": 20.9077,
    "lng": 70.3678,
    "state": "Gujarat",
    "type": "district"
  },
  "amreli": {
    "lat": 21.6032,
    "lng": 71.2221,
    "state": "Gujarat",
    "type": "district"
  },
  "surendranagar": {
    "lat": 22.7278,
    "lng": 71.6372,
    "state": "Gujarat",
    "type": "district"
  },
  "kheda": {
    "lat": 22.7533,
    "lng": 72.6841,
    "state": "Gujarat",
    "type": "district"
  },
  "nadiad": {
    "lat": 22.6916,
    "lng": 72.8634,
    "state": "Gujarat",
    "type": "city"
  },
  "narmada": {
    "lat": 21.87,
    "lng": 73.55,
    "state": "Gujarat",
    "type": "district"
  },
  "rajpipla": {
    "lat": 21.7882,
    "lng": 73.5026,
    "state": "Gujarat",
    "type": "city"
  },
  "tapi": {
    "lat": 21.2333,
    "lng": 73.4333,
    "state": "Gujarat",
    "type": "district"
  },
  "vyara": {
    "lat": 21.1118,
    "lng": 73.3937,
    "state": "Gujarat",
    "type": "city"
  },
  "dang": {
    "lat": 20.8333,
    "lng": 73.7167,
    "state": "Gujarat",
    "type": "district"
  },
  "botad": {
    "lat": 22.17,
    "lng": 71.66,
    "state": "Gujarat",
    "type": "district"
  },
  "arvalli": {
    "lat": 23.5,
    "lng": 73.3,
    "state": "Gujarat",
    "type": "district"
  },
  "modasa": {
    "lat": 23.4633,
    "lng": 73.2989,
    "state": "Gujarat",
    "type": "city"
  },
  "chhota udepur": {
    "lat": 22.3108,
    "lng": 74.0125,
    "state": "Gujarat",
    "type": "district"
  },
  "gir somnath": {
    "lat": 20.9,
    "lng": 70.6,
    "state": "Gujarat",
    "type": "district"
  },
  "devbhumi dwarka": {
    "lat": 22.25,
    "lng": 69.5,
    "state": "Gujarat",
    "type": "district"
  },
  "dholera": {
    "lat": 22.2472,
    "lng": 72.1969,
    "state": "Gujarat",
    "type": "industrial_hub"
  },
  "hazira": {
    "lat": 21.1167,
    "lng": 72.65,
    "state": "Gujarat",
    "type": "port"
  },
  "pipavav": {
    "lat": 20.9167,
    "lng": 71.5,
    "state": "Gujarat",
    "type": "port"
  },
  "sanand": {
    "lat": 22.9856,
    "lng": 72.3814,
    "state": "Gujarat",
    "type": "industrial_hub"
  },
  "mumbai": {
    "lat": 19.076,
    "lng": 72.8777,
    "state": "Maharashtra",
    "type": "district"
  },
  "pune": {
    "lat": 18.5204,
    "lng": 73.8567,
    "state": "Maharashtra",
    "type": "district"
  },
  "nagpur": {
    "lat": 21.1458,
    "lng": 79.0882,
    "state": "Maharashtra",
    "type": "district"
  },
  "nashik": {
    "lat": 19.9975,
    "lng": 73.7898,
    "state": "Maharashtra",
    "type": "district"
  },
  "aurangabad": {
    "lat": 19.8762,
    "lng": 75.3433,
    "state": "Maharashtra",
    "type": "district"
  },
  "chhatrapati sambhajinagar": {
    "lat": 19.8762,
    "lng": 75.3433,
    "state": "Maharashtra",
    "type": "district"
  },
  "thane": {
    "lat": 19.2183,
    "lng": 72.9781,
    "state": "Maharashtra",
    "type": "district"
  },
  "navi mumbai": {
    "lat": 19.033,
    "lng": 73.0297,
    "state": "Maharashtra",
    "type": "city"
  },
  "solapur": {
    "lat": 17.6599,
    "lng": 75.9064,
    "state": "Maharashtra",
    "type": "district"
  },
  "kolhapur": {
    "lat": 16.705,
    "lng": 74.2433,
    "state": "Maharashtra",
    "type": "district"
  },
  "amravati": {
    "lat": 20.932,
    "lng": 77.7523,
    "state": "Maharashtra",
    "type": "district"
  },
  "nanded": {
    "lat": 19.1383,
    "lng": 77.321,
    "state": "Maharashtra",
    "type": "district"
  },
  "jnpt": {
    "lat": 18.95,
    "lng": 72.95,
    "state": "Maharashtra",
    "type": "port"
  },
  "jawaharlal nehru port": {
    "lat": 18.95,
    "lng": 72.95,
    "state": "Maharashtra",
    "type": "port"
  },
  "nhava sheva": {
    "lat": 18.95,
    "lng": 72.95,
    "state": "Maharashtra",
    "type": "port"
  },
  "chandrapur": {
    "lat": 19.9615,
    "lng": 79.2961,
    "state": "Maharashtra",
    "type": "district"
  },
  "jalgaon": {
    "lat": 21.0077,
    "lng": 75.5626,
    "state": "Maharashtra",
    "type": "district"
  },
  "akola": {
    "lat": 20.7002,
    "lng": 77.0082,
    "state": "Maharashtra",
    "type": "district"
  },
  "latur": {
    "lat": 18.4088,
    "lng": 76.5604,
    "state": "Maharashtra",
    "type": "district"
  },
  "dhule": {
    "lat": 20.9042,
    "lng": 74.7749,
    "state": "Maharashtra",
    "type": "district"
  },
  "ahmednagar": {
    "lat": 19.0948,
    "lng": 74.748,
    "state": "Maharashtra",
    "type": "district"
  },
  "ahilyanagar": {
    "lat": 19.0948,
    "lng": 74.748,
    "state": "Maharashtra",
    "type": "district"
  },
  "satara": {
    "lat": 17.6805,
    "lng": 73.9935,
    "state": "Maharashtra",
    "type": "district"
  },
  "ratnagiri": {
    "lat": 16.9902,
    "lng": 73.312,
    "state": "Maharashtra",
    "type": "district"
  },
  "sindhudurg": {
    "lat": 16.1194,
    "lng": 73.7144,
    "state": "Maharashtra",
    "type": "district"
  },
  "raigad": {
    "lat": 18.5158,
    "lng": 73.1812,
    "state": "Maharashtra",
    "type": "district"
  },
  "palghar": {
    "lat": 19.6967,
    "lng": 72.7699,
    "state": "Maharashtra",
    "type": "district"
  },
  "wardha": {
    "lat": 20.7453,
    "lng": 78.6022,
    "state": "Maharashtra",
    "type": "district"
  },
  "yavatmal": {
    "lat": 20.3888,
    "lng": 78.1204,
    "state": "Maharashtra",
    "type": "district"
  },
  "buldhana": {
    "lat": 20.531,
    "lng": 76.1843,
    "state": "Maharashtra",
    "type": "district"
  },
  "bhandara": {
    "lat": 21.1687,
    "lng": 79.6543,
    "state": "Maharashtra",
    "type": "district"
  },
  "gondia": {
    "lat": 21.4598,
    "lng": 80.1961,
    "state": "Maharashtra",
    "type": "district"
  },
  "gadchiroli": {
    "lat": 20.1809,
    "lng": 80.0019,
    "state": "Maharashtra",
    "type": "district"
  },
  "beed": {
    "lat": 18.9891,
    "lng": 75.7601,
    "state": "Maharashtra",
    "type": "district"
  },
  "parbhani": {
    "lat": 19.2686,
    "lng": 76.7708,
    "state": "Maharashtra",
    "type": "district"
  },
  "hingoli": {
    "lat": 19.7173,
    "lng": 77.1486,
    "state": "Maharashtra",
    "type": "district"
  },
  "osmanabad": {
    "lat": 18.1856,
    "lng": 76.0419,
    "state": "Maharashtra",
    "type": "district"
  },
  "dharashiv": {
    "lat": 18.1856,
    "lng": 76.0419,
    "state": "Maharashtra",
    "type": "district"
  },
  "sangli": {
    "lat": 16.8524,
    "lng": 74.5815,
    "state": "Maharashtra",
    "type": "district"
  },
  "delhi": {
    "lat": 28.6139,
    "lng": 77.209,
    "state": "Delhi",
    "type": "district"
  },
  "new delhi": {
    "lat": 28.6139,
    "lng": 77.209,
    "state": "Delhi",
    "type": "district"
  },
  "noida": {
    "lat": 28.5355,
    "lng": 77.391,
    "state": "Uttar Pradesh",
    "type": "city"
  },
  "greater noida": {
    "lat": 28.4744,
    "lng": 77.504,
    "state": "Uttar Pradesh",
    "type": "city"
  },
  "gurugram": {
    "lat": 28.4595,
    "lng": 77.0266,
    "state": "Haryana",
    "type": "district"
  },
  "gurgaon": {
    "lat": 28.4595,
    "lng": 77.0266,
    "state": "Haryana",
    "type": "district"
  },
  "faridabad": {
    "lat": 28.4089,
    "lng": 77.3178,
    "state": "Haryana",
    "type": "district"
  },
  "ghaziabad": {
    "lat": 28.6692,
    "lng": 77.4538,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "lucknow": {
    "lat": 26.8467,
    "lng": 80.9462,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "kanpur": {
    "lat": 26.4499,
    "lng": 80.3319,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "varanasi": {
    "lat": 25.3176,
    "lng": 82.9739,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "banaras": {
    "lat": 25.3176,
    "lng": 82.9739,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "kashi": {
    "lat": 25.3176,
    "lng": 82.9739,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "prayagraj": {
    "lat": 25.4358,
    "lng": 81.8463,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "allahabad": {
    "lat": 25.4358,
    "lng": 81.8463,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "agra": {
    "lat": 27.1767,
    "lng": 78.0081,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "meerut": {
    "lat": 28.9845,
    "lng": 77.7064,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "bareilly": {
    "lat": 28.367,
    "lng": 79.4304,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "aligarh": {
    "lat": 27.8974,
    "lng": 78.088,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "moradabad": {
    "lat": 28.8386,
    "lng": 78.7733,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "gorakhpur": {
    "lat": 26.7606,
    "lng": 83.3732,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "jhansi": {
    "lat": 25.4484,
    "lng": 78.5685,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "ayodhya": {
    "lat": 26.7922,
    "lng": 82.1998,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "faizabad": {
    "lat": 26.7922,
    "lng": 82.1998,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "mathura": {
    "lat": 27.4924,
    "lng": 77.6737,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "muzaffarnagar": {
    "lat": 29.4727,
    "lng": 77.7085,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "saharanpur": {
    "lat": 29.9671,
    "lng": 77.551,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "sonbhadra": {
    "lat": 24.685,
    "lng": 83.065,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "singrauli up": {
    "lat": 24.2,
    "lng": 82.67,
    "state": "Uttar Pradesh",
    "type": "industrial_hub"
  },
  "mirzapur": {
    "lat": 25.146,
    "lng": 82.569,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "sultanpur": {
    "lat": 26.2648,
    "lng": 82.0727,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "amethi": {
    "lat": 26.155,
    "lng": 81.815,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "raebareli": {
    "lat": 26.2236,
    "lng": 81.2409,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "unnao": {
    "lat": 26.5471,
    "lng": 80.488,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "sitapur": {
    "lat": 27.5667,
    "lng": 80.6833,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "lakhimpur": {
    "lat": 27.95,
    "lng": 80.7833,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "hardoi": {
    "lat": 27.3989,
    "lng": 80.1311,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "etawah": {
    "lat": 26.7855,
    "lng": 79.0154,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "mainpuri": {
    "lat": 27.2289,
    "lng": 79.0253,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "firozabad": {
    "lat": 27.1591,
    "lng": 78.3957,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "bulandshahr": {
    "lat": 28.4069,
    "lng": 77.8498,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "hapur": {
    "lat": 28.7306,
    "lng": 77.7807,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "baghpat": {
    "lat": 28.9454,
    "lng": 77.2211,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "shamli": {
    "lat": 29.4489,
    "lng": 77.3117,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "bijnor": {
    "lat": 29.3724,
    "lng": 78.1358,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "sambhal": {
    "lat": 28.5855,
    "lng": 78.5684,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "amroha": {
    "lat": 28.9044,
    "lng": 78.4678,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "rampur": {
    "lat": 28.8154,
    "lng": 79.0257,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "pilibhit": {
    "lat": 28.631,
    "lng": 79.8028,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "shahjahanpur": {
    "lat": 27.8804,
    "lng": 79.912,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "badaun": {
    "lat": 28.031,
    "lng": 79.1245,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "kannauj": {
    "lat": 27.0544,
    "lng": 79.9197,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "farrukhabad": {
    "lat": 27.3828,
    "lng": 79.5829,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "auraiya": {
    "lat": 26.4671,
    "lng": 79.5167,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "jalaun": {
    "lat": 26.1472,
    "lng": 79.3364,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "orai": {
    "lat": 25.9898,
    "lng": 79.4507,
    "state": "Uttar Pradesh",
    "type": "city"
  },
  "hamirpur up": {
    "lat": 25.9524,
    "lng": 80.1524,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "mahoba": {
    "lat": 25.2921,
    "lng": 79.8722,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "banda": {
    "lat": 25.4754,
    "lng": 80.3347,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "chitrakoot": {
    "lat": 25.2106,
    "lng": 80.8931,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "fatehpur": {
    "lat": 25.9269,
    "lng": 80.8126,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "pratapgarh": {
    "lat": 25.8974,
    "lng": 81.9472,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "kaushambi": {
    "lat": 25.5342,
    "lng": 81.4283,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "barabanki": {
    "lat": 26.9272,
    "lng": 81.1824,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "gonda": {
    "lat": 27.1332,
    "lng": 81.9619,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "bahraich": {
    "lat": 27.5705,
    "lng": 81.5977,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "shravasti": {
    "lat": 27.7025,
    "lng": 81.9619,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "balrampur": {
    "lat": 27.43,
    "lng": 82.18,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "basti": {
    "lat": 26.7997,
    "lng": 82.763,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "sant kabir nagar": {
    "lat": 26.782,
    "lng": 83.032,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "siddharthnagar": {
    "lat": 27.2954,
    "lng": 82.8105,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "maharajganj": {
    "lat": 27.1442,
    "lng": 83.5624,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "kushinagar": {
    "lat": 26.7408,
    "lng": 83.889,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "deoria": {
    "lat": 26.5024,
    "lng": 83.7791,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "azamgarh": {
    "lat": 26.0738,
    "lng": 83.1859,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "mau": {
    "lat": 25.9417,
    "lng": 83.5611,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "ballia": {
    "lat": 25.7583,
    "lng": 84.1485,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "jaunpur": {
    "lat": 25.7464,
    "lng": 82.6837,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "ghazipur": {
    "lat": 25.584,
    "lng": 83.577,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "chandauli": {
    "lat": 25.2613,
    "lng": 83.2707,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "bhadohi": {
    "lat": 25.3941,
    "lng": 82.5694,
    "state": "Uttar Pradesh",
    "type": "district"
  },
  "chennai": {
    "lat": 13.0827,
    "lng": 80.2707,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "coimbatore": {
    "lat": 11.0168,
    "lng": 76.9558,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "madurai": {
    "lat": 9.9252,
    "lng": 78.1198,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "trichy": {
    "lat": 10.7905,
    "lng": 78.7047,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "tiruchirappalli": {
    "lat": 10.7905,
    "lng": 78.7047,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "salem": {
    "lat": 11.6643,
    "lng": 78.146,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "tirunelveli": {
    "lat": 8.7139,
    "lng": 77.7567,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "tuticorin": {
    "lat": 8.7642,
    "lng": 78.1348,
    "state": "Tamil Nadu",
    "type": "port"
  },
  "thoothukudi": {
    "lat": 8.7642,
    "lng": 78.1348,
    "state": "Tamil Nadu",
    "type": "port"
  },
  "ennore": {
    "lat": 13.2167,
    "lng": 80.3167,
    "state": "Tamil Nadu",
    "type": "port"
  },
  "kamarajar": {
    "lat": 13.2167,
    "lng": 80.3167,
    "state": "Tamil Nadu",
    "type": "port"
  },
  "hosur": {
    "lat": 12.7409,
    "lng": 77.8253,
    "state": "Tamil Nadu",
    "type": "industrial_hub"
  },
  "vellore": {
    "lat": 12.9165,
    "lng": 79.1325,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "erode": {
    "lat": 11.341,
    "lng": 77.7172,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "tiruppur": {
    "lat": 11.1085,
    "lng": 77.3411,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "dindigul": {
    "lat": 10.3673,
    "lng": 77.9803,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "thanjavur": {
    "lat": 10.787,
    "lng": 79.1378,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "ranipet": {
    "lat": 12.9298,
    "lng": 79.3328,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "kanchipuram": {
    "lat": 12.8342,
    "lng": 79.7036,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "chengalpattu": {
    "lat": 12.6841,
    "lng": 79.9836,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "tiruvallur": {
    "lat": 13.1432,
    "lng": 79.9079,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "kanyakumari": {
    "lat": 8.0883,
    "lng": 77.5385,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "cuddalore": {
    "lat": 11.748,
    "lng": 79.7714,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "nagapattinam": {
    "lat": 10.7656,
    "lng": 79.8424,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "ramnathapuram": {
    "lat": 9.3639,
    "lng": 78.8395,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "ramanathapuram": {
    "lat": 9.3639,
    "lng": 78.8395,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "karur": {
    "lat": 10.9601,
    "lng": 78.0766,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "dharmapuri": {
    "lat": 12.1211,
    "lng": 78.1582,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "krishnagiri": {
    "lat": 12.5186,
    "lng": 78.2138,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "viluppuram": {
    "lat": 11.9401,
    "lng": 79.4861,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "kallakurichi": {
    "lat": 11.7383,
    "lng": 78.9639,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "tiruvannamalai": {
    "lat": 12.2253,
    "lng": 79.0747,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "nilgiris": {
    "lat": 11.4167,
    "lng": 76.7,
    "state": "Tamil Nadu",
    "type": "district"
  },
  "ooty": {
    "lat": 11.4102,
    "lng": 76.695,
    "state": "Tamil Nadu",
    "type": "city"
  },
  "bengaluru": {
    "lat": 12.9716,
    "lng": 77.5946,
    "state": "Karnataka",
    "type": "district"
  },
  "bangalore": {
    "lat": 12.9716,
    "lng": 77.5946,
    "state": "Karnataka",
    "type": "district"
  },
  "mysuru": {
    "lat": 12.2958,
    "lng": 76.6394,
    "state": "Karnataka",
    "type": "district"
  },
  "mysore": {
    "lat": 12.2958,
    "lng": 76.6394,
    "state": "Karnataka",
    "type": "district"
  },
  "mangaluru": {
    "lat": 12.9141,
    "lng": 74.856,
    "state": "Karnataka",
    "type": "port"
  },
  "mangalore": {
    "lat": 12.9141,
    "lng": 74.856,
    "state": "Karnataka",
    "type": "port"
  },
  "new mangalore": {
    "lat": 12.93,
    "lng": 74.81,
    "state": "Karnataka",
    "type": "port"
  },
  "hubballi": {
    "lat": 15.3647,
    "lng": 75.124,
    "state": "Karnataka",
    "type": "district"
  },
  "hubli": {
    "lat": 15.3647,
    "lng": 75.124,
    "state": "Karnataka",
    "type": "district"
  },
  "dharwad": {
    "lat": 15.4589,
    "lng": 75.0078,
    "state": "Karnataka",
    "type": "district"
  },
  "belagavi": {
    "lat": 15.8497,
    "lng": 74.4977,
    "state": "Karnataka",
    "type": "district"
  },
  "belgaum": {
    "lat": 15.8497,
    "lng": 74.4977,
    "state": "Karnataka",
    "type": "district"
  },
  "kalaburagi": {
    "lat": 17.3297,
    "lng": 76.8343,
    "state": "Karnataka",
    "type": "district"
  },
  "gulbarga": {
    "lat": 17.3297,
    "lng": 76.8343,
    "state": "Karnataka",
    "type": "district"
  },
  "ballari": {
    "lat": 15.1394,
    "lng": 76.9214,
    "state": "Karnataka",
    "type": "district"
  },
  "bellary": {
    "lat": 15.1394,
    "lng": 76.9214,
    "state": "Karnataka",
    "type": "district"
  },
  "vijayanagara": {
    "lat": 15.27,
    "lng": 76.39,
    "state": "Karnataka",
    "type": "district"
  },
  "hospet": {
    "lat": 15.2689,
    "lng": 76.3909,
    "state": "Karnataka",
    "type": "city"
  },
  "shivamogga": {
    "lat": 13.9299,
    "lng": 75.5681,
    "state": "Karnataka",
    "type": "district"
  },
  "shimoga": {
    "lat": 13.9299,
    "lng": 75.5681,
    "state": "Karnataka",
    "type": "district"
  },
  "tumakuru": {
    "lat": 13.3409,
    "lng": 77.101,
    "state": "Karnataka",
    "type": "district"
  },
  "tumkur": {
    "lat": 13.3409,
    "lng": 77.101,
    "state": "Karnataka",
    "type": "district"
  },
  "davanagere": {
    "lat": 14.4644,
    "lng": 75.9218,
    "state": "Karnataka",
    "type": "district"
  },
  "udupi": {
    "lat": 13.3409,
    "lng": 74.7421,
    "state": "Karnataka",
    "type": "district"
  },
  "karwar": {
    "lat": 14.8185,
    "lng": 74.135,
    "state": "Karnataka",
    "type": "port"
  },
  "uttara kannada": {
    "lat": 14.795,
    "lng": 74.686,
    "state": "Karnataka",
    "type": "district"
  },
  "dakshina kannada": {
    "lat": 12.87,
    "lng": 75.2,
    "state": "Karnataka",
    "type": "district"
  },
  "hassan": {
    "lat": 13.0033,
    "lng": 76.1004,
    "state": "Karnataka",
    "type": "district"
  },
  "mandya": {
    "lat": 12.5218,
    "lng": 76.8951,
    "state": "Karnataka",
    "type": "district"
  },
  "kolar": {
    "lat": 13.1367,
    "lng": 78.1291,
    "state": "Karnataka",
    "type": "district"
  },
  "chikkaballapur": {
    "lat": 13.4325,
    "lng": 77.7275,
    "state": "Karnataka",
    "type": "district"
  },
  "ramanagara": {
    "lat": 12.7209,
    "lng": 77.2799,
    "state": "Karnataka",
    "type": "district"
  },
  "bidar": {
    "lat": 17.9104,
    "lng": 77.5199,
    "state": "Karnataka",
    "type": "district"
  },
  "raichur": {
    "lat": 16.212,
    "lng": 77.3439,
    "state": "Karnataka",
    "type": "district"
  },
  "koppal": {
    "lat": 15.3467,
    "lng": 76.1558,
    "state": "Karnataka",
    "type": "district"
  },
  "gadag": {
    "lat": 15.4319,
    "lng": 75.6358,
    "state": "Karnataka",
    "type": "district"
  },
  "bagalkot": {
    "lat": 16.1875,
    "lng": 75.698,
    "state": "Karnataka",
    "type": "district"
  },
  "vijayapura": {
    "lat": 16.8302,
    "lng": 75.71,
    "state": "Karnataka",
    "type": "district"
  },
  "bijapur": {
    "lat": 16.8302,
    "lng": 75.71,
    "state": "Karnataka",
    "type": "district"
  },
  "yadgir": {
    "lat": 16.7644,
    "lng": 77.1378,
    "state": "Karnataka",
    "type": "district"
  },
  "chamarajanagar": {
    "lat": 11.9261,
    "lng": 76.9437,
    "state": "Karnataka",
    "type": "district"
  },
  "kodagu": {
    "lat": 12.3375,
    "lng": 75.8069,
    "state": "Karnataka",
    "type": "district"
  },
  "coorg": {
    "lat": 12.3375,
    "lng": 75.8069,
    "state": "Karnataka",
    "type": "district"
  },
  "chikkamagaluru": {
    "lat": 13.3161,
    "lng": 75.772,
    "state": "Karnataka",
    "type": "district"
  },
  "chitradurga": {
    "lat": 14.2251,
    "lng": 76.4022,
    "state": "Karnataka",
    "type": "district"
  },
  "bhubaneswar": {
    "lat": 20.2961,
    "lng": 85.8245,
    "state": "Odisha",
    "type": "district"
  },
  "cuttack": {
    "lat": 20.4625,
    "lng": 85.8828,
    "state": "Odisha",
    "type": "district"
  },
  "paradeep": {
    "lat": 20.316,
    "lng": 86.611,
    "state": "Odisha",
    "type": "port"
  },
  "paradip": {
    "lat": 20.316,
    "lng": 86.611,
    "state": "Odisha",
    "type": "port"
  },
  "rourkela": {
    "lat": 22.2604,
    "lng": 84.8536,
    "state": "Odisha",
    "type": "city"
  },
  "sambalpur": {
    "lat": 21.4669,
    "lng": 83.9812,
    "state": "Odisha",
    "type": "district"
  },
  "jharsuguda": {
    "lat": 21.8554,
    "lng": 84.0062,
    "state": "Odisha",
    "type": "district"
  },
  "puri": {
    "lat": 19.8135,
    "lng": 85.8312,
    "state": "Odisha",
    "type": "district"
  },
  "balasore": {
    "lat": 21.4934,
    "lng": 86.9135,
    "state": "Odisha",
    "type": "district"
  },
  "baleshwar": {
    "lat": 21.4934,
    "lng": 86.9135,
    "state": "Odisha",
    "type": "district"
  },
  "angul": {
    "lat": 20.8444,
    "lng": 85.1011,
    "state": "Odisha",
    "type": "district"
  },
  "talcher": {
    "lat": 20.95,
    "lng": 85.2167,
    "state": "Odisha",
    "type": "industrial_hub"
  },
  "dhenkanal": {
    "lat": 20.6667,
    "lng": 85.6,
    "state": "Odisha",
    "type": "district"
  },
  "sundergarh": {
    "lat": 22.1167,
    "lng": 84.0333,
    "state": "Odisha",
    "type": "district"
  },
  "sundargarh": {
    "lat": 22.1167,
    "lng": 84.0333,
    "state": "Odisha",
    "type": "district"
  },
  "keonjhar": {
    "lat": 21.6289,
    "lng": 85.5817,
    "state": "Odisha",
    "type": "district"
  },
  "kendujhar": {
    "lat": 21.6289,
    "lng": 85.5817,
    "state": "Odisha",
    "type": "district"
  },
  "mayurbhanj": {
    "lat": 21.9333,
    "lng": 86.7333,
    "state": "Odisha",
    "type": "district"
  },
  "baripada": {
    "lat": 21.9333,
    "lng": 86.7333,
    "state": "Odisha",
    "type": "city"
  },
  "bhadrak": {
    "lat": 21.0574,
    "lng": 86.4959,
    "state": "Odisha",
    "type": "district"
  },
  "jajpur": {
    "lat": 20.85,
    "lng": 86.3333,
    "state": "Odisha",
    "type": "district"
  },
  "kalinganagar": {
    "lat": 20.96,
    "lng": 86.04,
    "state": "Odisha",
    "type": "industrial_hub"
  },
  "kendrapara": {
    "lat": 20.5,
    "lng": 86.42,
    "state": "Odisha",
    "type": "district"
  },
  "jagatsinghpur": {
    "lat": 20.27,
    "lng": 86.17,
    "state": "Odisha",
    "type": "district"
  },
  "khordha": {
    "lat": 20.18,
    "lng": 85.62,
    "state": "Odisha",
    "type": "district"
  },
  "nayagarh": {
    "lat": 20.13,
    "lng": 85.1,
    "state": "Odisha",
    "type": "district"
  },
  "ganjam": {
    "lat": 19.38,
    "lng": 85.05,
    "state": "Odisha",
    "type": "district"
  },
  "berhampur": {
    "lat": 19.315,
    "lng": 84.7941,
    "state": "Odisha",
    "type": "city"
  },
  "gopalpur": {
    "lat": 19.26,
    "lng": 84.9,
    "state": "Odisha",
    "type": "port"
  },
  "gajapati": {
    "lat": 18.81,
    "lng": 84.16,
    "state": "Odisha",
    "type": "district"
  },
  "kandhamal": {
    "lat": 20.14,
    "lng": 84.23,
    "state": "Odisha",
    "type": "district"
  },
  "boudh": {
    "lat": 20.84,
    "lng": 84.32,
    "state": "Odisha",
    "type": "district"
  },
  "subarnapur": {
    "lat": 20.83,
    "lng": 83.92,
    "state": "Odisha",
    "type": "district"
  },
  "sonapur": {
    "lat": 20.83,
    "lng": 83.92,
    "state": "Odisha",
    "type": "district"
  },
  "balangir": {
    "lat": 20.71,
    "lng": 83.48,
    "state": "Odisha",
    "type": "district"
  },
  "bolangir": {
    "lat": 20.71,
    "lng": 83.48,
    "state": "Odisha",
    "type": "district"
  },
  "nuapada": {
    "lat": 20.83,
    "lng": 82.53,
    "state": "Odisha",
    "type": "district"
  },
  "kalahandi": {
    "lat": 19.91,
    "lng": 83.17,
    "state": "Odisha",
    "type": "district"
  },
  "bhawanipatna": {
    "lat": 19.9,
    "lng": 83.17,
    "state": "Odisha",
    "type": "city"
  },
  "rayagada": {
    "lat": 19.17,
    "lng": 83.42,
    "state": "Odisha",
    "type": "district"
  },
  "nabarangpur": {
    "lat": 19.23,
    "lng": 82.55,
    "state": "Odisha",
    "type": "district"
  },
  "koraput": {
    "lat": 18.81,
    "lng": 82.71,
    "state": "Odisha",
    "type": "district"
  },
  "damanjodi": {
    "lat": 18.77,
    "lng": 82.87,
    "state": "Odisha",
    "type": "industrial_hub"
  },
  "malkangiri": {
    "lat": 18.35,
    "lng": 81.9,
    "state": "Odisha",
    "type": "district"
  },
  "bargarh": {
    "lat": 21.33,
    "lng": 83.62,
    "state": "Odisha",
    "type": "district"
  },
  "deogarh": {
    "lat": 21.53,
    "lng": 84.73,
    "state": "Odisha",
    "type": "district"
  },
  "kolkata": {
    "lat": 22.5726,
    "lng": 88.3639,
    "state": "West Bengal",
    "type": "district"
  },
  "howrah": {
    "lat": 22.5958,
    "lng": 88.2636,
    "state": "West Bengal",
    "type": "district"
  },
  "haldia": {
    "lat": 22.0667,
    "lng": 88.0667,
    "state": "West Bengal",
    "type": "port"
  },
  "durgapur": {
    "lat": 23.5204,
    "lng": 87.3119,
    "state": "West Bengal",
    "type": "city"
  },
  "asansol": {
    "lat": 23.6739,
    "lng": 86.9524,
    "state": "West Bengal",
    "type": "city"
  },
  "siliguri": {
    "lat": 26.7271,
    "lng": 88.3953,
    "state": "West Bengal",
    "type": "city"
  },
  "kharagpur": {
    "lat": 22.346,
    "lng": 87.232,
    "state": "West Bengal",
    "type": "city"
  },
  "bardhaman": {
    "lat": 23.2324,
    "lng": 87.8615,
    "state": "West Bengal",
    "type": "district"
  },
  "burdwan": {
    "lat": 23.2324,
    "lng": 87.8615,
    "state": "West Bengal",
    "type": "district"
  },
  "paschim bardhaman": {
    "lat": 23.68,
    "lng": 86.98,
    "state": "West Bengal",
    "type": "district"
  },
  "purba bardhaman": {
    "lat": 23.24,
    "lng": 87.87,
    "state": "West Bengal",
    "type": "district"
  },
  "paschim medinipur": {
    "lat": 22.42,
    "lng": 87.32,
    "state": "West Bengal",
    "type": "district"
  },
  "purba medinipur": {
    "lat": 21.93,
    "lng": 87.78,
    "state": "West Bengal",
    "type": "district"
  },
  "midnapore": {
    "lat": 22.42,
    "lng": 87.32,
    "state": "West Bengal",
    "type": "district"
  },
  "darjeeling": {
    "lat": 27.041,
    "lng": 88.2663,
    "state": "West Bengal",
    "type": "district"
  },
  "jalpaiguri": {
    "lat": 26.54,
    "lng": 88.72,
    "state": "West Bengal",
    "type": "district"
  },
  "alipurduar": {
    "lat": 26.49,
    "lng": 89.53,
    "state": "West Bengal",
    "type": "district"
  },
  "cooch behar": {
    "lat": 26.32,
    "lng": 89.45,
    "state": "West Bengal",
    "type": "district"
  },
  "malda": {
    "lat": 25.0,
    "lng": 88.14,
    "state": "West Bengal",
    "type": "district"
  },
  "maldah": {
    "lat": 25.0,
    "lng": 88.14,
    "state": "West Bengal",
    "type": "district"
  },
  "murshidabad": {
    "lat": 24.18,
    "lng": 88.27,
    "state": "West Bengal",
    "type": "district"
  },
  "nadia": {
    "lat": 23.47,
    "lng": 88.55,
    "state": "West Bengal",
    "type": "district"
  },
  "krishnanagar": {
    "lat": 23.4,
    "lng": 88.5,
    "state": "West Bengal",
    "type": "city"
  },
  "north 24 parganas": {
    "lat": 22.72,
    "lng": 88.48,
    "state": "West Bengal",
    "type": "district"
  },
  "south 24 parganas": {
    "lat": 22.17,
    "lng": 88.55,
    "state": "West Bengal",
    "type": "district"
  },
  "hooghly": {
    "lat": 22.9,
    "lng": 88.38,
    "state": "West Bengal",
    "type": "district"
  },
  "bankura": {
    "lat": 23.23,
    "lng": 87.07,
    "state": "West Bengal",
    "type": "district"
  },
  "purulia": {
    "lat": 23.33,
    "lng": 86.37,
    "state": "West Bengal",
    "type": "district"
  },
  "birbhum": {
    "lat": 23.84,
    "lng": 87.62,
    "state": "West Bengal",
    "type": "district"
  },
  "suri": {
    "lat": 23.91,
    "lng": 87.53,
    "state": "West Bengal",
    "type": "city"
  },
  "uttar dinajpur": {
    "lat": 25.62,
    "lng": 88.12,
    "state": "West Bengal",
    "type": "district"
  },
  "dakshin dinajpur": {
    "lat": 25.22,
    "lng": 88.77,
    "state": "West Bengal",
    "type": "district"
  },
  "kalimpong": {
    "lat": 27.06,
    "lng": 88.47,
    "state": "West Bengal",
    "type": "district"
  },
  "jhargram": {
    "lat": 22.45,
    "lng": 86.98,
    "state": "West Bengal",
    "type": "district"
  },
  "visakhapatnam": {
    "lat": 17.6868,
    "lng": 83.2185,
    "state": "Andhra Pradesh",
    "type": "port"
  },
  "vizag": {
    "lat": 17.6868,
    "lng": 83.2185,
    "state": "Andhra Pradesh",
    "type": "port"
  },
  "vijayawada": {
    "lat": 16.5062,
    "lng": 80.648,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "guntur": {
    "lat": 16.3067,
    "lng": 80.4365,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "tirupati": {
    "lat": 13.6288,
    "lng": 79.4192,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "kakinada": {
    "lat": 16.9891,
    "lng": 82.2475,
    "state": "Andhra Pradesh",
    "type": "port"
  },
  "nellore": {
    "lat": 14.4426,
    "lng": 79.9865,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "krishnapatnam": {
    "lat": 14.25,
    "lng": 80.12,
    "state": "Andhra Pradesh",
    "type": "port"
  },
  "kurnool": {
    "lat": 15.8281,
    "lng": 78.0373,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "kadapa": {
    "lat": 14.4673,
    "lng": 78.8242,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "ysr kadapa": {
    "lat": 14.4673,
    "lng": 78.8242,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "anantapur": {
    "lat": 14.6819,
    "lng": 77.6006,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "chittoor": {
    "lat": 13.2172,
    "lng": 79.1003,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "srikakulam": {
    "lat": 18.2949,
    "lng": 83.8938,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "vizianagaram": {
    "lat": 18.1133,
    "lng": 83.4073,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "eluru": {
    "lat": 16.7107,
    "lng": 81.0952,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "machilipatnam": {
    "lat": 16.1875,
    "lng": 81.1389,
    "state": "Andhra Pradesh",
    "type": "port"
  },
  "ongole": {
    "lat": 15.5057,
    "lng": 80.0499,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "prakasam": {
    "lat": 15.5057,
    "lng": 80.0499,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "rajahmundry": {
    "lat": 17.0005,
    "lng": 81.804,
    "state": "Andhra Pradesh",
    "type": "city"
  },
  "east godavari": {
    "lat": 17.0005,
    "lng": 81.804,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "west godavari": {
    "lat": 16.7107,
    "lng": 81.0952,
    "state": "Andhra Pradesh",
    "type": "district"
  },
  "amaravati": {
    "lat": 16.5417,
    "lng": 80.5158,
    "state": "Andhra Pradesh",
    "type": "city"
  },
  "sri city": {
    "lat": 13.53,
    "lng": 79.99,
    "state": "Andhra Pradesh",
    "type": "industrial_hub"
  },
  "hyderabad": {
    "lat": 17.385,
    "lng": 78.4867,
    "state": "Telangana",
    "type": "district"
  },
  "secunderabad": {
    "lat": 17.4399,
    "lng": 78.4983,
    "state": "Telangana",
    "type": "city"
  },
  "warangal": {
    "lat": 17.9689,
    "lng": 79.5941,
    "state": "Telangana",
    "type": "district"
  },
  "karimnagar": {
    "lat": 18.4386,
    "lng": 79.1288,
    "state": "Telangana",
    "type": "district"
  },
  "nizamabad": {
    "lat": 18.6725,
    "lng": 78.0941,
    "state": "Telangana",
    "type": "district"
  },
  "khammam": {
    "lat": 17.2473,
    "lng": 80.1514,
    "state": "Telangana",
    "type": "district"
  },
  "ramagundam": {
    "lat": 18.7551,
    "lng": 79.514,
    "state": "Telangana",
    "type": "industrial_hub"
  },
  "nalgonda": {
    "lat": 17.0577,
    "lng": 79.2684,
    "state": "Telangana",
    "type": "district"
  },
  "mahbubnagar": {
    "lat": 16.7488,
    "lng": 77.9868,
    "state": "Telangana",
    "type": "district"
  },
  "adilabad": {
    "lat": 19.6641,
    "lng": 78.532,
    "state": "Telangana",
    "type": "district"
  },
  "medak": {
    "lat": 18.0485,
    "lng": 78.2618,
    "state": "Telangana",
    "type": "district"
  },
  "sangareddy": {
    "lat": 17.619,
    "lng": 78.0815,
    "state": "Telangana",
    "type": "district"
  },
  "rangareddy": {
    "lat": 17.2403,
    "lng": 78.4294,
    "state": "Telangana",
    "type": "district"
  },
  "siddipet": {
    "lat": 18.1018,
    "lng": 78.852,
    "state": "Telangana",
    "type": "district"
  },
  "kothagudem": {
    "lat": 17.55,
    "lng": 80.62,
    "state": "Telangana",
    "type": "district"
  },
  "mancherial": {
    "lat": 18.87,
    "lng": 79.46,
    "state": "Telangana",
    "type": "district"
  },
  "jaipur": {
    "lat": 26.9124,
    "lng": 75.7873,
    "state": "Rajasthan",
    "type": "district"
  },
  "jodhpur": {
    "lat": 26.2389,
    "lng": 73.0243,
    "state": "Rajasthan",
    "type": "district"
  },
  "udaipur": {
    "lat": 24.5854,
    "lng": 73.7125,
    "state": "Rajasthan",
    "type": "district"
  },
  "kota": {
    "lat": 25.2138,
    "lng": 75.8648,
    "state": "Rajasthan",
    "type": "district"
  },
  "bikaner": {
    "lat": 28.0229,
    "lng": 73.3119,
    "state": "Rajasthan",
    "type": "district"
  },
  "ajmer": {
    "lat": 26.4499,
    "lng": 74.6399,
    "state": "Rajasthan",
    "type": "district"
  },
  "bhilwara": {
    "lat": 25.3407,
    "lng": 74.6313,
    "state": "Rajasthan",
    "type": "district"
  },
  "alwar": {
    "lat": 27.553,
    "lng": 76.6346,
    "state": "Rajasthan",
    "type": "district"
  },
  "bhiwadi": {
    "lat": 28.21,
    "lng": 76.86,
    "state": "Rajasthan",
    "type": "industrial_hub"
  },
  "barmer": {
    "lat": 25.7532,
    "lng": 71.4181,
    "state": "Rajasthan",
    "type": "district"
  },
  "jaisalmer": {
    "lat": 26.9157,
    "lng": 70.9083,
    "state": "Rajasthan",
    "type": "district"
  },
  "chittorgarh": {
    "lat": 24.8887,
    "lng": 74.6269,
    "state": "Rajasthan",
    "type": "district"
  },
  "sikar": {
    "lat": 27.6094,
    "lng": 75.1398,
    "state": "Rajasthan",
    "type": "district"
  },
  "jhunjhunu": {
    "lat": 28.1289,
    "lng": 75.3995,
    "state": "Rajasthan",
    "type": "district"
  },
  "nagaur": {
    "lat": 27.207,
    "lng": 73.7423,
    "state": "Rajasthan",
    "type": "district"
  },
  "pali": {
    "lat": 25.7713,
    "lng": 73.3234,
    "state": "Rajasthan",
    "type": "district"
  },
  "hanumangarh": {
    "lat": 29.581,
    "lng": 74.3294,
    "state": "Rajasthan",
    "type": "district"
  },
  "sri ganganagar": {
    "lat": 29.9094,
    "lng": 73.8799,
    "state": "Rajasthan",
    "type": "district"
  },
  "ganganagar": {
    "lat": 29.9094,
    "lng": 73.8799,
    "state": "Rajasthan",
    "type": "district"
  },
  "bharatpur": {
    "lat": 27.2152,
    "lng": 77.503,
    "state": "Rajasthan",
    "type": "district"
  },
  "dholpur": {
    "lat": 26.7025,
    "lng": 77.8934,
    "state": "Rajasthan",
    "type": "district"
  },
  "karauli": {
    "lat": 26.4984,
    "lng": 77.0229,
    "state": "Rajasthan",
    "type": "district"
  },
  "sawai madhopur": {
    "lat": 25.9928,
    "lng": 76.3526,
    "state": "Rajasthan",
    "type": "district"
  },
  "tonk": {
    "lat": 26.1664,
    "lng": 75.7885,
    "state": "Rajasthan",
    "type": "district"
  },
  "dausa": {
    "lat": 26.8925,
    "lng": 76.3377,
    "state": "Rajasthan",
    "type": "district"
  },
  "churu": {
    "lat": 28.29,
    "lng": 74.96,
    "state": "Rajasthan",
    "type": "district"
  },
  "jalore": {
    "lat": 25.34,
    "lng": 72.61,
    "state": "Rajasthan",
    "type": "district"
  },
  "sirohi": {
    "lat": 24.88,
    "lng": 72.86,
    "state": "Rajasthan",
    "type": "district"
  },
  "rajsamand": {
    "lat": 25.07,
    "lng": 73.88,
    "state": "Rajasthan",
    "type": "district"
  },
  "dungarpur": {
    "lat": 23.84,
    "lng": 73.71,
    "state": "Rajasthan",
    "type": "district"
  },
  "banswara": {
    "lat": 23.54,
    "lng": 74.44,
    "state": "Rajasthan",
    "type": "district"
  },
  "pratapgarh raj": {
    "lat": 24.03,
    "lng": 74.78,
    "state": "Rajasthan",
    "type": "district"
  },
  "baran": {
    "lat": 25.1,
    "lng": 76.51,
    "state": "Rajasthan",
    "type": "district"
  },
  "jhalawar": {
    "lat": 24.6,
    "lng": 76.15,
    "state": "Rajasthan",
    "type": "district"
  },
  "bundi": {
    "lat": 25.44,
    "lng": 75.64,
    "state": "Rajasthan",
    "type": "district"
  },
  "bhopal": {
    "lat": 23.2599,
    "lng": 77.4126,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "indore": {
    "lat": 22.7196,
    "lng": 75.8577,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "jabalpur": {
    "lat": 23.1815,
    "lng": 79.9864,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "gwalior": {
    "lat": 26.2183,
    "lng": 78.1828,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "ujjain": {
    "lat": 23.1765,
    "lng": 75.7885,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "sagar": {
    "lat": 23.8388,
    "lng": 78.7378,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "rewa": {
    "lat": 24.5362,
    "lng": 81.3037,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "singrauli": {
    "lat": 24.1997,
    "lng": 82.6645,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "satna": {
    "lat": 24.6005,
    "lng": 80.8322,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "katni": {
    "lat": 23.8343,
    "lng": 80.3992,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "chhindwara": {
    "lat": 22.0574,
    "lng": 78.9382,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "khandwa": {
    "lat": 21.8314,
    "lng": 76.3498,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "khargone": {
    "lat": 21.8236,
    "lng": 75.6186,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "dewas": {
    "lat": 22.9676,
    "lng": 76.0534,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "ratlam": {
    "lat": 23.3315,
    "lng": 75.0367,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "mandsaur": {
    "lat": 24.0722,
    "lng": 75.0683,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "neemuch": {
    "lat": 24.4754,
    "lng": 74.8717,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "vidisha": {
    "lat": 23.5251,
    "lng": 77.8081,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "sehore": {
    "lat": 23.2031,
    "lng": 77.0844,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "hoshangabad": {
    "lat": 22.7519,
    "lng": 77.7289,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "narmadapuram": {
    "lat": 22.7519,
    "lng": 77.7289,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "betul": {
    "lat": 21.9015,
    "lng": 77.9022,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "shivpuri": {
    "lat": 25.43,
    "lng": 77.65,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "guna": {
    "lat": 24.65,
    "lng": 77.31,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "damoh": {
    "lat": 23.83,
    "lng": 79.44,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "panna": {
    "lat": 24.72,
    "lng": 80.2,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "chhatarpur": {
    "lat": 24.92,
    "lng": 79.58,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "tikamgarh": {
    "lat": 24.74,
    "lng": 78.83,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "shahdol": {
    "lat": 23.29,
    "lng": 81.36,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "umaria": {
    "lat": 23.53,
    "lng": 80.83,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "anuppur": {
    "lat": 23.11,
    "lng": 81.69,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "dindori": {
    "lat": 22.95,
    "lng": 81.08,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "mandla": {
    "lat": 22.6,
    "lng": 80.38,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "seoni": {
    "lat": 22.08,
    "lng": 79.54,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "balaghat": {
    "lat": 21.81,
    "lng": 80.18,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "narsinghpur": {
    "lat": 22.95,
    "lng": 79.2,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "harda": {
    "lat": 22.34,
    "lng": 77.09,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "burhanpur": {
    "lat": 21.31,
    "lng": 76.23,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "barwani": {
    "lat": 22.04,
    "lng": 74.9,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "alirajpur": {
    "lat": 22.3,
    "lng": 74.35,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "jhabua": {
    "lat": 22.77,
    "lng": 74.6,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "dhar": {
    "lat": 22.6,
    "lng": 75.3,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "shajapur": {
    "lat": 23.43,
    "lng": 76.28,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "agar malwa": {
    "lat": 23.71,
    "lng": 76.01,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "rajgarh": {
    "lat": 24.01,
    "lng": 76.73,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "raisen": {
    "lat": 23.33,
    "lng": 77.78,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "ashoknagar": {
    "lat": 24.57,
    "lng": 77.73,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "sheopur": {
    "lat": 25.67,
    "lng": 76.7,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "morena": {
    "lat": 26.5,
    "lng": 78.0,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "bhind": {
    "lat": 26.56,
    "lng": 78.78,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "datia": {
    "lat": 25.67,
    "lng": 78.46,
    "state": "Madhya Pradesh",
    "type": "district"
  },
  "patna": {
    "lat": 25.5941,
    "lng": 85.1376,
    "state": "Bihar",
    "type": "district"
  },
  "gaya": {
    "lat": 24.7914,
    "lng": 85.0002,
    "state": "Bihar",
    "type": "district"
  },
  "muzaffarpur": {
    "lat": 26.1209,
    "lng": 85.3647,
    "state": "Bihar",
    "type": "district"
  },
  "bhagalpur": {
    "lat": 25.2425,
    "lng": 86.9842,
    "state": "Bihar",
    "type": "district"
  },
  "darbhanga": {
    "lat": 26.1542,
    "lng": 85.8918,
    "state": "Bihar",
    "type": "district"
  },
  "purnia": {
    "lat": 25.7771,
    "lng": 87.4753,
    "state": "Bihar",
    "type": "district"
  },
  "purnea": {
    "lat": 25.7771,
    "lng": 87.4753,
    "state": "Bihar",
    "type": "district"
  },
  "begusarai": {
    "lat": 25.4182,
    "lng": 86.1272,
    "state": "Bihar",
    "type": "district"
  },
  "barauni": {
    "lat": 25.4756,
    "lng": 85.9722,
    "state": "Bihar",
    "type": "industrial_hub"
  },
  "katihar": {
    "lat": 25.5541,
    "lng": 87.5722,
    "state": "Bihar",
    "type": "district"
  },
  "chapra": {
    "lat": 25.7848,
    "lng": 84.7274,
    "state": "Bihar",
    "type": "district"
  },
  "saran": {
    "lat": 25.7848,
    "lng": 84.7274,
    "state": "Bihar",
    "type": "district"
  },
  "aurangabad bihar": {
    "lat": 24.75,
    "lng": 84.37,
    "state": "Bihar",
    "type": "district"
  },
  "rohtas": {
    "lat": 24.95,
    "lng": 84.01,
    "state": "Bihar",
    "type": "district"
  },
  "sasaram": {
    "lat": 24.95,
    "lng": 84.01,
    "state": "Bihar",
    "type": "city"
  },
  "bhojpur": {
    "lat": 25.56,
    "lng": 84.67,
    "state": "Bihar",
    "type": "district"
  },
  "arrah": {
    "lat": 25.56,
    "lng": 84.67,
    "state": "Bihar",
    "type": "city"
  },
  "buxar": {
    "lat": 25.57,
    "lng": 83.98,
    "state": "Bihar",
    "type": "district"
  },
  "nalanda": {
    "lat": 25.2,
    "lng": 85.52,
    "state": "Bihar",
    "type": "district"
  },
  "biharsharif": {
    "lat": 25.2,
    "lng": 85.52,
    "state": "Bihar",
    "type": "city"
  },
  "vaishali": {
    "lat": 25.68,
    "lng": 85.22,
    "state": "Bihar",
    "type": "district"
  },
  "hajipur": {
    "lat": 25.68,
    "lng": 85.22,
    "state": "Bihar",
    "type": "city"
  },
  "samastipur": {
    "lat": 25.86,
    "lng": 85.78,
    "state": "Bihar",
    "type": "district"
  },
  "madhubani": {
    "lat": 26.35,
    "lng": 86.07,
    "state": "Bihar",
    "type": "district"
  },
  "sitamarhi": {
    "lat": 26.6,
    "lng": 85.48,
    "state": "Bihar",
    "type": "district"
  },
  "sheohar": {
    "lat": 26.51,
    "lng": 85.29,
    "state": "Bihar",
    "type": "district"
  },
  "motihari": {
    "lat": 26.65,
    "lng": 84.92,
    "state": "Bihar",
    "type": "city"
  },
  "east champaran": {
    "lat": 26.65,
    "lng": 84.92,
    "state": "Bihar",
    "type": "district"
  },
  "west champaran": {
    "lat": 26.8,
    "lng": 84.5,
    "state": "Bihar",
    "type": "district"
  },
  "bettiah": {
    "lat": 26.8,
    "lng": 84.5,
    "state": "Bihar",
    "type": "city"
  },
  "gopalganj": {
    "lat": 26.47,
    "lng": 84.44,
    "state": "Bihar",
    "type": "district"
  },
  "siwan": {
    "lat": 26.22,
    "lng": 84.36,
    "state": "Bihar",
    "type": "district"
  },
  "jehanabad": {
    "lat": 25.21,
    "lng": 84.98,
    "state": "Bihar",
    "type": "district"
  },
  "arwal": {
    "lat": 25.24,
    "lng": 84.67,
    "state": "Bihar",
    "type": "district"
  },
  "nawada": {
    "lat": 24.88,
    "lng": 85.54,
    "state": "Bihar",
    "type": "district"
  },
  "jamui": {
    "lat": 24.92,
    "lng": 86.22,
    "state": "Bihar",
    "type": "district"
  },
  "banka": {
    "lat": 24.88,
    "lng": 86.92,
    "state": "Bihar",
    "type": "district"
  },
  "munger": {
    "lat": 25.37,
    "lng": 86.47,
    "state": "Bihar",
    "type": "district"
  },
  "khagaria": {
    "lat": 25.5,
    "lng": 86.48,
    "state": "Bihar",
    "type": "district"
  },
  "saharsa": {
    "lat": 25.88,
    "lng": 86.6,
    "state": "Bihar",
    "type": "district"
  },
  "madhepura": {
    "lat": 25.92,
    "lng": 86.79,
    "state": "Bihar",
    "type": "district"
  },
  "supaul": {
    "lat": 26.12,
    "lng": 86.6,
    "state": "Bihar",
    "type": "district"
  },
  "araria": {
    "lat": 26.15,
    "lng": 87.52,
    "state": "Bihar",
    "type": "district"
  },
  "kishanganj": {
    "lat": 26.1,
    "lng": 87.95,
    "state": "Bihar",
    "type": "district"
  },
  "ranchi": {
    "lat": 23.3441,
    "lng": 85.3096,
    "state": "Jharkhand",
    "type": "district"
  },
  "jamshedpur": {
    "lat": 22.8046,
    "lng": 86.2029,
    "state": "Jharkhand",
    "type": "city"
  },
  "tatanagar": {
    "lat": 22.8046,
    "lng": 86.2029,
    "state": "Jharkhand",
    "type": "city"
  },
  "dhanbad": {
    "lat": 23.7957,
    "lng": 86.4304,
    "state": "Jharkhand",
    "type": "district"
  },
  "bokaro": {
    "lat": 23.6693,
    "lng": 86.1511,
    "state": "Jharkhand",
    "type": "district"
  },
  "deoghar": {
    "lat": 24.4826,
    "lng": 86.7001,
    "state": "Jharkhand",
    "type": "district"
  },
  "hazaribagh": {
    "lat": 23.9966,
    "lng": 85.3688,
    "state": "Jharkhand",
    "type": "district"
  },
  "giridih": {
    "lat": 24.1843,
    "lng": 86.3044,
    "state": "Jharkhand",
    "type": "district"
  },
  "ramgarh": {
    "lat": 23.63,
    "lng": 85.52,
    "state": "Jharkhand",
    "type": "district"
  },
  "koderma": {
    "lat": 24.47,
    "lng": 85.6,
    "state": "Jharkhand",
    "type": "district"
  },
  "chatra": {
    "lat": 24.21,
    "lng": 84.87,
    "state": "Jharkhand",
    "type": "district"
  },
  "palamu": {
    "lat": 24.03,
    "lng": 84.07,
    "state": "Jharkhand",
    "type": "district"
  },
  "medininagar": {
    "lat": 24.03,
    "lng": 84.07,
    "state": "Jharkhand",
    "type": "city"
  },
  "daltonganj": {
    "lat": 24.03,
    "lng": 84.07,
    "state": "Jharkhand",
    "type": "city"
  },
  "garhwa": {
    "lat": 24.18,
    "lng": 83.81,
    "state": "Jharkhand",
    "type": "district"
  },
  "latehar": {
    "lat": 23.74,
    "lng": 84.5,
    "state": "Jharkhand",
    "type": "district"
  },
  "lohardaga": {
    "lat": 23.43,
    "lng": 84.68,
    "state": "Jharkhand",
    "type": "district"
  },
  "gumla": {
    "lat": 23.04,
    "lng": 84.54,
    "state": "Jharkhand",
    "type": "district"
  },
  "simdega": {
    "lat": 22.61,
    "lng": 84.5,
    "state": "Jharkhand",
    "type": "district"
  },
  "west singhbhum": {
    "lat": 22.56,
    "lng": 85.81,
    "state": "Jharkhand",
    "type": "district"
  },
  "chaibasa": {
    "lat": 22.56,
    "lng": 85.81,
    "state": "Jharkhand",
    "type": "city"
  },
  "east singhbhum": {
    "lat": 22.8046,
    "lng": 86.2029,
    "state": "Jharkhand",
    "type": "district"
  },
  "saraikela": {
    "lat": 22.7,
    "lng": 85.93,
    "state": "Jharkhand",
    "type": "district"
  },
  "dumka": {
    "lat": 24.26,
    "lng": 87.25,
    "state": "Jharkhand",
    "type": "district"
  },
  "godda": {
    "lat": 24.83,
    "lng": 87.21,
    "state": "Jharkhand",
    "type": "district"
  },
  "sahibganj": {
    "lat": 25.24,
    "lng": 87.64,
    "state": "Jharkhand",
    "type": "district"
  },
  "pakur": {
    "lat": 24.63,
    "lng": 87.84,
    "state": "Jharkhand",
    "type": "district"
  },
  "jamtara": {
    "lat": 23.96,
    "lng": 86.8,
    "state": "Jharkhand",
    "type": "district"
  },
  "khunti": {
    "lat": 23.07,
    "lng": 85.28,
    "state": "Jharkhand",
    "type": "district"
  },
  "thiruvananthapuram": {
    "lat": 8.5241,
    "lng": 76.9366,
    "state": "Kerala",
    "type": "district"
  },
  "trivandrum": {
    "lat": 8.5241,
    "lng": 76.9366,
    "state": "Kerala",
    "type": "district"
  },
  "kochi": {
    "lat": 9.9312,
    "lng": 76.2673,
    "state": "Kerala",
    "type": "port"
  },
  "cochin": {
    "lat": 9.9312,
    "lng": 76.2673,
    "state": "Kerala",
    "type": "port"
  },
  "kozhikode": {
    "lat": 11.2588,
    "lng": 75.7804,
    "state": "Kerala",
    "type": "district"
  },
  "calicut": {
    "lat": 11.2588,
    "lng": 75.7804,
    "state": "Kerala",
    "type": "district"
  },
  "kollam": {
    "lat": 8.8932,
    "lng": 76.6141,
    "state": "Kerala",
    "type": "district"
  },
  "thrissur": {
    "lat": 10.5276,
    "lng": 76.2144,
    "state": "Kerala",
    "type": "district"
  },
  "kannur": {
    "lat": 11.8745,
    "lng": 75.3704,
    "state": "Kerala",
    "type": "district"
  },
  "alappuzha": {
    "lat": 9.4981,
    "lng": 76.3388,
    "state": "Kerala",
    "type": "district"
  },
  "alleppey": {
    "lat": 9.4981,
    "lng": 76.3388,
    "state": "Kerala",
    "type": "district"
  },
  "palakkad": {
    "lat": 10.7867,
    "lng": 76.6548,
    "state": "Kerala",
    "type": "district"
  },
  "kottayam": {
    "lat": 9.5916,
    "lng": 76.5222,
    "state": "Kerala",
    "type": "district"
  },
  "malappuram": {
    "lat": 11.051,
    "lng": 76.0711,
    "state": "Kerala",
    "type": "district"
  },
  "kasaragod": {
    "lat": 12.5102,
    "lng": 74.9852,
    "state": "Kerala",
    "type": "district"
  },
  "pathanamthitta": {
    "lat": 9.2648,
    "lng": 76.787,
    "state": "Kerala",
    "type": "district"
  },
  "idukki": {
    "lat": 9.85,
    "lng": 76.97,
    "state": "Kerala",
    "type": "district"
  },
  "wayanad": {
    "lat": 11.6854,
    "lng": 76.132,
    "state": "Kerala",
    "type": "district"
  },
  "guwahati": {
    "lat": 26.1445,
    "lng": 91.7362,
    "state": "Assam",
    "type": "district"
  },
  "kamrup": {
    "lat": 26.33,
    "lng": 91.6,
    "state": "Assam",
    "type": "district"
  },
  "dibrugarh": {
    "lat": 27.4728,
    "lng": 94.912,
    "state": "Assam",
    "type": "district"
  },
  "silchar": {
    "lat": 24.8333,
    "lng": 92.7789,
    "state": "Assam",
    "type": "district"
  },
  "cachar": {
    "lat": 24.8333,
    "lng": 92.7789,
    "state": "Assam",
    "type": "district"
  },
  "jorhat": {
    "lat": 26.7509,
    "lng": 94.2037,
    "state": "Assam",
    "type": "district"
  },
  "tinsukia": {
    "lat": 27.4922,
    "lng": 95.3468,
    "state": "Assam",
    "type": "district"
  },
  "tezpur": {
    "lat": 26.6528,
    "lng": 92.7926,
    "state": "Assam",
    "type": "district"
  },
  "sonitpur": {
    "lat": 26.6528,
    "lng": 92.7926,
    "state": "Assam",
    "type": "district"
  },
  "nagaon": {
    "lat": 26.3468,
    "lng": 92.684,
    "state": "Assam",
    "type": "district"
  },
  "bongaigaon": {
    "lat": 26.4789,
    "lng": 90.5593,
    "state": "Assam",
    "type": "district"
  },
  "barpeta": {
    "lat": 26.32,
    "lng": 91.0,
    "state": "Assam",
    "type": "district"
  },
  "dhubri": {
    "lat": 26.02,
    "lng": 89.97,
    "state": "Assam",
    "type": "district"
  },
  "goalpara": {
    "lat": 26.18,
    "lng": 90.62,
    "state": "Assam",
    "type": "district"
  },
  "karbi anglong": {
    "lat": 26.0,
    "lng": 93.3,
    "state": "Assam",
    "type": "district"
  },
  "dima hasao": {
    "lat": 25.35,
    "lng": 93.03,
    "state": "Assam",
    "type": "district"
  },
  "shillong": {
    "lat": 25.5788,
    "lng": 91.8933,
    "state": "Meghalaya",
    "type": "district"
  },
  "imphal": {
    "lat": 24.817,
    "lng": 93.9368,
    "state": "Manipur",
    "type": "district"
  },
  "aizawl": {
    "lat": 23.7271,
    "lng": 92.7176,
    "state": "Mizoram",
    "type": "district"
  },
  "agartala": {
    "lat": 23.8315,
    "lng": 91.2868,
    "state": "Tripura",
    "type": "district"
  },
  "kohima": {
    "lat": 25.6751,
    "lng": 94.1086,
    "state": "Nagaland",
    "type": "district"
  },
  "dimapur": {
    "lat": 25.909,
    "lng": 93.7266,
    "state": "Nagaland",
    "type": "district"
  },
  "itanagar": {
    "lat": 27.0844,
    "lng": 93.6053,
    "state": "Arunachal Pradesh",
    "type": "district"
  },
  "gangtok": {
    "lat": 27.3389,
    "lng": 88.6065,
    "state": "Sikkim",
    "type": "district"
  },
  "chandigarh": {
    "lat": 30.7333,
    "lng": 76.7794,
    "state": "Punjab",
    "type": "district"
  },
  "amritsar": {
    "lat": 31.634,
    "lng": 74.8723,
    "state": "Punjab",
    "type": "district"
  },
  "ludhiana": {
    "lat": 30.901,
    "lng": 75.8573,
    "state": "Punjab",
    "type": "district"
  },
  "jalandhar": {
    "lat": 31.326,
    "lng": 75.5762,
    "state": "Punjab",
    "type": "district"
  },
  "patiala": {
    "lat": 30.3398,
    "lng": 76.3869,
    "state": "Punjab",
    "type": "district"
  },
  "bathinda": {
    "lat": 30.211,
    "lng": 74.9455,
    "state": "Punjab",
    "type": "district"
  },
  "mohali": {
    "lat": 30.7046,
    "lng": 76.7179,
    "state": "Punjab",
    "type": "district"
  },
  "panipat": {
    "lat": 29.3909,
    "lng": 76.9635,
    "state": "Haryana",
    "type": "district"
  },
  "karnal": {
    "lat": 29.6857,
    "lng": 76.9905,
    "state": "Haryana",
    "type": "district"
  },
  "ambala": {
    "lat": 30.3782,
    "lng": 76.7767,
    "state": "Haryana",
    "type": "district"
  },
  "hisar": {
    "lat": 29.1492,
    "lng": 75.7217,
    "state": "Haryana",
    "type": "district"
  },
  "rohtak": {
    "lat": 28.8955,
    "lng": 76.6066,
    "state": "Haryana",
    "type": "district"
  },
  "sonipat": {
    "lat": 28.9931,
    "lng": 77.0151,
    "state": "Haryana",
    "type": "district"
  },
  "rewari": {
    "lat": 28.18,
    "lng": 76.62,
    "state": "Haryana",
    "type": "district"
  },
  "panchkula": {
    "lat": 30.6942,
    "lng": 76.8606,
    "state": "Haryana",
    "type": "district"
  },
  "srinagar": {
    "lat": 34.0837,
    "lng": 74.7973,
    "state": "Jammu and Kashmir",
    "type": "district"
  },
  "jammu": {
    "lat": 32.7266,
    "lng": 74.857,
    "state": "Jammu and Kashmir",
    "type": "district"
  },
  "udhampur": {
    "lat": 32.925,
    "lng": 75.1417,
    "state": "Jammu and Kashmir",
    "type": "district"
  },
  "baramulla": {
    "lat": 34.2,
    "lng": 74.34,
    "state": "Jammu and Kashmir",
    "type": "district"
  },
  "anantnag": {
    "lat": 33.7311,
    "lng": 75.1522,
    "state": "Jammu and Kashmir",
    "type": "district"
  },
  "kathua": {
    "lat": 32.37,
    "lng": 75.52,
    "state": "Jammu and Kashmir",
    "type": "district"
  },
  "leh": {
    "lat": 34.1526,
    "lng": 77.5771,
    "state": "Ladakh",
    "type": "district"
  },
  "kargil": {
    "lat": 34.5539,
    "lng": 76.1349,
    "state": "Ladakh",
    "type": "district"
  },
  "shimla": {
    "lat": 31.1048,
    "lng": 77.1734,
    "state": "Himachal Pradesh",
    "type": "district"
  },
  "mandi": {
    "lat": 31.5892,
    "lng": 76.9182,
    "state": "Himachal Pradesh",
    "type": "district"
  },
  "kullu": {
    "lat": 31.9579,
    "lng": 77.1095,
    "state": "Himachal Pradesh",
    "type": "district"
  },
  "manali": {
    "lat": 32.2432,
    "lng": 77.1892,
    "state": "Himachal Pradesh",
    "type": "city"
  },
  "dharamshala": {
    "lat": 32.219,
    "lng": 76.3234,
    "state": "Himachal Pradesh",
    "type": "city"
  },
  "kangra": {
    "lat": 32.0998,
    "lng": 76.2691,
    "state": "Himachal Pradesh",
    "type": "district"
  },
  "solan": {
    "lat": 30.9084,
    "lng": 77.0999,
    "state": "Himachal Pradesh",
    "type": "district"
  },
  "baddi": {
    "lat": 30.9578,
    "lng": 76.7914,
    "state": "Himachal Pradesh",
    "type": "industrial_hub"
  },
  "dehradun": {
    "lat": 30.3165,
    "lng": 78.0322,
    "state": "Uttarakhand",
    "type": "district"
  },
  "haridwar": {
    "lat": 29.9457,
    "lng": 78.1642,
    "state": "Uttarakhand",
    "type": "district"
  },
  "rishikesh": {
    "lat": 30.0869,
    "lng": 78.2676,
    "state": "Uttarakhand",
    "type": "city"
  },
  "haldwani": {
    "lat": 29.2183,
    "lng": 79.513,
    "state": "Uttarakhand",
    "type": "city"
  },
  "nainital": {
    "lat": 29.3919,
    "lng": 79.4542,
    "state": "Uttarakhand",
    "type": "district"
  },
  "rudrapur": {
    "lat": 28.98,
    "lng": 79.4,
    "state": "Uttarakhand",
    "type": "city"
  },
  "pantnagar": {
    "lat": 29.02,
    "lng": 79.48,
    "state": "Uttarakhand",
    "type": "industrial_hub"
  },
  "udham singh nagar": {
    "lat": 28.98,
    "lng": 79.4,
    "state": "Uttarakhand",
    "type": "district"
  },
  "chamoli": {
    "lat": 30.4,
    "lng": 79.33,
    "state": "Uttarakhand",
    "type": "district"
  },
  "tehri": {
    "lat": 30.38,
    "lng": 78.48,
    "state": "Uttarakhand",
    "type": "district"
  },
  "pauri": {
    "lat": 30.15,
    "lng": 78.78,
    "state": "Uttarakhand",
    "type": "district"
  },
  "pithoragarh": {
    "lat": 29.58,
    "lng": 80.22,
    "state": "Uttarakhand",
    "type": "district"
  },
  "raipur": {
    "lat": 21.2514,
    "lng": 81.6296,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "bhilai": {
    "lat": 21.1938,
    "lng": 81.3509,
    "state": "Chhattisgarh",
    "type": "city"
  },
  "durg": {
    "lat": 21.1904,
    "lng": 81.2849,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "bilaspur": {
    "lat": 22.0797,
    "lng": 82.1409,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "korba": {
    "lat": 22.3595,
    "lng": 82.7501,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "raigarh": {
    "lat": 21.8974,
    "lng": 83.395,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "jagdalpur": {
    "lat": 19.0732,
    "lng": 82.0129,
    "state": "Chhattisgarh",
    "type": "city"
  },
  "bastar": {
    "lat": 19.0732,
    "lng": 82.0129,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "rajnandgaon": {
    "lat": 21.1,
    "lng": 81.03,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "surguja": {
    "lat": 23.12,
    "lng": 83.2,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "ambikapur": {
    "lat": 23.12,
    "lng": 83.2,
    "state": "Chhattisgarh",
    "type": "city"
  },
  "kanker": {
    "lat": 20.27,
    "lng": 81.49,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "dantewada": {
    "lat": 18.9,
    "lng": 81.35,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "sukma": {
    "lat": 18.4,
    "lng": 81.67,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "bijapur cg": {
    "lat": 18.8,
    "lng": 80.82,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "narayanpur": {
    "lat": 19.72,
    "lng": 81.25,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "kondagaon": {
    "lat": 19.6,
    "lng": 81.67,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "mahasamund": {
    "lat": 21.11,
    "lng": 82.1,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "dhamtari": {
    "lat": 20.71,
    "lng": 81.55,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "gariaband": {
    "lat": 20.97,
    "lng": 82.06,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "balod": {
    "lat": 20.73,
    "lng": 81.2,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "bemetara": {
    "lat": 21.7,
    "lng": 81.55,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "kabirdham": {
    "lat": 22.02,
    "lng": 81.25,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "kawardha": {
    "lat": 22.02,
    "lng": 81.25,
    "state": "Chhattisgarh",
    "type": "city"
  },
  "mungeli": {
    "lat": 22.07,
    "lng": 81.69,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "janjgir": {
    "lat": 22.01,
    "lng": 82.57,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "champa": {
    "lat": 22.04,
    "lng": 82.65,
    "state": "Chhattisgarh",
    "type": "city"
  },
  "baloda bazar": {
    "lat": 21.66,
    "lng": 82.16,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "surajpur": {
    "lat": 23.22,
    "lng": 82.87,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "balrampur cg": {
    "lat": 23.61,
    "lng": 83.62,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "korea": {
    "lat": 23.25,
    "lng": 82.55,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "manendragarh": {
    "lat": 23.2,
    "lng": 82.2,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "jashpur": {
    "lat": 22.88,
    "lng": 84.14,
    "state": "Chhattisgarh",
    "type": "district"
  },
  "panaji": {
    "lat": 15.4909,
    "lng": 73.8278,
    "state": "Goa",
    "type": "district"
  },
  "north goa": {
    "lat": 15.55,
    "lng": 73.9,
    "state": "Goa",
    "type": "district"
  },
  "south goa": {
    "lat": 15.28,
    "lng": 74.05,
    "state": "Goa",
    "type": "district"
  },
  "mormugao": {
    "lat": 15.42,
    "lng": 73.8,
    "state": "Goa",
    "type": "port"
  },
  "vasco": {
    "lat": 15.3959,
    "lng": 73.8157,
    "state": "Goa",
    "type": "city"
  },
  "margao": {
    "lat": 15.2832,
    "lng": 73.9862,
    "state": "Goa",
    "type": "city"
  },
  "puducherry": {
    "lat": 11.9416,
    "lng": 79.8083,
    "state": "Puducherry",
    "type": "district"
  },
  "pondicherry": {
    "lat": 11.9416,
    "lng": 79.8083,
    "state": "Puducherry",
    "type": "district"
  },
  "port blair": {
    "lat": 11.6234,
    "lng": 92.7265,
    "state": "Andaman & Nicobar",
    "type": "district"
  },
  "andaman": {
    "lat": 11.7401,
    "lng": 92.6586,
    "state": "Andaman & Nicobar",
    "type": "district"
  },
  "daman": {
    "lat": 20.3974,
    "lng": 72.8328,
    "state": "Dadra & Nagar Haveli and Daman & Diu",
    "type": "district"
  },
  "diu": {
    "lat": 20.7144,
    "lng": 70.9874,
    "state": "Dadra & Nagar Haveli and Daman & Diu",
    "type": "district"
  },
  "silvassa": {
    "lat": 20.2763,
    "lng": 73.0083,
    "state": "Dadra & Nagar Haveli and Daman & Diu",
    "type": "district"
  }
};

export const STATE_CENTROIDS = {
  "Andhra Pradesh": [
    15.9129,
    79.74
  ],
  "Arunachal Pradesh": [
    28.218,
    94.7278
  ],
  "Assam": [
    26.2006,
    92.9376
  ],
  "Bihar": [
    25.0961,
    85.3131
  ],
  "Chhattisgarh": [
    21.2787,
    81.8661
  ],
  "Delhi": [
    28.7041,
    77.1025
  ],
  "Goa": [
    15.2993,
    74.124
  ],
  "Gujarat": [
    22.2587,
    71.1924
  ],
  "Haryana": [
    29.0588,
    76.0856
  ],
  "Himachal Pradesh": [
    31.1048,
    77.1734
  ],
  "Jammu and Kashmir": [
    33.7782,
    76.5762
  ],
  "Jharkhand": [
    23.6102,
    85.2799
  ],
  "Karnataka": [
    15.3173,
    75.7139
  ],
  "Kerala": [
    10.8505,
    76.2711
  ],
  "Ladakh": [
    34.1526,
    77.5771
  ],
  "Madhya Pradesh": [
    22.9734,
    78.6569
  ],
  "Maharashtra": [
    19.7515,
    75.7139
  ],
  "Manipur": [
    24.6637,
    93.9063
  ],
  "Meghalaya": [
    25.467,
    91.3662
  ],
  "Mizoram": [
    23.1645,
    92.9376
  ],
  "Nagaland": [
    26.1584,
    94.5624
  ],
  "Odisha": [
    20.9517,
    85.0985
  ],
  "Punjab": [
    31.1471,
    75.3412
  ],
  "Puducherry": [
    11.9416,
    79.8083
  ],
  "Rajasthan": [
    27.0238,
    74.2179
  ],
  "Sikkim": [
    27.533,
    88.5122
  ],
  "Tamil Nadu": [
    11.1271,
    78.6569
  ],
  "Telangana": [
    18.1124,
    79.0193
  ],
  "Tripura": [
    23.9408,
    91.9882
  ],
  "Uttar Pradesh": [
    26.8467,
    80.9462
  ],
  "Uttarakhand": [
    30.0668,
    79.0193
  ],
  "West Bengal": [
    22.9868,
    87.855
  ],
  "Andaman & Nicobar": [
    11.7401,
    92.6586
  ],
  "Dadra & Nagar Haveli and Daman & Diu": [
    20.1809,
    73.0169
  ]
};

/**
 * Resolves the geographic coordinates and honest precision attribution for a given project.
 * 
 * Precision Levels:
 * - EXACT_COORDINATES: Genuine project-specific latitude & longitude present in dataset.
 * - DISTRICT_LEVEL: Inferred administrative district coordinate.
 * - CITY_SITE_LEVEL: Inferred city, port, or industrial cluster coordinate from title.
 * - STATE_LEVEL: Inferred state regional centroid coordinate.
 * 
 * @param {Object} project - The project object
 * @returns {Object} { lat: number, lng: number, precision: string, precisionLabel: string, locationLabel: string, locationType: string, isExact: boolean }
 */
export function resolveProjectLocation(project) {
  if (!project) {
    return {
      lat: 20.5937,
      lng: 78.9629,
      precision: 'STATE_LEVEL',
      precisionLabel: 'State-level Regional Location',
      locationLabel: 'India Baseline',
      locationType: 'national',
      isExact: false
    };
  }

  // 1. Explicit project-specific coordinates (Only if genuine numbers exist)
  const rawLat = project.lat !== undefined && project.lat !== null ? Number(project.lat) : null;
  const rawLng = project.lng !== undefined && project.lng !== null ? Number(project.lng) : null;

  if (rawLat !== null && rawLng !== null && !isNaN(rawLat) && !isNaN(rawLng) && rawLat !== 0 && rawLng !== 0) {
    return {
      lat: rawLat,
      lng: rawLng,
      precision: 'EXACT_COORDINATES',
      precisionLabel: 'Exact Project Coordinates',
      locationLabel: project.locationName || 'Project Site Coordinates',
      locationType: 'exact_site',
      isExact: true
    };
  }

  // 2. Explicit district field match
  if (project.district && typeof project.district === 'string') {
    const distKey = project.district.trim().toLowerCase();
    if (CANONICAL_LOCATIONS[distKey]) {
      const match = CANONICAL_LOCATIONS[distKey];
      return {
        lat: match.lat,
        lng: match.lng,
        precision: 'DISTRICT_LEVEL',
        precisionLabel: 'District-level Location',
        locationLabel: project.district.trim(),
        locationType: match.type || 'district',
        isExact: false
      };
    }
  }

  // 3. Match project name keywords against canonical cities / hubs / districts
  const name = String(project.projectName || project.name || '').toLowerCase();
  
  // Sort keys by length descending to match multi-word phrases first (e.g. 'new delhi', 'south goa')
  const sortedKeys = Object.keys(CANONICAL_LOCATIONS).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    // Regex boundary check for exact word match
    const regex = new RegExp('(?:\\b|[_-])' + key.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1') + '(?:\\b|[_-])', 'i');
    if (regex.test(name)) {
      const match = CANONICAL_LOCATIONS[key];
      const capName = key.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const isDistrict = match.type === 'district';
      return {
        lat: match.lat,
        lng: match.lng,
        precision: isDistrict ? 'DISTRICT_LEVEL' : 'CITY_SITE_LEVEL',
        precisionLabel: isDistrict ? 'District-level Location' : 'City/Site-level Location',
        locationLabel: capName,
        locationType: match.type || 'city',
        isExact: false
      };
    }
  }

  // 4. State centroid fallback
  const rawState = project.state || '';
  const firstState = rawState.replace(/Multi-States\s*\(/i, '').split(/[,&/(]/)[0].trim();
  
  for (const [stName, coords] of Object.entries(STATE_CENTROIDS)) {
    if (stName.toLowerCase() === firstState.toLowerCase() || firstState.toLowerCase().includes(stName.toLowerCase())) {
      return {
        lat: coords[0],
        lng: coords[1],
        precision: 'STATE_LEVEL',
        precisionLabel: 'State-level Regional Location',
        locationLabel: stName,
        locationType: 'state_centroid',
        isExact: false
      };
    }
  }

  // Default national centroid
  return {
    lat: 20.5937,
    lng: 78.9629,
    precision: 'STATE_LEVEL',
    precisionLabel: 'State-level Regional Location',
    locationLabel: rawState || 'National',
    locationType: 'state_centroid',
    isExact: false
  };
}
