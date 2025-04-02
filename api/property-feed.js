const fetch = require('node-fetch');

const AUTH_TOKEN = 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO';

// 🧠 Initial field list (cut down from DD, adjust as needed)
const fieldsToTest = [
  'assessed_value',
  'market_value',
  'tax_assessor_id',
  'year_built',
  'building_area_sq_ft',
  'land_area_acres',
  'zoning_code',
  'owner_occupied',
  'last_sale_price',
  'last_sale_date',
  'property_city',
  'property_state',
  'property_zip',
  'property_address',
  'mailing_address',
  'property_type',
  'apn',
  'county',
  'school_district',
];

const testField = async (field) => {
  const query = `
    query {
      tax_assessor_v2(limit: 1) {
        ${field}
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.cherre.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      console.log(`❌ [INVALID] ${field}`);
    } else {
      console.log(`✅ [VALID]   ${field}`);
    }
  } catch (err) {
    console.log(`🔥 [ERROR]   ${field} — ${err.message}`);
  }
};

(async () => {
  console.log(`🔍 Testing ${fieldsToTest.length} fields...\n`);
  for (const field of fieldsToTest) {
    await testField(field);
  }
})();
