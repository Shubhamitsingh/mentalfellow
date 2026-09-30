import { site } from '@/lib/site'
import { readJson, writeJson } from '@/utils/storage'

const DELIVERY_KEY = 'mf_delivery_pin_v1'

const places = {
  110: 'Delhi',
  121: 'Faridabad',
  122: 'Gurugram',
  124: 'Rohtak',
  132: 'Karnal',
  134: 'Panchkula',
  140: 'Mohali',
  141: 'Ludhiana',
  143: 'Amritsar',
  144: 'Jalandhar',
  151: 'Bathinda',
  160: 'Chandigarh',
  171: 'Shimla',
  180: 'Jammu',
  190: 'Srinagar',
  201: 'Noida',
  208: 'Kanpur',
  211: 'Prayagraj',
  221: 'Varanasi',
  226: 'Lucknow',
  248: 'Dehradun',
  250: 'Meerut',
  273: 'Gorakhpur',
  282: 'Agra',
  302: 'Jaipur',
  313: 'Udaipur',
  324: 'Kota',
  342: 'Jodhpur',
  360: 'Rajkot',
  380: 'Ahmedabad',
  390: 'Vadodara',
  395: 'Surat',
  400: 'Mumbai',
  401: 'Thane',
  403: 'Goa',
  411: 'Pune',
  416: 'Kolhapur',
  422: 'Nashik',
  431: 'Chhatrapati Sambhajinagar',
  440: 'Nagpur',
  452: 'Indore',
  462: 'Bhopal',
  474: 'Gwalior',
  482: 'Jabalpur',
  492: 'Raipur',
  500: 'Hyderabad',
  520: 'Vijayawada',
  530: 'Visakhapatnam',
  560: 'Bengaluru',
  570: 'Mysuru',
  575: 'Mangaluru',
  580: 'Hubballi',
  600: 'Chennai',
  605: 'Puducherry',
  620: 'Tiruchirappalli',
  625: 'Madurai',
  641: 'Coimbatore',
  670: 'Kannur',
  673: 'Kozhikode',
  682: 'Kochi',
  695: 'Thiruvananthapuram',
  700: 'Kolkata',
  711: 'Howrah',
  734: 'Siliguri',
  737: 'Gangtok',
  751: 'Bhubaneswar',
  781: 'Guwahati',
  793: 'Shillong',
  795: 'Imphal',
  799: 'Agartala',
  800: 'Patna',
  826: 'Dhanbad',
  831: 'Jamshedpur',
  834: 'Ranchi',
}

export function estimateShipping(subtotal) {
  if (!subtotal || subtotal <= 0) return 0
  if (subtotal >= site.freeShippingThreshold) return 0
  return site.shippingFee
}

export function checkPincode(code) {
  const clean = String(code || '').trim()
  if (!/^[1-9][0-9]{5}$/.test(clean)) {
    return { ok: false, message: 'Enter a 6-digit pincode.' }
  }

  const city = places[Number(clean.slice(0, 3))] || null
  return {
    ok: true,
    pincode: clean,
    city,
    message: city
      ? `Estimated delivery in 3–6 days to ${city}. Shipping is confirmed at checkout.`
      : 'Estimated delivery in 3–6 days. Shipping is confirmed at checkout.',
  }
}

export function readDeliveryPin() {
  const saved = readJson(DELIVERY_KEY, null)
  if (!saved?.pincode) return null
  const result = checkPincode(saved.pincode)
  return result.ok ? result : null
}

export function saveDeliveryPin(result) {
  if (!result?.ok) return
  writeJson(DELIVERY_KEY, { pincode: result.pincode, city: result.city })
  window.dispatchEvent(new Event('mf-delivery'))
}
