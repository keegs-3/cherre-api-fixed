const fetch = require('node-fetch');

const AUTH_TOKEN = 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO';

const objectType = 'tax_assessor_block_v2'; // ← change this per scan

const fieldsToTest = [
  'tax_assessor_id',
  'block_number',
  'block_type',
  'block_status',
  'block_description',
  'block_condition'
];


(async () => {
  console.log(`🧠 Using objectType: ${objectType}`);
  if (objectType !== 'tax_assessor_owner_v2') {
    throw new Error(`🚨 Wrong objectType! Currently set to: ${objectType}`);
  }

  console.log(`\n🔍 Scanning "${objectType}" for valid fields...\n`);

  for (const field of fieldsToTest) {
    const query = `
      query {
        ${objectType}(limit: 1) {
          ${field}
        }
      }
    `;

    console.log(`👉 QUERYING: ${objectType} → ${field}`);

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
      console.log(`🔥 [ERROR] ${field} → ${err.message}`);
    }
  }
})();
