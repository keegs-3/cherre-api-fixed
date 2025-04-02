const fetch = require('node-fetch');

const AUTH_TOKEN = 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO';

// 🔥 Replace this with any GraphQL object you want to test
const objectType = 'tax_assessor_owner_v2';

const fieldsToTest = [
  'tax_assessor_id',
  'owner_name',
  'owner_type',
  'ownership_percent',
  'mailing_address',
  'is_primary_owner',
  'owner_mailing_city',
  'owner_mailing_state',
  'owner_mailing_zip',
  'is_corporate_owner'
];

async function testField(field) {
  const query = `
    query {
      ${objectType}(limit: 1) {
        ${field}
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.cherre.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: AUTH_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    if (result.errors) {
      console.log(`❌ [INVALID] ${field}`);
    } else {
      console.log(`✅ [VALID]   ${field}`);
    }
  } catch (err) {
    console.log(`🔥 [ERROR]    ${field} → ${err.message}`);
  }
}

(async () => {
  console.log(`🔍 Scanning "${objectType}" for valid fields...\n`);
  for (const field of fieldsToTest) {
    await testField(field);
  }
})();
